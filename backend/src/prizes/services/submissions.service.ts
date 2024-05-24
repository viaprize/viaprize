import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Repository } from 'typeorm';
import { CreateSubmissionDto } from '../dto/create-submission.dto';
import { Submission } from '../entities/submission.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
  ) {}
  async create(
    submission: CreateSubmissionDto,
    user: User,
  ): Promise<Submission> {
    console.log({ submission });
    const submissionObject = this.submissionRepository.create({
      submissionDescription: submission.submissionDescription,
      submissionHash: submission.submissionHash,
      submitterAddress: submission.submitterAddress,
    });
    submissionObject.user = user;

    await this.submissionRepository.save(submissionObject);
    return submissionObject;
  }

  async findAllWithPagination(
    paginationOptions: IPaginationOptions<Submission>,
  ) {
    return this.submissionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: paginationOptions.where,
      relations: ['user'],
    });
  }

  async submissionEdit(
    authId: string,
    submissionId: string,
    submission: Partial<Submission>,
  ) {
    const submissionObject = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: ['user'],
    });
    if (!submissionObject) {
      throw new HttpException('Submission not found', 404);
    }
    if (submissionObject.user.authId !== authId) {
      throw new HttpException('Unauthorized', 401);
    }
    await this.submissionRepository.update(submissionId, submission);
  }

  async findSubmissionById(id: string) {
    const submission = await this.submissionRepository.findOne({
      where: { id },
      relations: ['user', 'prize'],
    });
    console.log({ submission });
    if (!submission) {
      throw new HttpException('Submission not found', 404);
    }
    return submission;
  }
}
