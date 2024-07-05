import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {JwtService} from "@nestjs/jwt"
import { AuthCredentialsDto } from "../authDto/authCredentialsDto";
import { AuthSignInDto } from "../authDto/authSigninDto";
import { AuthRepository } from "../authRepository/authRepository";
import { authObject, JwtPayload } from "../../types";

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  //=====signup====
  async signup(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.authRepository.signUp(authCredentialsDto);
  }

  //====admin signup======//
  async adminSignup(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.authRepository.adminSignUp(authCredentialsDto);
  }

  //======signin======
  async signIn(authSigninDto: AuthSignInDto): Promise<{ accessToken: string }> {
    const userDetails = await this.authRepository.validateUserPassword(
      authSigninDto,
    );

    try {
      const { id, email, name, isAdmin, userType } = userDetails;

      if (!userDetails) {
        throw new UnauthorizedException('invalid credentials');
      }

      const payload: JwtPayload = {
        id,
        email,
        isAdmin,
        name,
        userType,
      };

      const accessToken = await this.jwtService.sign(payload);
      this.logger.verbose(
        `JWT token generated with payload: ${JSON.stringify(payload)}`,
      );
      const response = {
        accessToken: accessToken,
        user: userDetails,
      };
      return response;
    } catch (error) {
      this.logger.error('incorrect user details');
      throw new InternalServerErrorException('invalid user details', error);
    }
  }
}