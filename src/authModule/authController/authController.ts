import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import {ApiTags, ApiOperation, ApiResponse} from "@nestjs/swagger";
import { AuthCredentialsDto } from "../authDto/authCredentialsDto";
import { AuthSignInDto } from "../authDto/authSigninDto";
import { AuthService } from "../authService/authService";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register the user' })
  @ApiResponse({ status: 201, description: 'user created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    return await this.authService.signup(authCredentialsDto);
  }

  @ApiOperation({ summary: 'Authenicate the user' })
  @ApiResponse({ status: 201, description: `{accessToken:"", user:{}}` })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authSignInDto: AuthSignInDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authSignInDto);
  }
}