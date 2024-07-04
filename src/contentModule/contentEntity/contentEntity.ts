import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserType } from "../contentEnum/contentEnum";

@Entity()
export class ContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  isApproved: boolean;

  @Column()
  name: string;

  @Column({ default: new Date() })
  date: string;

  @ManyToOne(() => AuthEntity, (user) => user.titles, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}