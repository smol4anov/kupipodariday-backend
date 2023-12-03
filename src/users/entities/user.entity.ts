import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Length, IsUrl, IsEmail } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { CommonEntity } from 'src/common.entity';

@Entity()
export class User extends CommonEntity {
  @Column({ length: 30 })
  @Length(2, 30)
  username: string;

  @Column({ length: 200, default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish: Wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer: Offer) => offer.user)
  offers: Offer[];

  @ManyToMany(() => Wishlist)
  @JoinTable()
  wishlists: Wishlist[];
}
