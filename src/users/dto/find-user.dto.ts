import { IsNotEmpty, IsString } from 'class-validator';

export class findUserDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
