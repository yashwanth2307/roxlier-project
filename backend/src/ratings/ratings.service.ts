import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { CreateRatingDto, UpdateRatingDto } from './rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async submit(userId: number, dto: CreateRatingDto): Promise<Rating> {
    const existing = await this.ratingsRepository.findOne({
      where: { user_id: userId, store_id: dto.store_id },
    });
    if (existing) {
      throw new ConflictException('You have already rated this store');
    }
    const rating = this.ratingsRepository.create({
      user_id: userId,
      store_id: dto.store_id,
      value: dto.value,
    });
    return this.ratingsRepository.save(rating);
  }

  async update(id: number, userId: number, dto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.ratingsRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    rating.value = dto.value;
    return this.ratingsRepository.save(rating);
  }

  async findByStore(storeId: number): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { store_id: storeId },
      relations: { user: true },
    });
  }

  async findByUser(userId: number): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { user_id: userId },
      relations: { store: true },
    });
  }

  async count(): Promise<number> {
    return this.ratingsRepository.count();
  }

  async getStoreAverageRating(storeId: number): Promise<number> {
    const result = await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('COALESCE(AVG(rating.value), 0)', 'avg')
      .where('rating.store_id = :storeId', { storeId })
      .getRawOne();
    return parseFloat(result.avg);
  }
}
