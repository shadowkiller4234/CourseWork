import argon2 from 'argon2';
import jwt from "jsonwebtoken";
import User from '../models/user.model';
import { CreateUserDTO } from '../interfaces/create-user.dto';
import { LoginUserDTO } from '../interfaces/login-user.dto';
import RefreshToken from "../models/refreshToken.models";

export const registerUser = async (data: CreateUserDTO) => {
    const existingUser = await User.findOne({
        email: data.email
    })

    if(existingUser) {
        throw new Error('User is already registered');
    };

    const hashPassword = await argon2.hash(data.password);

    const user = await User.create({
        ...data,
        password: hashPassword
    });

    return user;
}

export const loginUser = async (data: LoginUserDTO) => {
    const user = await User.findOne({
        email: data.email
    });

    if (!user) {
        throw new Error("User not found");
    };

    const isPasswordValid = await argon2.verify(user.password, data.password);

    if (!isPasswordValid) {
        throw new Error("Invalid password");
    };

    const accessToken = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: "7d" }
    );

    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    const { password, ...safeUser } = user.toObject();

    return {
        user: safeUser,
        accessToken,
        refreshToken
    };
}

export const refreshToken = async (token: string) => {
    if (!token) throw new Error("No refresh token");

    const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string
    ) as any;

    const stored = await RefreshToken.findOne({ token });

    if (!stored) {
        throw new Error("Invalid refresh token");
    }

    await RefreshToken.deleteOne({ token });

    const newAccessToken = jwt.sign(
        {
            userId: decoded.userId,
            role: decoded.role,   // 🔥
            email: decoded.email, // 🔥
        },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: "7d" }
    );

    await RefreshToken.create({
        userId: decoded.userId,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
};

export const logoutUser = async (token: string) => {
    if (!token) {
        throw new Error("No refresh token");
    }

    await RefreshToken.deleteOne({ token });

    return true;
};

export const getAllUsers = async () => {
    const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

    return users;
};