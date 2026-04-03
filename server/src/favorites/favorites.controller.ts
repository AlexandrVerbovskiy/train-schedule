import { Controller, Post, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FavoritesService } from './favorites.service';
import { RequestWithUser } from '../common/interfaces';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':trainId/toggle')
  @ApiOperation({ summary: 'Add or remove train from favorites' })
  toggle(@Req() req: RequestWithUser, @Param('trainId') trainId: string) {
    return this.favoritesService.toggle(req.user.id, trainId);
  }
}
