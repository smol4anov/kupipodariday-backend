import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

require('dotenv').config();

const { PORT = 3000 } = process.env;

console.log(process.env.PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
