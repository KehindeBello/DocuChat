import { Request, Response } from "express";
import { logger } from "../lib/logger";
import * as userService from '../services/user.service'


export async function getProfile(req: Request, res: Response ) {
  try {
    const id = req.user!.id;

    const data = await userService.getProfile(id);
    return res.status(200).json({ data })
  } catch (error: any) {
    logger.error(error)
    return res.status(400).json({ message: error.message })
  }
}