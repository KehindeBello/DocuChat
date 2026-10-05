import { appEvents } from "../lib/events";
import prisma from "../lib/db";
import { logger } from "../lib/logger";
import { CreateDocumentInput, ListDocumentInput, DocumentParamsInput} from "../validators/document.validator";
import { DocumentStatus } from "../generated/prisma/enums";

export async function createDocument(userId: string, data: CreateDocumentInput) {
  const { title, content } = data

  const document = await prisma.document.create({
    data: { title, content, status: DocumentStatus.READY, userId }
  })

  logger.info(`Document ${title} succssfully created`);

  return { id: document.id, title: document.title }
  
}

export async function listDocuemnt(userId: string, query: ListDocumentInput ) {
  const { page, limit, status } = query

  const skip = (page - 1) * limit;
  const where = { userId, status: status ?? {} };

  const documents = await prisma.document.findMany({ 
    where: where,
    skip: skip,
    take: limit,
    orderBy: { createdAt: 'desc'}
  })

  const total = await prisma.document.count({ where })

  return {
    documents,
    meta: {
      page,
      limit,
      total: total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit)
    }
  }

}