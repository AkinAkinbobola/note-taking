import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckGrammarDto } from './dtos/check-grammar.dto';
import { isNumber } from 'lodash';

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

  private sanitizeStrings(strArr: string[]) {
    const set = new Set<string>();
    for (const sentence of strArr) {
      sentence.split(' ').forEach((word) => {
        word = word.trim();
        if (word.endsWith('.') || word.endsWith(':') || word.endsWith(','))
          word = word.slice(0, -1);
        if (this.ignoreThisString(word)) return;
        if (word == '') return;
        if (isNumber(word)) return;
        set.add(word);
      });
    }
    return Array.from(set);
  }

  private ignoreThisString(word: string) {
    const regex = /[{}\[\]'"?]/gi;
    return regex.test(word);
  }

  async checkGrammar({ text }: CheckGrammarDto) {
    const dictionary = (await import('dictionary-en-gb')).default;
    const nspell = (await import('nspell')).default;
    // @ts-expect-error Dictionary types not correct
    const spell = nspell(dictionary);

    const words = this.sanitizeStrings([text]);

    const misspelledWords = words.filter((word) => !spell.correct(word));

    if (misspelledWords.length === 0) {
      return { data: [] };
    }

    const correctedWords = misspelledWords.map((word) => {
      return {
        word,
        suggestions: spell.suggest(word),
      };
    });

    return {
      data: correctedWords,
    };
  }
}
