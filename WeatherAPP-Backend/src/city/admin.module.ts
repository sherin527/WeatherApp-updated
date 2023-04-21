import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CitySchema, citySchema } from './schema/citySchema';
import { HttpModule } from '@nestjs/axios';
import { BasicStrategy } from '../auth/auth-basic.strategy';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';





@Module({

  imports: [MongooseModule.forFeature([{name:citySchema.name,schema:CitySchema}]),HttpModule,ConfigModule],
  controllers: [AdminController],
  providers: [AdminService, BasicStrategy]
})
export class AdminModule {}
