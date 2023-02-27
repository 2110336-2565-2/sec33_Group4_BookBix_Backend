import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
@Injectable()
export class AdminsService {
  constructor(
   @InjectModel('admins') private readonly adminModel: Model<Admin>
  ) {}

  async insertNewAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const newAdmin = new this.adminModel(createAdminDto);
    await newAdmin.save();
    return newAdmin;
  }

  
  async getAdmin(email: string) {
    const admin = await this.adminModel.findOne({ email });
    return admin;
  }

  async updateLatestDevice(adminId: string, latest_device: string) {
    const admin = await this.adminModel.findById(adminId);
    admin.latest_device = latest_device;
    await admin.save();
    return admin;
  }
  
}
