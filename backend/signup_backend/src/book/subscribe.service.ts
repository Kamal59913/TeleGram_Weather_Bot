import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './schema/subscribe.schema';
import { Api } from './schema/api.schema';
@Injectable()
export class userService {
    // now we inject the model to get the data from the database
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        @InjectModel(Api.name)
        private readonly apiModel: mongoose.Model<Api>,
        ) {}

        async findAll(): Promise<User[]> {
            const books = await this.userModel.find();
            return books;
        }

        async create(user: User): Promise<User>{
            const res = await this.userModel.create(user)
            return res;
        }
        async findById(id: string): Promise<User>{
            const book = await this.userModel.findById(id)
            if(!book) {
                throw new NotFoundException('Book not found')
            }
            return book;
        }
        async updateById(id: string, user: User): Promise<User>{
           return await this.userModel.findByIdAndUpdate(id, user, {
            new:true,
            runValidators: true
           })
        }

      async deleteById(teleId: string): Promise<User | null> {
        try {
            const deletedUser = await this.userModel.findOneAndDelete({ tele_id: teleId }).exec();
            return deletedUser ? (deletedUser as unknown as User) : null;
        } catch (error) {
            // Handle errors accordingly
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }
    async blockUser(teleId: string): Promise<any> {
        try {
            const user = await this.userModel.findOne({ tele_id: teleId }).exec();
            if (user) {
              const newStatus = !user.isBlocked; // Toggling the current status
              const updatedUser = await this.userModel.findOneAndUpdate(
                { tele_id: teleId },
                { $set: { isBlocked: newStatus } },
                { new: true }
              ).exec();
              return updatedUser ? (updatedUser as unknown as User) : null;
            }
            return null;
          } catch (error) {
            // Handle errors
            throw new Error(`Failed to toggle block status: ${error.message}`);
          }
      }

      async createApi(api: Api): Promise<Api>{
        const res = await this.apiModel.create(api)
        return res;
    }
    async updateApiById(id: string, updateData: Partial<Api>): Promise<Api | null> {
        try {
          const updatedApi = await this.apiModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
          return updatedApi ? updatedApi : null;
        } catch (error) {
          // Handle errors accordingly
          throw new Error(`Failed to update API by ID: ${error.message}`);
        }
      }
    
} 
        
        

