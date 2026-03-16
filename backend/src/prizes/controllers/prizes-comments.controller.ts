import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PrizesCommentsService } from '../services/prizes-comments.service';
import { AuthGuard } from '../../auth/auth.guard';

@ApiTags('Prize Comments')
@Controller('prizes/:prizeId/comments')
export class PrizesCommentsController {
  constructor(private readonly commentsService: PrizesCommentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  addComment(
    @Param('prizeId') prizeId: string,
    @Req() req: any,
    @Body() body: { comment: string; parentId?: string },
  ) {
    return this.commentsService.addComment(prizeId, req.user.authId, body.comment, body.parentId);
  }

  @Get()
  getComments(@Param('prizeId') prizeId: string) {
    return this.commentsService.getComments(prizeId);
  }

  @Post(':commentId/like')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  likeComment(@Param('commentId') commentId: string, @Req() req: any) {
    return this.commentsService.likeComment(commentId, req.user.authId);
  }

  @Post(':commentId/dislike')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  dislikeComment(@Param('commentId') commentId: string, @Req() req: any) {
    return this.commentsService.dislikeComment(commentId, req.user.authId);
  }

  @Delete(':commentId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  deleteComment(@Param('commentId') commentId: string, @Req() req: any) {
    return this.commentsService.deleteComment(commentId, req.user.authId);
  }
}
