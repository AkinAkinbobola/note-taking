import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private readonly prismaService: PrismaService) {}

  async saveFileInformation(originalFileName: string, serverFileName: string) {
    await this.prismaService.fileInformation.create({
      data: {
        originalFileName,
        serverFileName,
      },
    });
  }
}
