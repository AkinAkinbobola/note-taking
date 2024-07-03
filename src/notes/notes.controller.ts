import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipe,
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
import { DeleteFileOnErrorFilter } from '../filters/delete-file-on-error.filter';

const id = uuidv4();

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
        .addFileTypeValidator({
          fileType: 'text',
        })
        .build({
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
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
