import * as mongoose from 'mongoose'
import { RestaurantInterface } from '../restaurants/restaurants.model';
import { UserInterface } from '../users/users.model';



export interface ReviewInterface extends mongoose.Document{
    date: Date,
    rating: number, 
    comments: string,
    restaurant: mongoose.Types.ObjectId | RestaurantInterface,
    user: mongoose.Types.ObjectId | UserInterface
}

const reviewSchema = new mongoose.Schema({
    date:{
        type: Date,
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    comments:{
        type: String,
        required: true,
        maxlength: 500
    },
    restaurant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

export const Review = mongoose.model<ReviewInterface>('Review', reviewSchema)