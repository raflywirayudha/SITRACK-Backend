import { Request, Response } from 'express';
import { AuthService } from '../services/auth.services';
import { LoginDTO, RegisterDTO } from '../types/auth.types';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const registerData: RegisterDTO = req.body;
      const result = await AuthService.register(registerData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const loginData: LoginDTO = req.body;
      const result = await AuthService.login(loginData);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}