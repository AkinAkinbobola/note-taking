import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionsLoggerFiler } from './filters/exceptions-logger.filer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new ExceptionsLoggerFiler());
  await app.listen(3000);
}

bootstrap();
