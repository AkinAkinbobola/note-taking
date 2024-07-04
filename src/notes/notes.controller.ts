import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CheckGrammarDto } from './dtos/check-grammar.dto';
import { DeleteFileOnErrorFilter } from '../filters/delete-file-on-error.filter';

const id = uuidv4();

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const extension = extname(file.originalname);
    cb(null, `note-${id}${extension}`);
  },
});

@UseFilters(DeleteFileOnErrorFilter)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('checkGrammar')
  async checkGrammar(@Body() checkGrammarDto: CheckGrammarDto) {
    return this.notesService.checkGrammar(checkGrammarDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'text/plain',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    await this.notesService.saveFileInformation(
      file.originalname,
      file.filename,
    );
    return {
      file: file.filename,
    };
  }
}
