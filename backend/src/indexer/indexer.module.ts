import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';

@Module({
  imports: [],
  exports: [IndexerService],
  providers: [IndexerService],
})
export class IndexerModule {}
