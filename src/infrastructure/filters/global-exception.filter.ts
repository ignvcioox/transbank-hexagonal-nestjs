import {
   ArgumentsHost,
   Catch,
   ExceptionFilter,
   HttpException,
   HttpStatus,
   Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
   private readonly logger = new Logger(GlobalExceptionFilter.name);

   catch(exception: unknown, host: ArgumentsHost) {
      const context = host.switchToHttp();
      const response = context.getResponse<Response>();
      const request = context.getRequest<Request>();

      const isHttpException = exception instanceof HttpException;

      const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      const exceptionResponse = isHttpException ? exception.getResponse() : null;

      const message =
         typeof exceptionResponse === 'object' &&
         exceptionResponse !== null &&
         'message' in exceptionResponse
            ? exceptionResponse.message
            : isHttpException
              ? exception.message
              : 'Internal server error';

      if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
         this.logger.error(
            `${request.method} ${request.url} - ${status}`,
            exception instanceof Error ? exception.stack : undefined,
         );
      } else {
         this.logger.warn(`${request.method} ${request.url} - ${status}`);
      }

      response.status(status).json({
         statusCode: status,
         message,
         path: request.url,
         timestamp: new Date().toISOString(),
      });
   }
}
