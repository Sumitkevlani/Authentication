import { MailerService } from '@nestjs-modules/mailer';
import { Controller,Post,Body,Logger,Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './models/loginRequest.dto';
import { Otp } from './models/otp.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private mailService: MailerService) {}
  //post request for login
  @Post('login')
  loginAdmin(@Body() credentials: LoginRequest): any {
  Logger.debug('New Login Request Received');
  return this.authService.login(credentials);
  }

  @Get('send-mail')
  sendEmail(@Query('toemail')toemail){
    this.mailService.sendMail({
      to: toemail,
      from: "sumitkevlaninew@outlook.com",
      subject: 'One Time Password For Admin Authentication',
      text: process.env.OneTimePassword||"password"
    });
    return 'success';
  }
  // @Post('otp')
  // adminLogin(@Body()body: otp): any{
  // return this.authService.verifyOtp(body.otp);
  // }
  //verifying otp of the user
  @Post('verify-otp')
  verifyOtp(@Body()body: Otp){
    return this.authService.otpVerification(body);
  }
}
