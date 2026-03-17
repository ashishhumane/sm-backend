import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";

import {
  registerService,
  loginService,
  getMeService,
} from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerService(req.body);

    const token = generateToken(user.id);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({ id: user.id });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body.email, req.body.password);

    res
      .cookie("token", result.token, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({ id: result.user.id });

  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: "strict",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await getMeService(req.body.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
