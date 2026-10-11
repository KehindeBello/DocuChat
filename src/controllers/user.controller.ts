import { Request, Response } from "express";
import * as userService from '../services/user.service'


export async function getProfile(req: Request, res: Response ) {
  const id = req.user!.id;

  const data = await userService.getProfile(id);
  return res.status(200).json({ success: true, data })
}