import {
    BadRequestException,
    Dependencies,
    Inject,
    Injectable,
    Logger,
    UnauthorizedException,
  } from '@nestjs/common';
import { LoginRequest } from './models/loginRequest.dto';
import { LoginResponse } from './models/loginResponse.dto';
import { AdminUser } from './models/adminUser.dto';
import {sign} from 'jsonwebtoken';
import { instanceToPlain } from 'class-transformer';
import { AuthTokenInfo } from './models/authToken.model';
import { Collection, Db, ObjectId } from 'mongodb';
import { MailerService } from '@nestjs-modules/mailer';
import { Otp } from './models/otp.dto';
import { Cron, Timeout } from '@nestjs/schedule';
@Injectable()
export class AuthService {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Db, private mailService: MailerService) {}
  //Trying to find the mail id posted in the request in the database
  login(credentials: LoginRequest){
    const admin = this.getAdminCollection().findOne({email:credentials.email});
    //mail id not found
    if (admin==null) {
      Logger.warn(
        `Login Request Failed | No User Found Against Provided Email`,
      );
      throw new UnauthorizedException('Invalid Email');
    }
    //mail id found
    else{
      // generating a random otp and mailing it to the user
      const otp = (Math.floor(100000 + Math.random() * 900000));
      const tempOtp = otp;
      tempOtp.toString();
      this.mailService.sendMail({
        to: credentials.email,
        from: "sumitkevlaninew@outlook.com",
        subject: 'One Time Password For Admin Authentication',
        text: "The One Time Password for the authentication is : "+tempOtp
      });
      //saving the otp in the otp collection in the database
      const otpCollection = new Otp();
      otpCollection.otp = otp;
      this.getOtpCollection().insertOne(otpCollection);
      return otpCollection._id;
    }
  }
  //generating json web tokens for the authenticated user
  private generateJwt(admin: AdminUser): string {
      const authTokenInfo = new AuthTokenInfo();
      authTokenInfo._id = admin._id.toString();
      authTokenInfo.role = +admin.role;
      authTokenInfo.createdAt = new Date();
      authTokenInfo.type = 'admin';
    
      console.log(authTokenInfo);
      console.log(instanceToPlain(authTokenInfo));
      const token: string = sign(
        instanceToPlain(authTokenInfo),
        process.env.JWT_SECRET_KEY||'jwtsecretkeyjwtsecretkey',
        { expiresIn: process.env.JWT_DURATION||'1d', issuer: process.env.JWT_ISSUER||'oyebusy-auth-system' },
        );
        return token;
      }
  //verifying the otp of the user
  public otpVerification(otp: Otp){
    const Document = this.db.collection('otps').findOne(otp);
    Document.then(function(result){
      console.log(result);
    });
  }
  //getting the otp collection from the database
  public getOtpCollection(): Collection<Otp> {
      return this.db.collection('otps');
  }
  //getting admin collection from the database
  public getAdminCollection(): Collection<AdminUser> {
    return this.db.collection('admins');
  }
}
