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
    ) { }

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
}
