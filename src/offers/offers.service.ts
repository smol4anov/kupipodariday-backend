import {
  Injectable,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, DataSource } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from 'src/users/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly dataSource: DataSource,
    private wishesService: WishesService,
  ) {}

  @HttpCode(201)
  async create(user: User, createOfferDto: CreateOfferDto) {
    const newOffer = this.offerRepository.create(createOfferDto);

    newOffer.user = user;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      newOffer.item = await this.wishesService.changeRaisedSum(
        createOfferDto.itemId,
        newOffer.amount,
        user.id,
      );

      const result = await this.offerRepository.insert(newOffer);

      await queryRunner.commitTransaction();
      return this.findOne(result.identifiers[0].id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (
        err instanceof QueryFailedError ||
        err instanceof BadRequestException
      ) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.offerRepository.find();
  }

  async findOne(id: number) {
    return await this.offerRepository.findOne({ where: { id } });
  }
}
