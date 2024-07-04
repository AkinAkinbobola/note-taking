import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as util from 'util';

const unlinkFile = util.promisify(fs.unlink);

@Catch(BadRequestException)
export class DeleteFileOnErrorFilter implements ExceptionFilter {
  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const getFiles = (file: Express.Multer.File | null) => {
      return file ? file.path : null;
    };

    const filePath = getFiles(request.file);

    if (filePath) {
      try {
        await unlinkFile(filePath);
      } catch (e) {
        response.status(status).json({
          message: 'Error processing file',
        });
      }
    }

    response.status(status).json({
      message: 'Only text / txt files allowed',
    });
  }
}
