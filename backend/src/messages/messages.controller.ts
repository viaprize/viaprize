import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Messages') @ApiBearerAuth() @UseGuards(AuthGuard) @Controller('messages')
export class MessagesController {
  constructor(private readonly svc: MessagesService) {}
  @Post('conversations') create(@Req() r: any, @Body() d: CreateConversationDto) { return this.svc.createConversation(r.user.id, d); }
  @Get('conversations') list(@Req() r: any) { return this.svc.getConversations(r.user.id); }
  @Post('send') send(@Req() r: any, @Body() d: CreateMessageDto) { return this.svc.sendMessage(r.user.id, d); }
  @Get('conversations/:id') msgs(@Param('id') id: string, @Req() r: any) { return this.svc.getMessages(id, r.user.id); }
  @Post('conversations/:id/read') read(@Param('id') id: string, @Req() r: any) { return this.svc.markAsRead(id, r.user.id); }
}
