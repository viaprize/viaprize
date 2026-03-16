import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrizesComments } from '../entities/prizes-comments.entity';
import { User } from 'src/users/entities/user.entity';
import { Prize } from '../entities/prize.entity';

@Injectable()
export class PrizesCommentsService {
  constructor(
    @InjectRepository(PrizesComments)
    private commentsRepo: Repository<PrizesComments>,
    @InjectRepository(Prize)
    private prizeRepo: Repository<Prize>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async addComment(prizeId: string, authId: string, comment: string, parentId?: string) {
    const prize = await this.prizeRepo.findOne({ where: { id: prizeId } });
    if (!prize) throw new NotFoundException('Prize not found');
    const user = await this.userRepo.findOne({ where: { authId } });
    if (!user) throw new NotFoundException('User not found');

    const newComment = this.commentsRepo.create({
      comment,
      user,
      prize,
    });

    if (parentId) {
      const parent = await this.commentsRepo.findOne({ where: { id: parentId } });
      if (!parent) throw new NotFoundException('Parent comment not found');
      newComment.parentComment = parent;
      parent.reply_count += 1;
      await this.commentsRepo.save(parent);
    }

    return this.commentsRepo.save(newComment);
  }

  async getComments(prizeId: string) {
    return this.commentsRepo.find({
      where: { prize: { id: prizeId }, parentComment: null as any },
      relations: ['user', 'childComments', 'childComments.user'],
      order: { created_at: 'DESC' },
    });
  }

  async likeComment(commentId: string, authId: string) {
    const comment = await this.commentsRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    // Remove from dislikes if present
    comment.dislikes = comment.dislikes.filter(id => id !== authId);
    // Toggle like
    if (comment.likes.includes(authId)) {
      comment.likes = comment.likes.filter(id => id !== authId);
    } else {
      comment.likes.push(authId);
    }
    return this.commentsRepo.save(comment);
  }

  async dislikeComment(commentId: string, authId: string) {
    const comment = await this.commentsRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    comment.likes = comment.likes.filter(id => id !== authId);
    if (comment.dislikes.includes(authId)) {
      comment.dislikes = comment.dislikes.filter(id => id !== authId);
    } else {
      comment.dislikes.push(authId);
    }
    return this.commentsRepo.save(comment);
  }

  async deleteComment(commentId: string, authId: string) {
    const comment = await this.commentsRepo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.authId !== authId) throw new NotFoundException('Not authorized');
    return this.commentsRepo.remove(comment);
  }
}
