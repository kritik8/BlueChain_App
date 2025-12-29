import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import imagekit from "../config/imagekit";
import User from "../models/User";
import jwt from "jsonwebtoken";

// Interfaces
interface UploadedDoc {
  fileId: string;
  name: string;
  url: string;
}

interface IncomingDoc {
  name: string;
  base64: string;
}

// =======================
// REGISTER USER
// =======================
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      role,
      email,
      password,

      // GENERATOR
      organizationName,
      registrationNumber,

      // CONSUMER
      companyName,
      taxId,
      securityAnswer,

      // VALIDATOR
      aadhaarNumber,
      phoneNumber,
      verificationCode,

      documents,
    } = req.body;

    // -----------------------
    // Common validation
    // -----------------------
    if (!role || !email) {
      return res.status(400).json({ message: "Role and email are required" });
    }

    if (role !== "VALIDATOR" && !password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // -----------------------
    // Role-based validation
    // -----------------------
    if (role === "GENERATOR") {
      if (!organizationName || !registrationNumber) {
        return res
          .status(400)
          .json({ message: "Organization details required for GENERATOR" });
      }
    }

    if (role === "CONSUMER") {
      if (!companyName || !taxId || !securityAnswer) {
        return res
          .status(400)
          .json({ message: "Company details required for CONSUMER" });
      }
    }

    if (role === "VALIDATOR") {
      if (!aadhaarNumber || !phoneNumber || !verificationCode) {
        return res.status(400).json({
          message:
            "Aadhaar number, phone number, and verification code are required for VALIDATOR",
        });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // -----------------------
    // Hashing
    // -----------------------
    const hashedPassword =
      role !== "VALIDATOR" ? await bcrypt.hash(password, 10) : undefined;

    const hashedSecurityAnswer =
      role === "CONSUMER" ? await bcrypt.hash(securityAnswer, 10) : undefined;

    const hashedVerificationCode =
      role === "VALIDATOR"
        ? await bcrypt.hash(verificationCode, 10)
        : undefined;

    // -----------------------
    // Save user
    // -----------------------
    const newUser = new User({
      role,
      email,
      password: hashedPassword,

      organizationName,
      registrationNumber,

      companyName,
      taxId,
      securityAnswer: hashedSecurityAnswer,

      aadhaarNumber,
      phoneNumber,
      verificationCode: hashedVerificationCode,
      isDigiLockerVerified: false,

      documents,
    });

    await newUser.save();

    const {
      password: _,
      securityAnswer: __,
      verificationCode: ___,
      ...userData
    } = newUser.toObject();

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// LOGIN USER
// =======================
// =======================
// LOGIN USER
// =======================
export const loginUser = async (req: Request, res: Response) => {
  try {
    const {
      role,

      // GENERATOR
      organizationName,
      registrationNumber,
      password,

      // CONSUMER
      companyName,
      taxId,

      // VALIDATOR
      aadhaarNumber,
      verificationCode,
    } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    let user;

    // -----------------------
    // GENERATOR
    // -----------------------
    if (role === "GENERATOR") {
      if (!organizationName || !registrationNumber || !password) {
        return res
          .status(400)
          .json({ message: "Generator credentials required" });
      }
      user = await User.findOne({ role, organizationName, registrationNumber });

      if (
        !user ||
        !user.password ||
        !(await bcrypt.compare(password, user.password))
      ) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    // -----------------------
    // CONSUMER
    // -----------------------
    else if (role === "CONSUMER") {
      if (!companyName || !taxId || !password) {
        return res
          .status(400)
          .json({ message: "Consumer credentials required" });
      }
      user = await User.findOne({ role, companyName, taxId });

      if (
        !user ||
        !user.password ||
        !(await bcrypt.compare(password, user.password))
      ) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    // -----------------------
    // VALIDATOR (OTP-based)
    // -----------------------
    else if (role === "VALIDATOR") {
      if (!aadhaarNumber || !verificationCode) {
        return res
          .status(400)
          .json({ message: "Aadhaar and verification code required" });
      }

      user = await User.findOne({ role, aadhaarNumber });
      if (!user) {
        return res.status(401).json({ message: "Validator not found" });
      }

      const isCodeValid =
        user.verificationCode &&
        (await bcrypt.compare(verificationCode, user.verificationCode));

      if (!isCodeValid) {
        return res.status(401).json({ message: "Invalid verification code" });
      }
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // -----------------------
    // Issue token
    // -----------------------
    const token = jwt.sign(
      { userId: user._id, role: user.role } as any,
      (process.env.JWT_SECRET || "your-secret-key") as any,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any } as any
    );

    const {
      password: _,
      securityAnswer: __,
      verificationCode: ___,
      ...userData
    } = user.toObject();

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout user (clear cookie)
export const logoutUser = async (req: Request, res: Response) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // expire immediately
    })
    .json({ message: "Logout successful" });
};
