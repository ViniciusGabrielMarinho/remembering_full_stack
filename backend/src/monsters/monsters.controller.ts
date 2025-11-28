import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { MonstersService } from './monsters.service';
import { MonsterQueryDto } from './dto/monster-query.dto';

@UsePipes(new ValidationPipe({transform: true}))
@Controller('monsters')
export class MonstersController {
  constructor(private readonly monstersService: MonstersService) {}

@Get()
findAll(@Query() query: MonsterQueryDto) {
  return this.monstersService.findAll(
    query.page,
    query.limit,
    query.search,
    query.type,
    query.types,
  );
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monstersService.findOne(Number(id));
  }
}
