import { Request, Response } from 'express';
import * as     AuthService from '../services/auth.service'
import User from "../models/user.model";


export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await AuthService.registerUser(req.body);
        return res.status(201).json(user);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    };
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { user, accessToken, refreshToken } =
            await AuthService.loginUser(req.body);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000, // 15 min
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, 
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            user
        });
    } catch (e: any) {
        return res.status(400).json({ message: e.message });
    }
}

export const refresh = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ message: "No refresh token" });
        }

        const result = await AuthService.refreshToken(token);

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: false, 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            accessToken: result.accessToken
        });
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            await AuthService.logoutUser(token);
        }

        res.clearCookie("refreshToken");

        return res.json({ message: "Logged out successfully" });
    } catch (e: any) {
        return res.status(200).json({ message: "Logged out" });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.userId;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(user);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

