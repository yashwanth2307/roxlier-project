import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserFilterDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({ ...dto, password: hashed });
    return this.usersRepository.save(user);
  }

  async findAll(filter: UserFilterDto): Promise<User[]> {
    const where: any = {};
    if (filter.name) where.name = Like(`%${filter.name}%`);
    if (filter.email) where.email = Like(`%${filter.email}%`);
    if (filter.address) where.address = Like(`%${filter.address}%`);
    if (filter.role) where.role = filter.role;

    const order: any = {};
    if (filter.sortBy) {
      order[filter.sortBy] = filter.order || 'ASC';
    }

    return this.usersRepository.find({ where, order });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (dto.email && dto.email !== user.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.remove(user);
  }

  async count(): Promise<number> {
    return this.usersRepository.count();
  }

  async seedAdmin(): Promise<void> {
    const admin = await this.usersRepository.findOne({
      where: { role: UserRole.ADMIN },
    });
    if (!admin) {
      const hashed = await bcrypt.hash('Admin@123', 10);
      const user = this.usersRepository.create({
        name: 'System Administrator User',
        email: 'admin@admin.com',
        password: hashed,
        address: 'System Address for Administrator',
        role: UserRole.ADMIN,
      });
      await this.usersRepository.save(user);
    }
  }
}
