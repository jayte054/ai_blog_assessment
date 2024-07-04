import { Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { ContentObject } from "src/types";
import { DataSource, FindManyOptions, FindOneOptions,  Repository } from "typeorm";
import { CreateContentDto, UpdateContentDto } from "../contentDto/contentDto";
import { ApprovedContentEntity } from "../contentEntity/approvedContentEntity";
import { ContentEntity } from "../contentEntity/contentEntity";

@Injectable()
export class ContentRepository extends Repository<
  ContentEntity | ApprovedContentEntity
> {
  private logger = new Logger('authRepository');
  constructor(private dataSource: DataSource) {
    super(ContentEntity, dataSource.createEntityManager());
  }

  //======create content========//

  async createContent(
    createContentDto: CreateContentDto,
    user: AuthEntity,
  ): Promise<ContentObject> {
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('uunauthorized');
    }

    const { title, description } = createContentDto;
    const { id, name, userType } = user;

    try {
      const newContent = new ContentEntity();
      newContent.title = title;
      newContent.description = description;
      newContent.isApproved = userType !== 'employee' ? false : true;
      newContent.userId = id;
      newContent.user = user;
      newContent.name = name;
      newContent.date = new Date().toLocaleDateString('en-Us', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      await newContent.save();

      if (newContent.isApproved) {
        const approvedContent = new ApprovedContentEntity();
        approvedContent.title = newContent.title;
        approvedContent.description = newContent.description;
        approvedContent.userId = newContent.userId;
        approvedContent.date = newContent.date;
        approvedContent.user = newContent.user;
        approvedContent.isApproved = true;
        approvedContent.date = newContent.date;
        approvedContent.name = newContent.name;

        await approvedContent.save();
      }
      if (newContent.isApproved) {
        this.logger.verbose(`content created successfully by, ${name}`);
      } else {
        this.logger.verbose(`content submitted successfully by, ${name}`);
      }
      return {
        id: newContent.id,
        title: newContent.title,
        description: newContent.description,
        name: name,
      };
    } catch (error) {
      this.logger.error('error creating content');
      throw new InternalServerErrorException(
        ' failed to create content',
        error,
      );
    }
  }

  //======get contents========//

  async getContents(): Promise<ApprovedContentEntity[]> {
    const options: FindOneOptions<ApprovedContentEntity> = {
      where: {
        isApproved: true,
      },
    };
    try {
      const contents: ApprovedContentEntity[] = await this.find(options);
      if (contents) {
        this.logger.verbose('successfully fetched blog contents');
      }
      return contents;
    } catch (error) {
      this.logger.error(' error fetching contents');
      throw new InternalServerErrorException('error fetching blog contents');
    }
  }

  //======get a single content using id========//

  getContent = async (id: string): Promise<ApprovedContentEntity> => {
    console.log(id);
    try {
      const option: FindManyOptions<ApprovedContentEntity> = {
        where: {
          id,
          isApproved: true,
        },
      };
      const content = await this.find(option);

      if (!content) {
        throw new NotFoundException(`order with id ${id} not found`);
      } else {
        this.logger.verbose(`user successfully fetched content with id ${id}`);
        return content[0];
      }
    } catch (error) {
      this.logger.error(`error fetching content with id: ${id}`);
      throw new InternalServerErrorException(' error fetching content');
    }
  };

  //======get a single content as an authenticated user=========//

  getContentUser = async (
    id: string,
    user: AuthEntity,
  ): Promise<ApprovedContentEntity> => {
    console.log(id);
    try {
      const option: FindManyOptions<ApprovedContentEntity> = {
        where: {
          id,
          isApproved: true,
        },
      };
      const content = await this.find(option);

      if (!content) {
        throw new NotFoundException(`order with id ${id} not found`);
      } else {
        this.logger.verbose(
          `user ${user.name} successfully fetched content with id ${id}`,
        );
        return content[0];
      }
    } catch (error) {
      this.logger.error(`error fetching content with id: ${id}`);
      throw new InternalServerErrorException(' error fetching content');
    }
  };

  //======update content with respect to authorization========//

  async updateContent(
    id: string,
    user: AuthEntity,
    updateContentDto: UpdateContentDto,
  ): Promise<ContentObject> {
    const { title, description } = updateContentDto;
    const { isAdmin, userType, name } = user;

    try {
      const updatedContent = await this.getContentUser(id, user);
      const _approvedContent = await ApprovedContentEntity.findOneBy({
        title: updatedContent.title,
      });

      updatedContent.title = title;
      updatedContent.description = description;

      console.log(updatedContent);

      if (userType === 'user') {
        updatedContent.isApproved = false;
        await updatedContent.save();
        this.logger.verbose(`updated content has been submitted for approval`);
      } else if (userType === 'employee') {
        await updatedContent.save();
        this.logger.verbose(`updated content has been updated`);
      }

      if (updatedContent.isApproved === true || isAdmin === true) {
        const approvedContent = _approvedContent;
        if (approvedContent) {
          approvedContent.title = updatedContent.title;
          approvedContent.description = updatedContent.description;
          approvedContent.date = updatedContent.date;
          approvedContent.date = updatedContent.date;

          await approvedContent.save();
        }
      }
      this.logger.log(`content updated successfully by, ${name}`);
      return {
        id: updatedContent.id,
        title: updatedContent.title,
        description: updatedContent.description,
        name: updatedContent.name,
      };
    } catch (error) {
      throw new InternalServerErrorException('error updating content');
    }
  }

  //======delete content with respect to authorization========//

  async deleteContent(
    id: string,
    user: AuthEntity,
  ): Promise<ContentObject | string> {
    const { userType, isAdmin, name } = user;
    try {
      const content = await this.getContentUser(id, user);

      if (!content) {
        throw new NotFoundException(`Content with id ${id} not found`);
      }

      if (userType === 'employee' || isAdmin === true) {
        await ApprovedContentEntity.delete({
          title: content.title,
        });
        await ContentEntity.delete({
          id: content.id,
        });
        this.logger.log(
          `content with title ${content.title}, successfully deleted by ${name}`,
        );
      } else if (userType === 'user' && isAdmin === false) {
        content.title = 'REQUEST To Delete';
        content.isApproved = false;
        await content.save();
        this.logger.log(`request to delete content has been submitted`);
      }

      return `content with id ${id}, ${content.name} has been deleted`;
    } catch (error) {
      this.logger.error(`error deleting content with id: ${id}`, error.stack);
      throw new InternalServerErrorException('failed to delete content');
    }
  }
}