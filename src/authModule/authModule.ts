import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./authController/authController";
import { AuthEntity } from "./authEntity/authEntity";
import { AuthRepository } from "./authRepository/authRepository";
import { AuthService } from "./authService/authService";
import { JwtStrategy } from "./jwt/jwt-strategy";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt"
import * as config from "config"

const jwtConfig: any | unknown = config.get("jwt")

@Module({
    imports: [
        PassportModule.register({defaultStrategy: "jwt"}),
        JwtModule.register({
            secret: process.env.JWT_SECRET || jwtConfig.secret,
            signOptions: {
                expiresIn: jwtConfig.expiresIn,
            }
        }),
        TypeOrmModule.forFeature([
            AuthEntity,
            AuthRepository
        ])
    ],
    controllers: [AuthController],
    providers: [
        AuthRepository,
        AuthService,
        JwtStrategy
    ],
    exports: [JwtStrategy, PassportModule]
})

export class AuthModule {}