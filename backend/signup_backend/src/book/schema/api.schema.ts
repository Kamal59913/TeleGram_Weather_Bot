import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class Api{

 @Prop()
 api: string;
}
export const apiSchema = SchemaFactory.createForClass(Api)