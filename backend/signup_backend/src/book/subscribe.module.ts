import { Module } from '@nestjs/common';
import { userController } from './subscribe.controller';
import { userService } from './subscribe.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/subscribe.schema';
import { apiSchema } from './schema/api.schema';
@Module({
  imports: [MongooseModule.forFeature([{name:'User', schema: userSchema}]),
  MongooseModule.forFeature([{name:'Api', schema: apiSchema}])
],
  controllers: [userController],
  providers: [userService]
})
export class userModule {}
