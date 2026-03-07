import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role, orgCode, orgName, mode } = req.body;

      if (!name || !email || !password || !role || !mode) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await authService.register({ name, email, password, role, orgCode, orgName, mode });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async me(req: Request, res: Response) {
    // TODO: Implement token validation middleware to populate req.user
    res.json({ message: 'Not implemented yet' });
  }
}
