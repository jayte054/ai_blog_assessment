import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { ContentEntity } from "src/contentModule/contentEntity/contentEntity";
import { UserType } from "src/contentModule/contentEnum/contentEnum";

@Entity()
@Unique(["email"])
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  isAdmin: boolean;

  @Column()
  userType: UserType;

  @OneToMany(() => ContentEntity, title => title.user, {eager: true})
  titles: [];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}