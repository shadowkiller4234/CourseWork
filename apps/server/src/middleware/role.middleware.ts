import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const roleMiddleware = (...roles: string[]) => {
    return (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            console.log("USER:", req.user);
            console.log("ROLE:", req.user?.role);
            if (!req.user) {
                return res.status(401).json({
                    message: "User not authorized"
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Server error"
            });
        }
    };
    
};