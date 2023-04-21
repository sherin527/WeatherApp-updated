import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type cityDocument=citySchema & Document
@Schema()
export class citySchema{

    @Prop()
    cityName: string;
}

export const CitySchema=SchemaFactory.createForClass(citySchema)