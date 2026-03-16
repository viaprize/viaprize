import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'text' }) content: string;
  @ManyToOne(() => User) sender: User;
  @ManyToOne(() => Conversation, (c) => c.messages) conversation: Conversation;
  @Column({ default: false }) read: boolean;
  @CreateDateColumn() created_at: Date;
}
