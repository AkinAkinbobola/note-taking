import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckGrammarDto } from './dtos/check-grammar.dto';

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

  async checkGrammar(data: CheckGrammarDto) {
    const dictionary = (await import('dictionary-en-gb')).default;
    const nspell = (await import('nspell')).default;
    // @ts-expect-error Dictionary types not correct
    const spell = nspell(dictionary);
    return {
      corrections: spell.suggest(data.text),
    };
  }
}
