import { Request, Response } from "express";
import * as documentService  from "../services/document.service";
import { CreateDocumentInput, ListDocumentInput } from "../validators/document.validator";

export async function createDocument(req: Request, res: Response) {
  const userId = req.user?.id!

  const data = await documentService.createDocument(userId, req.body as CreateDocumentInput)
  return res.status(201).json({success: true, data})
}

export async function listDocuemnt(req: Request, res: Response) {
  const userId = req.user?.id!

  const data = await documentService.listDocuemnt(userId, req.query as unknown as ListDocumentInput)
  return res.status(200).json({success: true, data})
}
