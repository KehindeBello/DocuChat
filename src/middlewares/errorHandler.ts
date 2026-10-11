import { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    console.warn( `[${err.code}] [${err.message}], ${(err.details ? {details: err.details} : '')} `)

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.isOperational ? err.code : 500,
        message: err.isOperational ? err.message : "Internal server error",
        ...((err.details && !err.isOperational) && { details: err.details }),
      }
    })
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR', 
      message: 'An unexpected error occured'
    }
  })
}