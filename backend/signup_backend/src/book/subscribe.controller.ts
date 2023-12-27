import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { userService } from './subscribe.service';
import { User } from './schema/subscribe.schema';
import { Api } from './schema/api.schema';
import { createUserDto } from './dto/create-info.dto';
import { createApiDto } from './dto/create-api.dto';

@Controller('api')
export class userController {
    constructor(private userService: userService){}  
        @Get('/users')
        async getAllUsers() : Promise<User[]> {
            return this.userService.findAll()
        }
        @Post('signupdata')
        async createUsers(
            @Body()
            user: createUserDto
        ): Promise<User>{
            return this.userService.create(user);
        }
        @Delete('users/:id')
        async deleteUser(
            @Param('id') id: string
        ): Promise<User | null> {
            try {
                const deletedUser = await this.userService.deleteById(id);
                if (!deletedUser) {
                    throw new Error('User not found');
                }
                return deletedUser;
            } catch (error) {
                // Handle errors accordingly
                throw new Error(`Failed to delete user: ${error.message}`);
            }
        }
        @Get(':id')
        async getUser(
            @Param('id')
            id:string
        ) : Promise<User> {
            return this.userService.findById(id);
        }
        @Put('users/block/:id')
        async blockUser(@Param('id') id: string): Promise<any> {
          return this.userService.blockUser(id);
        }

        @Post('createapi')
        async create(
            @Body()
            user: createApiDto
        ): Promise<Api>{
            return this.userService.createApi(user);
        }

        @Put('updateApi/:id')
        async updateApi(@Param('id') id: string, @Body() updateData: Partial<Api>): Promise<Api | null> {
          try {
            const updatedApi = await this.userService.updateApiById(id, updateData);
            return updatedApi;
          } catch (error) {
            // Handle errors accordingly
            throw new Error(`Failed to update API: ${error.message}`);
          }
        }
      
    }

