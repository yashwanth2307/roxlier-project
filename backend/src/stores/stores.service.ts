import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto, UpdateStoreDto, StoreFilterDto } from './store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async create(dto: CreateStoreDto): Promise<Store> {
    const existing = await this.storesRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Store email already exists');
    }
    const store = this.storesRepository.create(dto);
    return this.storesRepository.save(store);
  }

  async findAll(filter: StoreFilterDto, userId?: number): Promise<any[]> {
    const qb = this.storesRepository
      .createQueryBuilder('store')
      .leftJoin('store.ratings', 'rating')
      .addSelect('COALESCE(AVG(rating.value), 0)', 'averageRating')
      .groupBy('store.id');

    if (filter.name) {
      qb.andWhere('store.name ILIKE :name', { name: `%${filter.name}%` });
    }
    if (filter.address) {
      qb.andWhere('store.address ILIKE :address', {
        address: `%${filter.address}%`,
      });
    }

    if (filter.sortBy) {
      const direction = filter.order || 'ASC';
      if (filter.sortBy === 'averageRating') {
        qb.orderBy('"averageRating"', direction);
      } else {
        qb.orderBy(`store.${filter.sortBy}`, direction);
      }
    }

    const raw = await qb.getRawAndEntities();

    return raw.entities.map((store, index) => {
      const avg = parseFloat(raw.raw[index]?.averageRating || '0');
      return {
        ...store,
        averageRating: Math.round(avg * 100) / 100,
      };
    });
  }

  async findAllWithUserRating(
    filter: StoreFilterDto,
    userId: number,
  ): Promise<any[]> {
    const qb = this.storesRepository
      .createQueryBuilder('store')
      .leftJoin('store.ratings', 'rating')
      .addSelect('COALESCE(AVG(rating.value), 0)', 'averageRating')
      .leftJoin(
        'store.ratings',
        'userRating',
        'userRating.user_id = :userId',
        { userId },
      )
      .addSelect('userRating.value', 'userRatingValue')
      .groupBy('store.id')
      .addGroupBy('userRating.value');

    if (filter.name) {
      qb.andWhere('store.name ILIKE :name', { name: `%${filter.name}%` });
    }
    if (filter.address) {
      qb.andWhere('store.address ILIKE :address', {
        address: `%${filter.address}%`,
      });
    }

    if (filter.sortBy) {
      const direction = filter.order || 'ASC';
      if (filter.sortBy === 'averageRating') {
        qb.orderBy('"averageRating"', direction);
      } else {
        qb.orderBy(`store.${filter.sortBy}`, direction);
      }
    }

    const raw = await qb.getRawAndEntities();

    return raw.entities.map((store, index) => {
      const avg = parseFloat(raw.raw[index]?.averageRating || '0');
      return {
        ...store,
        averageRating: Math.round(avg * 100) / 100,
        userRating: raw.raw[index]?.userRatingValue || null,
      };
    });
  }

  async findById(id: number): Promise<Store | null> {
    return this.storesRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
  }

  async findByOwnerId(ownerId: number): Promise<Store | null> {
    return this.storesRepository.findOne({
      where: { owner_id: ownerId },
    });
  }

  async update(id: number, dto: UpdateStoreDto): Promise<Store> {
    const store = await this.findById(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    if (dto.email && dto.email !== store.email) {
      const existing = await this.storesRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('Store email already exists');
      }
    }
    Object.assign(store, dto);
    return this.storesRepository.save(store);
  }

  async remove(id: number): Promise<void> {
    const store = await this.findById(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    await this.storesRepository.remove(store);
  }

  async count(): Promise<number> {
    return this.storesRepository.count();
  }
}
