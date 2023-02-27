import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createCookie(res: Response, token: string): Promise<void> {
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    });
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verify(token);
      return true;
    } catch (err) {
      return false;
    }
  }
}
