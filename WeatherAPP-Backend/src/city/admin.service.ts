import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { cityDocument, citySchema } from './schema/citySchema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from "axios"
import { response } from 'express';

import { HttpService } from '@nestjs/axios';
import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as dotenv from 'dotenv';
import Redis from 'ioredis';



@Injectable()
export class AdminService {
  
  private readonly apiKey: string;
  constructor(@InjectModel(citySchema.name) private cityModel:Model<cityDocument> ,private readonly httpService: HttpService){
    dotenv.config();
    this.apiKey = process.env.API_KEY;
  }
  // create(createAdminDto: CreateAdminDto, apiKey:string) : Promise<citySchema> {
  //   console.log(apiKey);
  //   if(apiKey==="ADMIN3214"){
  //   const model = new this.cityModel();
  //   model.cityName=createAdminDto.cityName;
  //   console.log(model);
  //   return model.save();
  //   }

  //   else{
  //     return Promise.reject(new Error('fail'))
  //     console.log('hi');
  //       }
  // }
  async create(createAdminDto: CreateAdminDto) : Promise<citySchema> {

    const redis = new Redis();
    redis.expire('city',1)

    if (await this.checkIfCityExists(createAdminDto.cityName)) {
      throw new Error('City already exists');
    }
    
    
    const model = new this.cityModel();
    model.cityName=createAdminDto.cityName;
    console.log(model);
    return model.save();
  }
  
  async checkIfCityExists(cityName: string): Promise<boolean> {
    const city = await this.cityModel.findOne({ cityName }).exec();
    return !!city;
  }


  findAll() {
    return this.cityModel.find().exec();
  }

  // createdcity(createAdminDto: CreateAdminDto) : any {
  //   const temp=(this.httpService.get(`https://api.openweathermap.org/data/2.5/weather?q=${createAdminDto.cityName}&appid=${this.apiKey}&units=metric`).pipe(map((response) => response.data.main.temp)));
  //   return temp;
  // }

  // getTemperature(createAdminDto: CreateAdminDto) : any {
  //   const temp=(this.httpService.get(`https://api.openweathermap.org/data/2.5/weather?q=${createAdminDto.cityName}&appid=532e04f5a8e8ec0be5867f4fd335b1b5&units=metric`).pipe(map((response) => response.data.main.temp)));
  //   return temp;
  // }

  

  

  async getTemperature() {
    

  const redis = new Redis(); //redis client instance
  const res= await redis.get("city", async (err, city) => {   //used to retrieve the value of city key
  if (err) {
  console.log("Connection error"); //checks redis connection
 }
 if (city != null) {
        
 return await JSON.parse(city)  // checking if a value was retrieved from Redis. If a value was retrieved it returns parsed json 
 
 }

 else {
 const cities = await this.cityModel.find().exec();
 const promises = cities.map(async ({ cityName }) => {
 try {
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${this.apiKey}&units=metric`);

 
 var obj = {
 city: cityName,
 temp: response.data.main.temp
 }

 return obj

 } catch (err) {

 
 }

 });

 const data = await Promise.all(promises);

 console.log("mongo",data);

 redis.set("city", JSON.stringify(data));


 return data


 }


 }

 )

 if(res===null){

 const cities = await this.cityModel.find().exec();

 const promises = cities.map(async ({ cityName }) => {

 try {

 const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${this.apiKey}&units=metric`);

 

 var obj = {

 city: cityName,

 temp: response.data.main.temp

 }

 return obj

 } catch (err) {

 

 }

 });
 const data = await Promise.all(promises);

 redis.set("city", JSON.stringify(data))

 return data

 }

 else{

 return res

 }

 }
  }
 
  

  

