import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramAssignmentAstModule } from './telegram-assignment-ast/telegram-assignment-ast.module';
import { MongooseModule } from '@nestjs/mongoose';
import { userModule } from './book/subscribe.module';
import { ConfigModule } from '@nestjs/config';
import { adminSchema } from './admin.schema';
import { JwtModule } from '@nestjs/jwt';

import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';


@Module({
  imports: [
    TelegramAssignmentAstModule,
    ConfigModule.forRoot({
        envFilePath: '.env',
        isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    userModule,
    MongooseModule.forFeature([{name:'Admin', schema: adminSchema}]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-me',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
  ],  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.static(join(__dirname, '..', 'public')))
      .forRoutes({ path: '/home', method: RequestMethod.GET }); // Specify the route for serving HTML file
  }
}

