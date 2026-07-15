/* tf_microservicio-interacciones/src/matches/matches.module.ts */
import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
