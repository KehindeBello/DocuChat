import { z } from 'zod'
import { DocumentStatus } from '../generated/prisma/enums'


export const createDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(500),
    content: z.string().min(1, 'Content is required')
  })
})

export const listDocumentSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    status: z.enum(Object.values(DocumentStatus)).optional()
  })
})

export const documentParamsSchema = z.object({ 
  params: z.object({ 
    id: z.string().uuid('Invalid document ID'), 
  }), 
})

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>['body']
export type ListDocumentInput = z.infer<typeof listDocumentSchema>['query']
export type DocumentParamsInput = z.infer<typeof documentParamsSchema>['params']