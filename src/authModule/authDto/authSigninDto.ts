import { IsString, MinLength, MaxLength, Matches } from "class-validator";


export class AuthSignInDto {
  @IsString()
  @MinLength(10)
  @MaxLength(25)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}