import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/authModule/authModule";
import { ContentController, GetContentController } from "./contentContoller/contentController";
import { ApprovedContentEntity } from "./contentEntity/approvedContentEntity";
import { ContentEntity } from "./contentEntity/contentEntity";
import { ContentRepository } from "./contentRepository/contentRepository";
import { ContentService } from "./contentService/contentService";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ContentEntity,
      ContentRepository,
      ApprovedContentEntity,
    ]),
  ],
  controllers: [ContentController , GetContentController],
  providers: [ContentService, ContentRepository],
})
export class ContentModule {}