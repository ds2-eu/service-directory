import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { RepositoryService } from './repository.service';

@Global()
@Module({
	imports: [HttpModule],
	providers: [RepositoryService],
	exports: [RepositoryService],
})
export class RepositoryModule {}
