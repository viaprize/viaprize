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

  async getChildCommentsByParentCommentId(commentId: string) {
    const portalComments = await this.portalCommentsRepository.find({
      where: {
        parentComment: {
          id: commentId,
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

    const replyCount = parentComment.reply_count + 1;
    console.log(replyCount);
    await this.portalCommentsRepository.update(parentComment.id, {
      reply_count: replyCount,
    });
    const portalComment = await this.portalCommentsRepository.save({
      comment: comment,
      user: user,
      portal: parentComment.portal,
      parentComment: parentComment,
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
    if (comment.likes.includes(userAuthId)) {
      comment.likes = comment.likes.filter((id) => id !== userAuthId);
      await this.portalCommentsRepository.save(comment);
      return comment;
    }
    if (comment.dislikes.includes(userAuthId)) {
      comment.dislikes = comment.dislikes.filter((id) => id !== userAuthId);
      comment.likes = [...comment.likes, userAuthId];
    } else {
      comment.likes = [...comment.likes, userAuthId];
    }

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
    if (comment.dislikes.includes(userAuthId)) {
      console.log('remove dislike');
      comment.dislikes = comment.dislikes.filter((id) => id !== userAuthId);
    }
    if (comment.likes.includes(userAuthId)) {
      console.log('remove like add dislike');
      comment.likes = comment.likes.filter((id) => id !== userAuthId);
      comment.dislikes = [...comment.dislikes, userAuthId];
    } else {
      console.log('add dislike');
      comment.dislikes = [...comment.dislikes, userAuthId];
    }
    await this.portalCommentsRepository.save(comment);
    return comment;
  }
  async deleteComment(commentId: string, userAuthId: string) {
    console.log(commentId, userAuthId);
    const comment = await this.portalCommentsRepository.find({
      where: {
        id: commentId,
      },
      relations: ['user'],
    });
    console.log(comment);
    if (!comment) {
      throw new Error('Comment not found');
    }
    if (comment[0].user.authId !== userAuthId) {
      throw new Error('You are not authorized to delete this comment');
    }
    await this.portalCommentsRepository.delete(commentId);
    return true;
  }
}
