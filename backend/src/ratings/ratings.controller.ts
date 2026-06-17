import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RatingsService } from './ratings.service';
import { CreateRatingDto, UpdateRatingDto } from './rating.dto';

@Controller('ratings')
@UseGuards(AuthGuard('jwt'))
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  submit(@Request() req, @Body() dto: CreateRatingDto) {
    return this.ratingsService.submit(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(id, req.user.id, dto);
  }

  @Get('my')
  myRatings(@Request() req) {
    return this.ratingsService.findByUser(req.user.id);
  }

  @Get('store/:storeId')
  byStore(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.ratingsService.findByStore(storeId);
  }
}
