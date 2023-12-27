import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class Admin{

 @Prop()
 googleId: string;

 @Prop()
 name: string;

 @Prop()
 emailid: string;

 @Prop()
 username: string;

 @Prop()
 googleprofileimage: string;
}


export const adminSchema = SchemaFactory.createForClass(Admin)