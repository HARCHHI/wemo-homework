import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { RentsErrorDetail } from './rents.exception';

@Catch(Error)
export class RentsExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.message in RentsErrorDetail === false) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });

      return;
    }
    const detail = RentsErrorDetail[exception.message];

    response.status(detail.status).json({
      statusCode: detail.status,
      code: detail.code,
      message: detail.message,
      timestamp: new Date().toISOString(),
    });
  }
}
