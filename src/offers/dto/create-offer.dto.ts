import { IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsNotEmpty()
  item: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;
}
