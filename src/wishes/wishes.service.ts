import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  create(createWishDto: CreateWishDto) {
    return 'This action adds a new wish';
  }

  findLastWishes() {
    return `This action returns last wishes`;
  }

  findTopWishes() {
    return `This action returns top wishes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wish`;
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }

  copyWish(id: number) {
    return `This action copies a #${id} wish`;
  }
}
