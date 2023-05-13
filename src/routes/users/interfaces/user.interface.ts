import { Document, ObjectId } from 'mongoose';


export interface User extends Document  {
    firstName: String,
    lastName: String,
    emailAddress: String,
    phoneNumber: String,
    password: String,
    status: String,
    createdAt: Date,
    updatedAt: Date,
}
