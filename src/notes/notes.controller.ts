import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { uuid } from 'uuidv4';

const id = uuid();
console.log(id);

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const extension = extname(file.originalname);
    cb(null, `note-${id}${extension}`);
  },
});

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.txt' })
        .addMaxSizeValidator({ maxSize: 1000 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
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
