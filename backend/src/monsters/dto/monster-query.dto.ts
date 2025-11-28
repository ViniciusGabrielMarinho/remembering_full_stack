import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class MonsterQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  limit: number = 50;

  @IsOptional()
  @IsString()
  @Transform(params => params.value ? params.value.toLowerCase().trim() : undefined)
  search?: string;

  @IsOptional()
  @IsString()
  @Transform(params => {
    const value = params.value?.toLowerCase?.().trim();

    if (!value || value === 'all' || value === 'tudo') {
      return undefined;
    }

    return value;
  })
  type?: string;

  @IsOptional()
  @Transform(params => {
    if (!params.value) return undefined;
    return String(params.value)
      .split(',')
      .map(t => t.toLowerCase().trim())
      .filter(v => v.length > 0);
  })
  types?: string[];
}
