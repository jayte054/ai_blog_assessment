import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ApprovedContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  isApproved: Boolean;

  @Column()
  name: string;

  @Column({ default: new Date() })
  date: string;

  @ManyToOne(() => AuthEntity, (user) => user.titles, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}