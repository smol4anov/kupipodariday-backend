import { CommonEntity } from 'src/common.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Offer extends CommonEntity {
  @ManyToOne(() => User, (user: User) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish: Wish) => wish.offers)
  item: Wish;

  @Column({ type: 'numeric', scale: 2 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
