import { Document, ObjectId } from 'mongoose';


export interface Products extends Document  {
    user: ObjectId,
    name: String,
    description: String,
    size: String,
    color: String,
    price: Number,
    slug: String,
    imageUrl: String,
    status: String,
    createdAt: Date,
    updatedAt: Date,
}
