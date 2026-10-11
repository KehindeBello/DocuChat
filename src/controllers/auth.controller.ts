import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function registerUser(req: Request, res: Response) {
  const { email, name, password} = req.body

  const data = await authService.register({ email, name, password })
  return res.status(201).json({success: true, data})
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const data = await authService.loginUser({ email, password })
  return res.status(200).json({success: true, data})
}

export async function logoutUser(req: Request, res: Response) {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  return res.status(200).json({ success:true, message: "Logged out successfully" })
}