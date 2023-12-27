import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class User{

 @Prop()
 location: string;

 @Prop()
 tele_id: string;

 @Prop()
 notification_preference: string;

 @Prop()
 username: string;

 @Prop({ default: false }) // Define the boolean attribute with a default value of false
 isBlocked: boolean;

 @Prop({ default: false }) // Define the boolean attribute with a default value of false
isSubscribed: boolean;
}
export const userSchema = SchemaFactory.createForClass(User)