import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { GlobalExceptionFilter } from '@infrastructure/filters/global-exception.filter';
import { AppModule } from '@src/app.module';

async function bootstrap() {
   const logger = new Logger('Bootstrap');
   const app = await NestFactory.create(AppModule);

   const configService = app.get(ConfigService);
   const port = configService.getOrThrow<number>('PORT');

   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
         forbidNonWhitelisted: true,
         transform: true,
      }),
   );

   app.useGlobalFilters(new GlobalExceptionFilter());

   await app.listen(port);
   logger.log(`Application running on port ${port}`);
}

void bootstrap();
