import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { PrizesComments } from '../entities/prizes-comments.entity';
import { PrizesService } from './prizes.service';

@Injectable()
export class PrizeCommentService {
    constructor(
        @InjectRepository(PrizesComments)
        private prizeCommentsRepository: Repository<PrizesComments>,
        private userService: UsersService,
        private prizeService: PrizesService
    ) { }

    async create(comment: string, userAuthId: string, prizeId: string) {
        const user = await this.userService.findOneByAuthId(userAuthId);

        const prize = await this.prizeService.findAndGetByIdOnly(prizeId);

        const prizeComment = await this.prizeCommentsRepository.save({
            comment: comment,
            user: user,
            prize: prize,
        });
        return prizeComment;
    }

    async getCommentsByPrizeId(prizeId: string) {
        const prizeComments = await this.prizeCommentsRepository.find({
            where: { prize:{
                id: prizeId
            } },
            relations: ['user'],
        });
        return prizeComments;
    }

}
