import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ConflictException} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { map, tap } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { validate } from 'class-validator';


@Controller('city')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Post()
  // create(@Query('apiKey') apiKey: string,@Body() createAdminDto: CreateAdminDto) {
  //   return this.adminService.create(createAdminDto,apiKey);
  // }
  @UseGuards(AuthGuard('basic'))
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
      //return this.adminService.create(createAdminDto);
      const cityExists = await this.adminService.checkIfCityExists(createAdminDto.cityName);
    if (cityExists) {
      throw new ConflictException('City already exists');
    }
    const createdCity = await this.adminService.create(createAdminDto);
    return createdCity;
    }
  

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  // @Post("weatherTemp")
  // getTemperature(@Body() createAdminDto: CreateAdminDto) {
  //   return this.adminService.getTemperature(createAdminDto);
  // }

  
  // @Post("name")
  // createdcity(@Body() createAdminDto: CreateAdminDto) {

  //   return this.adminService.createdcity(createAdminDto);
  // }


  
  @Get('weatherTemp')
  getTemperature() {
    return this.adminService.getTemperature();
  }
  



 
  
}
