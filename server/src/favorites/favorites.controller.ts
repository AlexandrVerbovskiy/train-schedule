import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':routePointId/toggle')
  @ApiOperation({ summary: 'Add or remove route point from favorites' })
  toggle(@Req() req, @Param('routePointId') routePointId: string) {
    return this.favoritesService.toggle(req.user.id, routePointId);
  }
}
