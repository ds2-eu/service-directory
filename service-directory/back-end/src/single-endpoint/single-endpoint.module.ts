import { Module } from '@nestjs/common';
import { SingleEndpointController } from './single-endpoint.controller';
import { SingleEndpointService } from './single-endpoint.service';

@Module({
	controllers: [SingleEndpointController],
	providers: [SingleEndpointService],
})
export class SingleEndpointModule {}
