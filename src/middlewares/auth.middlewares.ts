import {Request, Response, NextFunction, RequestHandler} from 'express';
import jwt from "jsonwebtoken";
import {Role} from '@prisma/client';
import {JWTPayload} from '../types/auth.types';
import * as process from "node:process";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'you-secret-key';

export const authenticateToken: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('Auth Header:', authHeader);

    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token);

    if (!token) {
      console.log('No token provided');
      res.status(401).json({ message: 'Authentication token required' });
      return;
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
      console.log('Token payload:', payload);
      req.user = payload;
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      res.status(403).json({ message: 'Invalid token' });
      return;
    }
  } catch (error) {
    console.error('Authentication Error:', error);
    next(error);
  }
};

export const authorizeRoles = (roles: Role[]): RequestHandler =>
    (req, res, next): void => {
      try {
        const authHeader = req.headers['authorization'];
        console.log('Auth Header:', authHeader);

        const token = authHeader && authHeader.split(' ')[1];
        console.log('Token:', token);

        if (!token) {
          console.log('No token provided');
          res.status(401).json({ message: 'Authentication token required' });
          return;
        }

        try {
          const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
          console.log('Token payload:', payload);
          req.user = payload;
          next();
        } catch (error) {
          console.error('JWT Verification Error:', error);
          res.status(403).json({ message: 'Invalid token' });
          return;
        }
      } catch (error) {
        console.error('Authentication Error:', error); // Debug log
        next(error);
      }
    };