import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { PortalsComments } from '../entities/portals-comments.entity';
import { PortalsService } from './portals.service';

@Injectable()
export class PortalCommentService {
  constructor(
    @InjectRepository(PortalsComments)
    private portalCommentsRepository: Repository<PortalsComments>,
    private userService: UsersService,
    private portalService: PortalsService,
  ) {}

  async create(comment: string, userAuthId: string, portalId: string) {
    const user = await this.userService.findOneByAuthId(userAuthId);

    const portal = await this.portalService.findAndGetByIdOnly(portalId);

    const portalComment = await this.portalCommentsRepository.save({
      comment: comment,
      user: user,
      portal: portal,
    });
    return portalComment;
  }

  async getCommentsByPortalId(portalId: string) {
    const portalComments = await this.portalCommentsRepository.find({
      where: {
        portal: {
          id: portalId,
        },
      },
      relations: ['user'],
    });
    return portalComments;
  }

  async replyToComment(commentId: string, comment: string, userAuthId: string) {
    const user = await this.userService.findOneByAuthId(userAuthId);
    const parentComment = await this.portalCommentsRepository.findOneBy({
      id: commentId,
    });

    if (!parentComment) {
      throw new Error('Comment not found');
    }
    const portalComment = await this.portalCommentsRepository.save({
      comment: comment,
      user: user,
      portal: parentComment.portal,
    });
    return portalComment;
  }
  async likeComment(commentId: string, userAuthId: string) {
    const comment = await this.portalCommentsRepository.findOneBy({
      id: commentId,
    });

    if (!comment) {
      throw new Error('Comment not found');
    }
    comment.likes = [...comment.likes, userAuthId];
    await this.portalCommentsRepository.save(comment);
    return comment;
  }

  async dislikeComment(commentId: string, userAuthId: string) {
    const comment = await this.portalCommentsRepository.findOneBy({
      id: commentId,
    });
    if (!comment) {
      throw new Error('Comment not found');
    }
    comment.dislikes = [...comment.dislikes, userAuthId];
    await this.portalCommentsRepository.save(comment);
    return comment;
  }
}
