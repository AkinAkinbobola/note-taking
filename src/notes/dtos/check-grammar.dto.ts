import { IsString } from 'class-validator';

export class CheckGrammarDto {
  @IsString()
  text: string;
}
