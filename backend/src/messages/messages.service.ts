import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    @InjectRepository(Conversation) private convoRepo: Repository<Conversation>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createConversation(creatorId: string, dto: CreateConversationDto) {
    const ids = [...new Set([creatorId, ...dto.participantIds])];
    const participants = await this.userRepo.find({ where: { id: In(ids) } });
    return this.convoRepo.save(this.convoRepo.create({ participants }));
  }

  async sendMessage(senderId: string, dto: CreateMessageDto) {
    let convo: Conversation;
    if (dto.conversationId) {
      convo = await this.convoRepo.findOne({ where: { id: dto.conversationId }, relations: ['participants'] });
      if (!convo) throw new NotFoundException();
    } else if (dto.recipientId) {
      const existing = await this.convoRepo.createQueryBuilder('c').innerJoin('c.participants','p').where('p.id IN (:...ids)',{ids:[senderId,dto.recipientId]}).groupBy('c.id').having('COUNT(DISTINCT p.id)=2').getOne();
      convo = existing || await this.createConversation(senderId, { participantIds: [dto.recipientId] });
    } else throw new NotFoundException('Need conversationId or recipientId');
    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    const msg = this.msgRepo.create({ content: dto.content, sender, conversation: convo });
    convo.updated_at = new Date();
    await this.convoRepo.save(convo);
    return this.msgRepo.save(msg);
  }

  async getConversations(userId: string) {
    return this.convoRepo.createQueryBuilder('c').innerJoin('c.participants','p','p.id=:userId',{userId}).leftJoinAndSelect('c.participants','all').leftJoinAndSelect('c.messages','m').leftJoinAndSelect('m.sender','s').orderBy('c.updated_at','DESC').getMany();
  }

  async getMessages(convoId: string, userId: string) {
    const c = await this.convoRepo.findOne({ where: { id: convoId }, relations: ['participants'] });
    if (!c || !c.participants.some(p => p.id === userId)) throw new NotFoundException();
    return this.msgRepo.find({ where: { conversation: { id: convoId } }, relations: ['sender'], order: { created_at: 'ASC' } });
  }

  async markAsRead(convoId: string, userId: string) {
    await this.msgRepo.createQueryBuilder().update(Message).set({ read: true }).where('conversationId=:convoId',{convoId}).andWhere('senderId!=:userId',{userId}).execute();
  }
}
