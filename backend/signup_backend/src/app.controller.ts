import { Body, Param, Put, Controller, Get, UseGuards, Req, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Admin } from './admin.schema';
import { AuthGuard } from '@nestjs/passport'
import { createAdminDto } from './create-admin.dto';
import { Response } from 'express';

@Controller() 
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) { }

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    try {
      const token = await this.appService.googleAuthRedirect(req);
      
       res.cookie('token', token, {
        httpOnly: false,
        secure:false
      });

      return res.status(200).json({success:"Successful! Close the window and Sign-In"});
    } catch (error) {
      console.error('Error in Google authentication:', error);
      return res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
  }

  @Get('google-sign-in')
  initiateGoogleSignIn(@Res() res: Response): void {
    res.sendStatus(200);
  }

  @Get()
  async getAllAdmins(): Promise<Admin[]> {
    return this.appService.findAllAdmin();
  }

  @Post('adminSignupData')
  async createAdmin(@Body() adminData: createAdminDto): Promise<Admin> {
    return this.appService.createAdmin(adminData);
  }
}
