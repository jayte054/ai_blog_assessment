import { Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { ContentObject } from "src/types";
import { DataSource, FindManyOptions, FindOneOptions,  FindOptions,  Repository } from "typeorm";
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
    if (!user) {
      throw new UnauthorizedException('unauthorized');
    }

    const { title, description } = createContentDto;
    const { id, name, userType } = user;

    try {
      const newContent = new ContentEntity();
      newContent.title = title;
      newContent.description = description;
      newContent.isApproved = userType === 'employee' ;
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
    const options: FindManyOptions<ApprovedContentEntity> = {
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
    try {
      const option: FindManyOptions<ApprovedContentEntity> = {
        where: {
          id,
          isApproved: true,
        },
      };
      const content = await this.findOne(option);

      if (!content) {
        throw new NotFoundException(`order with id ${id} not found`);
      } else {
        this.logger.verbose(`user successfully fetched content with id ${id}`);
        return content;
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
    try {
      const option: FindManyOptions<ApprovedContentEntity> = {
        where: {
          id,
          isApproved: true,
        },
      };
      const content = await this.findOne(option);

      if (!content) {
        throw new NotFoundException(`order with id ${id} not found`);
      } else {
        this.logger.verbose(
          `user ${user.name} successfully fetched content with id ${id}`,
        );
        return content;
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
    const {  description } = updateContentDto;
    const { isAdmin, userType, name } = user;
    
    try {
      const updatedContent = await this.getContentUser(id, user);
      if(name !== updatedContent.name) {
        this.logger.error("you are not authorized to update this content")
        throw new UnauthorizedException("you are not authorized to update this content")
      }
      const _approvedContent = await ApprovedContentEntity.findOneBy({
        title: updatedContent.title,
      });

      updatedContent.description = description;


      if (userType === 'user') {
        updatedContent.isApproved = false;
        await updatedContent.save();
        this.logger.verbose(`updated content has been submitted for approval `);
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
        this.logger.error( `error updating content`, error)
      throw new InternalServerErrorException('error updating content', error);
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

      if(content.name !== name){
        this.logger.error('you are not authorized to update this content');
        throw new UnauthorizedException(
          'you are not authorized to update this content',
        );
      }

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
        content.title = 'REQUEST To DELETE';
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

  async approveContent(id: string, user: AuthEntity): Promise<ContentObject> {
    const { isAdmin } = user;
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to approve content',
      );
    }

    try {
      const option: FindManyOptions<ContentEntity> = {
        where: {
          id,
        },
      };
      const content = await this.findOne(option);

      if (!content) {
        throw new NotFoundException('Content not found');
      }

      content.isApproved = true;
      await content.save();

      const approvedContent = await ApprovedContentEntity.findOneBy({
        title: content.title,
      });

      if (approvedContent) {
        approvedContent.title = content.title;
        approvedContent.description = content.description;
        approvedContent.date = content.date;
        await approvedContent.save();
      } else {
        const newApprovedContent = ApprovedContentEntity.create(content);
        await newApprovedContent.save();
      }

      this.logger.log(`Content approved successfully by, ${user.name}`);
      return {
        id: content.id,
        title: content.title,
        description: content.description,
        name: content.name,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error approving content');
    }
  }

  async approveUpdateByAdmin(
    id: string,
    user: AuthEntity,
  ): Promise<ContentObject> {
    const { isAdmin } = user;
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to update content',
      );
    }

    try {
      const option: FindManyOptions<ContentEntity> = {
        where: {
          id,
        },
      };
      const content = await this.findOne(option);

      if (!content) {
        throw new NotFoundException('Content not found');
      }

      content.isApproved = true;

      await content.save();

      const approvedContent = await ApprovedContentEntity.findOneBy({
        title: content.title,
      });

      if (approvedContent) {
        approvedContent.title = content.title;
        approvedContent.description = content.description;
        approvedContent.date = content.date;
        await approvedContent.save();
      }

      this.logger.log(`Content updated successfully by, ${user.name}`);
      return {
        id: content.id,
        title: content.title,
        description: content.description,
        name: content.name,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error updating content');
    }
  }

  async approveContentDelete(
    id: string,
    user: AuthEntity,
  ): Promise<ContentObject | string> {
    const { isAdmin, name } = user;
    if (!isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to delete content',
      );
    }

    try {
      const option: FindManyOptions<ContentEntity> = {
        where: {
          id,
        },
      };
      const content = await this.findOne(option);
        if(content.isApproved = false){
            await ContentEntity.delete({
                id: content.id
            })
             this.logger.log(`Content deleted successfully by, ${name}`);
        }


      const approvedContent = await ApprovedContentEntity.findOneBy({
         id,
      });
      if (approvedContent) {
         await ApprovedContentEntity.delete({ id });
      }

      this.logger.log(`Content deleted successfully by, ${name}`);
      return `content with id ${id}, ${content.name} has been deleted`;
    } catch (error) {
        this.logger.error("failed to delete content with id;", id)
      throw new InternalServerErrorException('Error deleting content');
    }
  }
}