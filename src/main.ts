import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const logger = new Logger("bootstrap")
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
  .setTitle("blog assessment")
  .setDescription(" a blog api dsigned to manage content display with authorization")
  .setVersion("1.0")
  .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup("api", app, document)

  const configService = app.get(ConfigService)
  const port = configService.get("server.port", 3000)
  await app.listen(port);
  logger.log("application is running on port:", port)
}
bootstrap();
