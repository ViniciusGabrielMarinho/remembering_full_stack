import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MonstersService {
  constructor(private prisma: PrismaService) {}

findAll(page: number = 1, limit: number = 50) {
  const skip = (page - 1) * limit;

  return this.prisma.monster.findMany({
    skip,
    take: limit,
    orderBy: { name: "asc" },
  });
}


  findOne(id: number) {
    return this.prisma.monster.findUnique({
      where: { id },
    });
  }
}
