import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/tasks.service';
//Using Mailer Module to mail otp to the user
@Module({
  imports: [AuthModule, DatabaseModule,MailerModule.forRoot({
    transport:{
      service: "Outlook365",
      auth:{
        user:"sumitkevlaninew@outlook.com",
        pass:"Loading@123"
      }
    }
  })
],
  controllers: [AppController],
  providers: [AppService, TasksService],
})
export class AppModule {}
