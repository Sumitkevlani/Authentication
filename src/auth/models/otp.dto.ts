import { IsNumber, IsString, Length } from "class-validator";

export class Otp{
    _id: string;

    @IsNumber()
    @Length(6)
    otp: number;
}