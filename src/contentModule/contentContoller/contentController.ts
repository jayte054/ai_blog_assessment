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
  @Post('/createContent')
  @UsePipes(ValidationPipe)
  async createContent(
    @Body() createContentDto: CreateContentDto,
    @GetUser() user: AuthEntity,
  ): Promise<ContentObject> {
    console.log(user, createContentDto);
    return await this.contentService.createContent(createContentDto, user);
  }

  @ApiOperation({ summary: 'update content with respect to authorization' })
  @ApiResponse({
    status: 200,
    description: `{id: "", title: "", description: "", name: ""}`,
  })
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
  @ApiResponse({ status: 200, description: `content with id {id}, {name} has been deleted`})
  @Delete('/delete/:id')
  async deleteContent(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<ContentObject | string> {
    return await this.contentService.deleteContent(id, user);
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
  @Get('/getContent/:id')
  @UsePipes(ValidationPipe)
  async getContent(@Param('id') id: string): Promise<ApprovedContentEntity> {
    return await this.contentService.getContent(id);
  }
}