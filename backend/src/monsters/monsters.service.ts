import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MonstersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number, search?: string, type?: string) {
  const skip = (page - 1) * limit;
  const where: Prisma.MonsterWhereInput = {}

  if (search){
    where.name = { contains: search};
  }

  if (type){
    where.type = type;
  }

  const total = await this.prisma.monster.count({ where })
  const monters =  await this.prisma.monster.findMany({
    skip: skip,
    take: limit,
    where: where,
    orderBy: {name: 'asc'},
  })

  return {
    data: monters,
    total: total,
    page: page,
    limit: limit,
    totalPages: Math.ceil(total / limit),
   };
}


  findOne(id: number) {
    return this.prisma.monster.findUnique({
      where: { id },
    });
  }
}
