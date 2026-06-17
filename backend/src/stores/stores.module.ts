import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { RatingsModule } from '../ratings/ratings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), RatingsModule],
  providers: [StoresService],
  controllers: [StoresController],
  exports: [StoresService],
})
export class StoresModule {}
