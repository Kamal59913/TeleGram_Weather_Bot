import { Module } from '@nestjs/common';
import { userModule } from 'src/book/subscribe.module';
import { TelegramAssignmentAstService } from './telegram-assignment-ast.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/book/schema/subscribe.schema';
import { apiSchema } from 'src/book/schema/api.schema';
@Module({
  imports:[
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    MongooseModule.forFeature([{ name: 'Api', schema: apiSchema }]),
    userModule],
  providers: [TelegramAssignmentAstService]
})
export class TelegramAssignmentAstModule {}
