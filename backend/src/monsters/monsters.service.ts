import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MonstersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number, search?: string, types?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.MonsterWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
      };
    }

    if (types && types.length > 0) {
      where.type = {
      in: types, // <── agora aceita vários tipos
     };
    }

    const total = await this.prisma.monster.count({ where });

    const monsters = await this.prisma.monster.findMany({
      skip,
      take: limit,
      where,
      orderBy: { name: 'asc' }
    });

    return {
      data: monsters,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  findOne(id: number) {
    return this.prisma.monster.findUnique({
      where: { id },
    });
  }
}
