import { CommonEntity } from 'src/common.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Length, IsUrl } from 'class-validator';

@Entity()
export class Wishlist extends CommonEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column({ length: 1500 })
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
