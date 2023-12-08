import {
  Injectable,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Repository, QueryFailedError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private configService: ConfigService,
  ) {}

  @HttpCode(201)
  async create(user: User, createWishDto: CreateWishDto) {
    const newWish = this.wishRepository.create(createWishDto);
    newWish.owner = user;
    try {
      const result = await this.wishRepository.insert(newWish);
      return this.findOne(result.identifiers[0].id);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async findLastWishes() {
    const result = await this.wishRepository.find({
      take: this.configService.get<number>('NUMBER_OF_LAST_WISHES', 40),
      order: {
        createdAt: 'DESC',
      },
    });
    return result;
  }

  async findTopWishes() {
    return await this.wishRepository.find({
      take: this.configService.get<number>('NUMBER_OF_TOP_WISHES', 20),
      order: {
        copied: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishRepository.findOne({
      relations: {
        offers: true,
      },
      where: { id },
    });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    if (wish.offers.length > 0) {
      throw new ForbiddenException('Wish has offers already');
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenException(`Forbidden to update someone else's wish`);
    }
    Object.assign(wish, updateWishDto);
    try {
      return await this.wishRepository.save(wish);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, userId: number) {
    const wish = await this.findOne(id);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException(`Forbidden to delete someone else's wish`);
    }
    return await this.wishRepository.delete(wish);
  }

  async copyWish(id: number, user: User) {
    const wish = await this.findOne(id);
    return this.create(user, wish);
  }
}
