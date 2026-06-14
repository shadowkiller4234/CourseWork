import { Request, Response } from "express";
import { getAllUsers as getAllUsersService } from "../services/auth.service";
import User from "../models/user.model";
import * as AuthService from '../services/auth.service'

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsersService();
        return res.json(users);
    } catch (e: any) {
        return res.status(500).json({ message: e.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await AuthService.registerUser(req.body);
        return res.status(201).json(user);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    };
};