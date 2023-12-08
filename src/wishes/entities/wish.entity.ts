import { CommonEntity } from 'src/common.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class Wish extends CommonEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'numeric', scale: 2 })
  price: number;

  @Column({ default: 0, type: 'numeric', scale: 2 })
  raised: number;

  @ManyToOne(() => User, (user: User) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer: Offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  copied: number;
}
