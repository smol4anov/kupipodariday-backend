import {
  Injectable,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  @HttpCode(201)
  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishesService.findManyByIds(
      createWishlistDto.itemsId,
    );
    const newWishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });

    try {
      return await this.wishlistRepository.save(newWishlist);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return await this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.wishlistRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async update(
    id: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException('Wish not found');
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        `Forbidden to update someone else's wishlist`,
      );
    }
    Object.assign(wishlist, updateWishlistDto);
    wishlist.items = await this.wishesService.findManyByIds(
      updateWishlistDto.itemsId,
    );
    try {
      return await this.wishlistRepository.save(wishlist);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, userId: number) {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(`Forbidden to delete someone else's wish`);
    }
    return await this.wishlistRepository.delete(id);
  }
}
