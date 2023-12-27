import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Admin } from './admin.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Admin.name)
    private userModel: mongoose.Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async findAllAdmin(): Promise<Admin[]> {
    const admins = await this.userModel.find();
    return admins;
  }

  async createAdmin(admin: Admin): Promise<Admin> {
    const newAdmin = await this.userModel.create(admin);
    return newAdmin;
  }

  async generateJwtToken(payload: any): Promise<string> {
    const secretKey = 'YOUR_SECRET_KEY';
    return this.jwtService.sign(payload, { secret: secretKey });
  }

  async googleAuthRedirect(user: any): Promise<string> {
    if (!user) {
      throw new NotFoundException('No user found');
    }

    const { googleId, name, email, username, googleprofileimage } = user;

    const existingUser = await this.userModel.findOne({ emailid: email });

    if (existingUser) {
    // If the user already exists, generate JWT token and return
    const token = await this.generateJwtToken({ userId: existingUser.googleId });
    return token;
  }
  else {
    // Create a new user if the email doesn't exist in the database
    const newAdmin = new Admin();
    newAdmin.googleId = googleId;
    newAdmin.name = name;
    newAdmin.emailid = email;
    newAdmin.username = username;
    newAdmin.googleprofileimage = googleprofileimage;

    await this.createAdmin(newAdmin);

    // Generate JWT token after saving user details
    const token = await this.generateJwtToken({ userId: googleId });
    return token; // Send the token as the response
  }
}
}