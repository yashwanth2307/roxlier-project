import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { StoresService } from './stores.service';
import { RatingsService } from '../ratings/ratings.service';
import { CreateStoreDto, UpdateStoreDto, StoreFilterDto } from './store.dto';

@Controller('stores')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StoresController {
  constructor(
    private storesService: StoresService,
    private ratingsService: RatingsService,
  ) {}

  @Get()
  findAll(@Query() filter: StoreFilterDto, @Request() req) {
    return this.storesService.findAllWithUserRating(filter, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storesService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStoreDto,
  ) {
    return this.storesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.storesService.remove(id);
  }

  @Get(':id/ratings')
  getStoreRatings(@Param('id', ParseIntPipe) id: number) {
    return this.ratingsService.findByStore(id);
  }
}
