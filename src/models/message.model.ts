import mongoose, { Document, Model } from "mongoose";

export interface IMessage extends Document{
    conversationId : string;
    senderId : string,
    text:string
}

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.ObjectId,
        ref:"Conversation",
        required:true
    },
    senderId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true
    }
})


const Message:Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>("Message" , messageSchema);

export default Message