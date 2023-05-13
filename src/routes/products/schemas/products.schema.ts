import * as mongoose from 'mongoose';


export const ProductsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    description: { type: String, default: '' },
    size: String,
    color: String,
    price: Number,
    slug: String,
    imageUrl: { type: String, default: '' },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
});