import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class Admin{

 @Prop({ required: true, trim: true })
 name: string;

 @Prop({ required: true, unique: true, lowercase: true, trim: true })
 email: string;

 @Prop({ required: true, unique: true, trim: true })
 username: string;

 @Prop({ required: true })
 password: string;
}


export const adminSchema = SchemaFactory.createForClass(Admin)