import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type,Transform, TransformFnParams} from 'class-transformer';

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
  @Transform((params: TransformFnParams) => (params.value ? params.value.toLowerCase().trim() : undefined))
  search?: string;

@IsOptional()
  @IsString({message: 'O termo de busca tem que ser um texto.'})
 @Transform((params: TransformFnParams) => {
    const valueAsString = typeof params.value === 'string' ? params.value : '';
    const cleanedValue = valueAsString ? valueAsString.toLowerCase().trim() : undefined;

    if (cleanedValue === 'all' || cleanedValue === 'tudo') {
        return undefined;
    }
    return cleanedValue;
  })
  type?: string;
}