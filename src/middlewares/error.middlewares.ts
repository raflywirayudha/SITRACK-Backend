import { Request, Response, NextFunction } from 'express'

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err)

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode).json({
        message: err.message || 'Terjadi kesalahan pada server',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
}