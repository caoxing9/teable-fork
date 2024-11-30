import { Module } from '@nestjs/common';
import { ScimController } from './scim.controller';
import { ScimService } from './scim.service';
import { ConfigService } from '@nestjs/config';
import { DbProvider } from '../../db-provider/db.provider';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ScimController],
  imports: [UserModule],
  providers: [ScimService, ConfigService, DbProvider],
})
export class ScimModule {}
