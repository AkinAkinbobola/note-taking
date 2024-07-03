import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';

@Catch(BadRequestException)
export class DeleteFileOnErrorFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const getFiles = (file: Express.Multer.File | null) => {
      return file ? file.path : null;
    };

    const filePath = getFiles(request.file);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return err;
      }
    });
    response.status(status).json(exception.getResponse());
  }
}
