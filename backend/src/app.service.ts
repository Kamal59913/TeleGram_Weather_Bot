import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Admin } from './admin.schema';
import { JwtService } from '@nestjs/jwt';
import { CreateAdminDto, LoginAdminDto } from './create-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Admin.name)
    private userModel: mongoose.Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async findAllAdmin(): Promise<Partial<Admin>[]> {
    const admins = await this.userModel.find().select('-password').lean();
    return admins;
  }

  async createAdmin(admin: CreateAdminDto): Promise<Partial<Admin>> {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const newAdmin = await this.userModel.create({
      ...admin,
      email: admin.email.toLowerCase(),
      password: hashedPassword,
    });
    const adminObject = newAdmin.toObject();
    delete adminObject.password;
    return adminObject;
  }

  async loginAdmin(credentials: LoginAdminDto): Promise<{
    access_token: string;
    user: Partial<Admin>;
  }> {
    const admin = await this.userModel.findOne({ username: credentials.username });
    if (!admin) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      admin.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const accessToken = await this.generateJwtToken({
      adminId: admin._id.toString(),
      username: admin.username,
    });

    const adminObject = admin.toObject();
    delete adminObject.password;
    return {
      access_token: accessToken,
      user: adminObject,
    };
  }

  async getProfile(authHeader?: string): Promise<Partial<Admin>> {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }
    const token = authHeader.slice(7);
    const payload = await this.jwtService.verifyAsync(token);
    const admin = await this.userModel
      .findById(payload.adminId)
      .select('-password')
      .lean();
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  async seedDefaultAdmin(adminData: CreateAdminDto): Promise<Partial<Admin>> {
    const existing = await this.userModel.findOne({
      $or: [
        { email: adminData.email.toLowerCase() },
        { username: adminData.username },
      ],
    });
    if (existing) {
      const adminObject = existing.toObject();
      delete adminObject.password;
      return adminObject;
    }
    return this.createAdmin(adminData);
  }

  async generateJwtToken(payload: Record<string, string>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async findAdminById(adminId: string): Promise<Partial<Admin>> {
    const admin = await this.userModel.findById(adminId).select('-password').lean();
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  async findByUsername(username: string): Promise<Admin | null> {
    return this.userModel.findOne({ username });
  }

  async createAdminForSeed(admin: CreateAdminDto): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const newAdmin = await this.userModel.create({
      ...admin,
      email: admin.email.toLowerCase(),
      password: hashedPassword,
    });
    return newAdmin;
  }
}