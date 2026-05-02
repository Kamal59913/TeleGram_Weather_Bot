import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Admin } from './admin.schema';
import { CreateAdminDto, LoginAdminDto } from './create-admin.dto';

@Controller() 
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getAllAdmins(): Promise<Partial<Admin>[]> {
    return this.appService.findAllAdmin();
  }

  @Post('adminSignupData')
  async createAdmin(@Body() adminData: CreateAdminDto): Promise<Partial<Admin>> {
    return this.appService.createAdmin(adminData);
  }

  @Post('users/admin/login')
  async loginAdmin(@Body() credentials: LoginAdminDto): Promise<{
    statusCode: number;
    message: string;
    data: {
      access_token: string;
      user: Partial<Admin>;
    };
  }> {
    const data = await this.appService.loginAdmin(credentials);
    return {
      statusCode: 201,
      message: 'Sign in success',
      data,
    };
  }

  @Get('users/profile')
  async getProfile(
    @Headers('authorization') authorization?: string,
  ): Promise<{ data: Partial<Admin> }> {
    const profile = await this.appService.getProfile(authorization);
    return { data: profile };
  }
}
