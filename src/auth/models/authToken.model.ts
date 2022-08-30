import { ObjectId } from 'mongodb';

export class AuthTokenInfo {
  _id: string | ObjectId;
  role: number;
  createdAt: Date;
  type: string;
}
