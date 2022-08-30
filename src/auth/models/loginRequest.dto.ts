import { IsEmail, IsNumber, Length, MinLength } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  email: string;
}
