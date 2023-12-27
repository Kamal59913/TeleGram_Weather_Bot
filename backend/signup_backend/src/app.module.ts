import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramAssignmentAstModule } from './telegram-assignment-ast/telegram-assignment-ast.module';
import { MongooseModule } from '@nestjs/mongoose';
import { userModule } from './book/subscribe.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { adminSchema } from './admin.schema';
import { PassportModule } from '@nestjs/passport';
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
    PassportModule.register({defaultStrategy:'google'}),
    JwtModule.register({
      secret: '$321SecretKey', // Replace with your actual secret key
      signOptions: { expiresIn: '1h' }, // Example expiration time
    }),
  ],  
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.static(join(__dirname, '..', 'public')))
      .forRoutes({ path: '/home', method: RequestMethod.GET }); // Specify the route for serving HTML file
  }
}

