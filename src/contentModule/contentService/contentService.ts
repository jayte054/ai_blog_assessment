import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { ContentObject } from "src/types";
import { CreateContentDto, UpdateContentDto } from "../contentDto/contentDto";
import { ApprovedContentEntity } from "../contentEntity/approvedContentEntity";
import { ContentRepository } from "../contentRepository/contentRepository";

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentRepository)
    private contentRepository: ContentRepository,
  ) {}

  async createContent(
    createContentDto: CreateContentDto,
    user: AuthEntity,
  ): Promise<ContentObject> {
    return await this.contentRepository.createContent(createContentDto, user);
  }

  async getContents(): Promise<ApprovedContentEntity[]> {
    return await this.contentRepository.getContents();
  }

  async getContent(id: string): Promise<ApprovedContentEntity> {
    return await this.contentRepository.getContent(id);
  }

  async updateContent(
    id: string,
    user: AuthEntity,
    updateContentDto: UpdateContentDto,
  ): Promise<ContentObject> {
    return await this.contentRepository.updateContent(
      id,
      user,
      updateContentDto,
    );
  }

  async deleteContent(
    id: string,
    user: AuthEntity,
  ): Promise<ContentObject | string> {
    return await this.contentRepository.deleteContent(id, user);
  }

  async approveContent(id: string, user: AuthEntity): Promise<ContentObject> {
    return await this.contentRepository.approveContent(id, user);
  }

  async approveUpdateByAdmin(
    id: string,
    user: AuthEntity,
  ): Promise<ContentObject> {
    return await this.contentRepository.approveUpdateByAdmin(id, user);
  }

  async approveContentDelete(
    id: string,
    user: AuthEntity,
  ): Promise<ContentObject | string> {
    return await this.contentRepository.approveContentDelete(id, user);
  }
}