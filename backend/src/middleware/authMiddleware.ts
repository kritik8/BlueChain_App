import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // ✅ Read token from HTTP-only cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in .env");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

    // Attach user to request
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if user is a generator
    if (user.role !== "GENERATOR") {
      return res.status(403).json({ message: "Only generators can perform this action" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
