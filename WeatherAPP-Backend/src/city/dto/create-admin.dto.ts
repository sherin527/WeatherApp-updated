import { Matches } from 'class-validator';
export class CreateAdminDto {

    //@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    //password: string;

 
    cityName: string
}
