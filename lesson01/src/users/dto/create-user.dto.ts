import {IsEmail, IsEnum, IsNotEmpty, IsString} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsEmail()
    email: string;

    @IsEnum(['INTERN', 'ENGINEER', 'ADMIN'], {message: 'role must be INTERN, ENGINEER, or ADMIN'})   
    role: 'INTERN' | 'ENGINEER' | 'ADMIN';
}