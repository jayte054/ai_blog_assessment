import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthCredentialsDto } from "../authDto/authCredentialsDto";
import { AuthSignInDto } from "../authDto/authSigninDto";
import { AuthService } from "../authService/authService";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/signup")
    async signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ): Promise<string> {
        return await this.authService.signup(authCredentialsDto)
    }

    @Post("/signin")
    async signIn(
        @Body(ValidationPipe) authSignInDto: AuthSignInDto
    ): Promise<{accessToken: string}> {
        return await this.authService.signIn(authSignInDto)
    }
}