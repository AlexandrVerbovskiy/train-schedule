import { Controller, Post, Param, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FavoritesService } from './favorites.service';
import { FavoriteToggleResponseDto } from './dto/favorite-toggle-response.dto';
import { RequestWithUser } from '../common/interfaces';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':trainId/toggle')
  @ApiOperation({
    summary: 'Toggle favorite',
    description:
      'Adds a train to favorites if NOT present, otherwise removes it',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: FavoriteToggleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Train not found' })
  toggle(
    @Req() req: RequestWithUser,
    @Param('trainId') trainId: string,
  ): Promise<FavoriteToggleResponseDto> {
    return this.favoritesService.toggle(req.user.id, trainId);
  }
}
