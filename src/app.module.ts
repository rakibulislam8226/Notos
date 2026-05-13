import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { PrismaModule } from './prisma/prisma.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), FileModule, PrismaModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
