import { kMaxLength } from "buffer";
import { IsString, MinLength, MaxLength, Matches, IsNotEmpty } from "class-validator";
import { UserType } from "src/contentModule/contentEnum/contentEnum";

export class AuthCredentialsDto {
  @IsString()
  @MinLength(10)
  @MaxLength(25)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(25)
  email: string;

  @IsString()
  @IsNotEmpty()
  userType: UserType

  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}