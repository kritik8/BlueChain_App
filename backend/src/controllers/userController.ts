{/*import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import imagekit from "../config/imagekit";
import User from "../models/User";
import jwt from "jsonwebtoken";


// Interface for uploaded documents
interface UploadedDoc {
  fileId: string;
  name: string;
  url: string;
}

// Interface for incoming documents in JSON
interface IncomingDoc {
  name: string;
  base64: string;
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      role,
      email,
      password,
      organizationName,
      registrationNumber,
      companyName,
      taxId,
      securityAnswer,
      documents
    }: {
      role: string;
      email: string;
      password: string;
      organizationName?: string;
      registrationNumber?: string;
      companyName?: string;
      taxId?: string;
      securityAnswer?: string;
      documents?: IncomingDoc[];
    } = req.body;

    // Basic validation
    if (!role || !email || !password) {
      return res.status(400).json({ message: "Role, email, and password are required" });
    }

    if (role === "GENERATOR" && (!organizationName || !registrationNumber)) {
      return res.status(400).json({ message: "Organization details are required for GENERATOR" });
    }

    if (role === "CONSUMER" && (!companyName || !taxId || !securityAnswer)) {
      return res.status(400).json({ message: "Company details and security answer are required for CONSUMER" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hash security answer (for CONSUMER)
    const hashedSecurityAnswer =
      role === "CONSUMER" && securityAnswer ? await bcrypt.hash(securityAnswer, 10) : undefined;

    // Upload documents to ImageKit
    let uploadedDocs: UploadedDoc[] = [];
    if (documents && Array.isArray(documents)) {
      for (const doc of documents) {
        if (!doc.base64 || !doc.name) continue;

        const result = await imagekit.upload({
          file: doc.base64, // base64 string from JSON
          fileName: doc.name
        });

        uploadedDocs.push({
          fileId: result.fileId,
          name: result.name,
          url: result.url
        });
      }
    }

    // Create user
    const newUser = new User({
      role,
      email,
      password: hashedPassword,
      organizationName,
      registrationNumber,
      companyName,
      taxId,
      securityAnswer: hashedSecurityAnswer,
      documents: uploadedDocs
    });

    await newUser.save();

    // Exclude sensitive info from response
    const { password: _, securityAnswer: __, ...userData } = newUser.toObject();

    res.status(201).json({ message: "User registered successfully", user: userData });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  try {
    const {
      role,
      password,
      organizationName,
      registrationNumber,
      companyName,
      taxId
    } = req.body;

    if (!role || !password) {
      return res.status(400).json({ message: "Role and password are required" });
    }

    let user;

    if (role === "GENERATOR") {
      if (!organizationName || !registrationNumber) {
        return res.status(400).json({
          message: "Organization name and registration number are required for GENERATOR"
        });
      }
      user = await User.findOne({ role, organizationName, registrationNumber });
    } 
    else if (role === "CONSUMER") {
      if (!companyName || !taxId) {
        return res.status(400).json({
          message: "Company name and taxId are required for CONSUMER"
        });
      }
      user = await User.findOne({ role, companyName, taxId });
    } 
    else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // ✅ CREATE JWT TOKEN
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
      }
    );

    // Remove sensitive fields
    const { password: _, securityAnswer: __, ...userData } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Logout successful. Please delete token on client."
  });
};
*/}

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

// Register user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      role,
      email,
      password,
      organizationName,
      registrationNumber,
      companyName,
      taxId,
      securityAnswer,
      documents
    }: {
      role: string;
      email: string;
      password: string;
      organizationName?: string;
      registrationNumber?: string;
      companyName?: string;
      taxId?: string;
      securityAnswer?: string;
      documents?: IncomingDoc[];
    } = req.body;

    // Validation
    if (!role || !email || !password) {
      return res.status(400).json({ message: "Role, email, and password are required" });
    }
    if (role === "GENERATOR" && (!organizationName || !registrationNumber)) {
      return res.status(400).json({ message: "Organization details are required for GENERATOR" });
    }
    if (role === "CONSUMER" && (!companyName || !taxId || !securityAnswer)) {
      return res.status(400).json({ message: "Company details and security answer are required for CONSUMER" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecurityAnswer = role === "CONSUMER" && securityAnswer ? await bcrypt.hash(securityAnswer, 10) : undefined;

    // Upload documents
    let uploadedDocs: UploadedDoc[] = [];
    if (documents && Array.isArray(documents)) {
      for (const doc of documents) {
        if (!doc.base64 || !doc.name) continue;
        const result = await imagekit.upload({ file: doc.base64, fileName: doc.name });
        uploadedDocs.push({ fileId: result.fileId, name: result.name, url: result.url });
      }
    }

    // Save user
    const newUser = new User({
      role,
      email,
      password: hashedPassword,
      organizationName,
      registrationNumber,
      companyName,
      taxId,
      securityAnswer: hashedSecurityAnswer,
      documents: uploadedDocs
    });
    await newUser.save();

    const { password: _, securityAnswer: __, ...userData } = newUser.toObject();

    res.status(201).json({ message: "User registered successfully", user: userData });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user with cookie
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { role, password, organizationName, registrationNumber, companyName, taxId } = req.body;
    if (!role || !password) return res.status(400).json({ message: "Role and password are required" });

    let user;
    if (role === "GENERATOR") {
      if (!organizationName || !registrationNumber)
        return res.status(400).json({ message: "Organization name and registration number are required for GENERATOR" });
      user = await User.findOne({ role, organizationName, registrationNumber });
    } else if (role === "CONSUMER") {
      if (!companyName || !taxId)
        return res.status(400).json({ message: "Company name and taxId are required for CONSUMER" });
      user = await User.findOne({ role, companyName, taxId });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });

    const { password: _, securityAnswer: __, ...userData } = user.toObject();

    // Set HTTP-only cookie
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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
      maxAge: 0 // expire immediately
    })
    .json({ message: "Logout successful" });
};


