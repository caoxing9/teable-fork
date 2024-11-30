import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  MiddlewareConsumer,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseGuards,
  ValidationPipe,
  ExceptionFilter,
} from '@nestjs/common';
import { scimUsersVoSchema, IScimUsersVo } from '@teable/openapi';
import { Public } from '../auth/decorators/public.decorator';
import { ScimService } from './scim.service';
import SCIMMY from 'scimmy';
import { NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { ScimGuard } from './scim.guard';
import { ZodValidationPipe } from '../../zod.validation.pipe';
import { ScimExceptionFilter } from './uniqueness.exception';
import { randomUUID } from 'node:crypto';

@UseGuards(ScimGuard)
@Controller('/api/scim/v2')
@Public()
export class ScimController {
  constructor(
    private readonly scimService: ScimService,
    private configService: ConfigService
  ) {
    // SCIMMY.Resources.declare(SCIMMY.Resources.User)
    //     .ingress((resource: any, data: any) => {
    //         console.log('User resource created', `${resource.externalId} : ${data.externalId}`);
    //         return {
    //             'id': data.id
    //         }
    //     })
    // .egress((resource: any) => {
    //     console.log('User resource read', resource);
    //     return {'id': '0'}
    // })
    // .degress((resource: any) => {
    //     console.log('User resource delete', resource);
    //     return {'id': '0'}
    // });
  }

  @Get('ServiceProviderConfig')
  getConfig() {
    return {
      authenticationSchemes: [],
      bulk: {
        maxOperations: 1000,
        maxPayloadSize: 1048576,
        supported: false,
      },
      changePassword: {
        supported: false,
      },
      etag: {
        supported: false,
      },
      filter: {
        maxResults: 200,
        supported: false,
      },
      meta: {
        resourceType: 'ServiceProviderConfig',
      },
      patch: {
        supported: false,
      },
      schemas: ['urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig'],
      sort: {
        supported: false,
      },
    };
  }

  // Retrieves one or more complete or partial resources.
  @Post('Users')
  @UseFilters(ScimExceptionFilter)
  postUsers(@Body(new ZodValidationPipe(scimUsersVoSchema)) importRo: IScimUsersVo) {
    return this.scimService.createUser(importRo);

    // return    {
    //     "schemas":["urn:ietf:params:scim:schemas:core:2.0:User"],
    //     "userName": "",
    //     "name":{
    //         "formatted":"Ms. Barbara J Jensen III",
    //         "familyName":"Jensen",
    //         "givenName":"Barbara",
    //         "middleName": "",
    //         "honorificPrefix": "",
    //         "honorificSuffix": ""
    //     },
    //     "displayName": "",
    //     "nickName": "",
    //     "profileUrl": "",
    //     "title": "",
    //     "userType": "",
    //     "locale": "",
    //     "timezone": "",
    //     "active": true,
    //     "preferredLanguage": "",
    //     "id":"2819c223-7f76-453a-919d-413861904646",
    //     "externalId":"bjensen",
    //     "meta":{
    //         "resourceType":"User",
    //         "location": "https://example.com/v2/Users/2819c223-7f76-453a-919d-413861904646"
    //     },
    //     "userName":"bjensen"
    // }
  }

  // @Get('Users')
  // getUsers() {
  //     return new SCIMMY.Resources.User().read({});
  // }
  //
  // @Get('Users/:userId')
  // getUser(@Param('userId') userId: string) {
  //     return new SCIMMY.Resources.User(userId).read({});
  // }
  //
  // @Post('Users')
  // postUsers(@Body() body: any) {
  //     return new SCIMMY.Resources.User().write(body, {});
  // }
  //
  // @Put('Users/:id')
  // putUser(@Param('userId') userId: string, @Body() body: any) {
  //     return new SCIMMY.Resources.User(userId).write(body, {});
  // }
  //
  // @Patch('Users/:id')
  // patchUser(@Param('userId') userId: string, @Body() body: any) {
  //     return new SCIMMY.Resources.User(userId).patch(body, {});
  // }
  //
  // @Delete('Users/:id')
  // deleteUser(@Param('userId') userId: string) {
  //     return new SCIMMY.Resources.User(userId).dispose({});
  // }

  @Post('Groups')
  postGroups(@Body() importRo: any) {
    return { id: randomUUID(), ...importRo };
  }
}
