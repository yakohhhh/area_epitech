import { Module } from '@nestjs/common';
import { GoogleContactsService } from './googleContacts.service';

import { GoogleContactsController } from './googleContacts.controller';
import { GoogleContactsOAuthService } from './googleContacts.oauth.service';
import { GoogleContactsOAuthController } from './googleContacts.oauth.controller';

@Module({
  providers: [GoogleContactsService, GoogleContactsOAuthService],
  controllers: [GoogleContactsController, GoogleContactsOAuthController],
  exports: [GoogleContactsService, GoogleContactsOAuthService],
})
export class GoogleContactsModule {}
