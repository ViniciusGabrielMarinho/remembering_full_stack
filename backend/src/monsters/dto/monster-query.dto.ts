import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class MonsterQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'A página deve ser um número inteiro.'})
  @Min(1, { message: 'A página não pode ser menor que 1.'})
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'A página deve ser um número inteiro.'})
  @Min(1, { message: 'A página não pode ser menor que 1.'})
  limit: number = 50;

  @IsOptional()
  @IsString({message: 'O termo de busca deve ser um texto.'})
  search?: string;

  @IsOptional()
  @IsString({message: 'O termo de busca tem que ser um texto.'})
  type?: string
}