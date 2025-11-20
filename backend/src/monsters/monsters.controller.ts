import { Controller, Get, Param } from '@nestjs/common';
import { MonstersService } from './monsters.service';

@Controller('monsters')
export class MonstersController {
  constructor(private readonly monstersService: MonstersService) {}

@Get()
findAll(
  @Query("page") page: string,
  @Query("limit") limit: string
) {
  return this.monstersService.findAll(
    Number(page) || 1,
    Number(limit) || 50
  );
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monstersService.findOne(Number(id));
  }
}
