import { Controller, ValidationPipe } from "@nestjs/common";
import {Body, Delete, Get, Param, Patch, Post, UseGuards, UsePipes} from "@nestjs/common/decorators"
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ContentService } from "../contentService/contentService";
import { CreateContentDto, UpdateContentDto } from "../contentDto/contentDto";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { ContentObject } from "src/types";
import { GetUser } from "src/authModule/getUserDecorator/getUser";
import { ApprovedContentEntity } from "../contentEntity/approvedContentEntity";

@ApiTags('Blog Content')
@Controller('content')
@UseGuards(AuthGuard())
export class ContentController {
  constructor(private contentService: ContentService) {}

  @ApiOperation({ summary: 'create content' })
  @ApiResponse({
    status: 200,
    description: `{id: "", title: "", description:"", name:""}`,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('/createContent')
  @UsePipes(ValidationPipe)
  async createContent(
    @Body() createContentDto: CreateContentDto,
    @GetUser() user: AuthEntity,
  ): Promise<ContentObject> {
    return await this.contentService.createContent(createContentDto, user);
  }

  @ApiOperation({ summary: 'update content with respect to authorization' })
  @ApiResponse({
    status: 200,
    description: `{id: "", title: "", description: "", name: ""}`,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Patch('/update/:id')
  @UsePipes(ValidationPipe)
  async updateContent(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
    @Body() updateContentDto: UpdateContentDto,
  ): Promise<ContentObject> {
    return await this.contentService.updateContent(id, user, updateContentDto);
  }

  @ApiOperation({ summary: 'Delete content with respect to authorization' })
  @ApiResponse({
    status: 200,
    description: `content with id {id}, {name} has been deleted`,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete('/delete/:id')
  async deleteContent(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<ContentObject | string> {
    return await this.contentService.deleteContent(id, user);
  }

  @ApiOperation({ summary: 'approve content with respect to authorization' })
  @ApiResponse({
    status: 200,
    description: `content with id {id}, {name} has been approved`,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Patch('/approve/:id')
  async approveContent(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<ContentObject | string> {
    return await this.contentService.approveContent(id, user);
  }

  @ApiOperation({ summary: 'approve content with respect to authorization' })
  @ApiResponse({
    status: 200,
    description: `content with id {id}, {name} has been approved`,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Patch('/approveUpdate/:id')
  async updateContentByAdmin(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<ContentObject | string> {
    return await this.contentService.approveUpdateByAdmin(id, user);
  }

  @ApiOperation({ summary: 'approve content with respect to authorization' })
  @ApiResponse({
    status: 200,
    description: `content with id {id}, {name} has been deleted`,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete('/approveDelete/:id')
  async approveContentDelete(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<ContentObject | string> {
    return await this.contentService.approveContentDelete(id, user);
  }
}

@ApiTags('Blog Content')
@Controller('content')
export class GetContentController {
  constructor(private contentService: ContentService) {}

  @ApiOperation({ summary: 'get contents that are already approved' })
  @ApiResponse({
    status: 200,
    description: `[{
    id:"", 
    title: "", 
    description: "", 
    isApproved: boolean, 
    name: "", date: "", 
    userId: ""}]`,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('/getContents')
  @UsePipes(ValidationPipe)
  async getContents(): Promise<ApprovedContentEntity[]> {
    return await this.contentService.getContents();
  }

  @ApiOperation({ summary: 'get a particular content with the id' })
  @ApiResponse({
    status: 200,
    description: `{
    id:"", 
    title: "", 
    description: "", 
    isApproved: boolean, 
    name: "", date: "", 
    userId: ""}`,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('/getContent/:id')
  @UsePipes(ValidationPipe)
  async getContent(@Param('id') id: string): Promise<ApprovedContentEntity> {
    return await this.contentService.getContent(id);
  }
}