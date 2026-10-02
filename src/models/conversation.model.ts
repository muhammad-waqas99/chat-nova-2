import mongoose, { Document, Model, ObjectId  } from "mongoose";
export interface IConversation extends Document{
   participants:ObjectId[]
}
const conversationSchema = new mongoose.Schema({
     participants:[{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
        
     }]
},{timestamps:true})


const Conversation : Model<IConversation> = mongoose.models.Conversation || mongoose.model<IConversation>("Conversation" , conversationSchema)




export default Conversation;