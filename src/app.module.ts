import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';

import { validateEnvironment } from '@config/environments';
import { AdaptersModule } from '@infrastructure/adapters/adapters.module';

@Module({
   imports: [
      ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
      ServeStaticModule.forRoot({ rootPath: resolve('public') }),
      AdaptersModule,
   ],
})
export class AppModule {}
