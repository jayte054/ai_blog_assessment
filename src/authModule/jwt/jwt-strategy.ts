import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as Config from "config"
import {PassportStrategy} from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm";
import  {Strategy, ExtractJwt} from "passport-jwt";
import { AuthRepository } from "../authRepository/authRepository";
import { JwtPayload } from "../../types";
import { AuthEntity } from "../authEntity/authEntity";

const jwtConfig: any | unknown = Config.get("jwt");

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || jwtConfig.secret
        });
    }

    async validate(payload: JwtPayload): Promise<AuthEntity> {
        const {id, email, name, isAdmin, userType} = payload;

        const userQueryBuilder = this.authRepository.createQueryBuilder("user");
        userQueryBuilder.select([
            'user.id',
            'user.email',
            'user.name',
            'user.password',
            'user.salt',
            'user.isAdmin',
            'user.userType'
        ]).where("user.email = :email", {
            email,
            id,
            name,
            isAdmin,
            userType
        })

        const [user] = await Promise.all([
            userQueryBuilder.getOne()
        ])

        if(!user) {
            console.log("user not authroi=")
            throw new UnauthorizedException("uuuunauthorized")
        } else {
            return user
        }
    }
}