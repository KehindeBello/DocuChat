import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function registerUser(req: Request, res: Response) {
  try {
    const { email, name, password} = req.body

    const data = await authService.register({ email, name, password })
    return res.status(201).json(data)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const data = await authService.loginUser({ email, password })
    return res.status(200).json(data)
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}