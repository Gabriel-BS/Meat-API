import * as mongoose from "mongoose";

export interface MenuItemInterface extends mongoose.Document{
    name: string,
    price: number
}

export interface RestaurantInterface extends mongoose.Document {
    name: string,
    menu: MenuItemInterface[]
}


const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    price: {
        type: Number,
        required: true
    }
})

const restSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    menu: {
        type: [menuSchema],
        required: false,
        select: false,
        default: []
    }
})

export const Restaurant = mongoose.model<RestaurantInterface>('Restaurant', restSchema)

