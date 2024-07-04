import { ConflictException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { AuthCredentialsDto } from "../authDto/authCredentialsDto";
import { AuthEntity } from "../authEntity/authEntity";
import { AuthSignInDto } from "../authDto/authSigninDto";
import { authObject } from "../../types";
import { UserType } from "src/contentModule/contentEnum/contentEnum";



@Injectable()
export class AuthRepository extends Repository<AuthEntity> {
    private logger = new Logger("AuthRepository")
    constructor(
        private dataSource: DataSource,
    ) {
        super(AuthEntity, dataSource.createEntityManager())
    }

    //===========user signup=============//
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const {name, email, password, userType} = authCredentialsDto

        const salt = await bcrypt.genSalt()

        try{
            const newUser = new AuthEntity()
            newUser.name = name
            newUser.email = email
            newUser.salt = salt
            newUser.password = await bcrypt.hash(password, salt) 
            newUser.isAdmin = false
            newUser.userType = userType

            await newUser.save()
            this.logger.verbose(
              `New user with id of ${newUser.id} successfully created`,
            );
            return `user ${JSON.stringify({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            })} created successfully`
        }catch(error){
            if (error.code === '23505') {
              throw new ConflictException('email already exists');
            } else {
              console.log(error);
              this.logger.error('error creating user');
              throw new InternalServerErrorException('error creating user');
            }
        }
        
    }

    //====user signin======//

    async validateUserPassword(authSiginDto: AuthSignInDto): Promise<authObject> {
        const {email, password} = authSiginDto;
        const queryBuilder = this.createQueryBuilder("user");
        queryBuilder.select([
            "user.id",
            "user.email",
            "user.password",
            "user.salt",
            "user.name",
            "user.isAdmin",
            "user.userType",
        ]).where("user.email = :email", {email})

        const user = await queryBuilder.getOne()
        // console.log(user)

        if(user &&(await user.validatePassword(password))) {
            return {
              id: user.id,
              email: user.email,
              isAdmin: user.isAdmin,
              name: user.name,
              userType: user.userType
            };
        } else {
            return null
        }
    }
}