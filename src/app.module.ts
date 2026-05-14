import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, TodoModule, AuthModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
