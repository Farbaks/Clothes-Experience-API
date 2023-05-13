import * as mongoose from 'mongoose';


export const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    emailAddress: { type: String, lowercase: true },
    phoneNumber: String,
    password: { type: String, select: false },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
});
