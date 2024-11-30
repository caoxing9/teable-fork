import { Injectable } from '@nestjs/common';
import { IScimUsersMetaVo, IScimUsersVo } from '@teable/openapi';
import { PrismaService } from '@teable/db-main-prisma';
import { UniquenessException } from './uniqueness.exception';
import { UserService } from '../user/user.service';
import type { Prisma } from '@teable/db-main-prisma';
import { BaseConfig, IBaseConfig } from '../../configs/base.config';

@Injectable()
export class ScimService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    @BaseConfig() private readonly baseConfig: IBaseConfig
  ) {}

  private userSchemaToScimUser(
    user: Pick<
      Prisma.UserGetPayload<null>,
      'id' | 'name' | 'avatar' | 'phone' | 'email' | 'password' | 'notifyMeta' | 'isAdmin'
    >
  ): Omit<IScimUsersMetaVo, 'externalId'> {
    return {
      id: user.id,
      displayName: user.name,
      schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
      emails: [
        {
          value: user.email,
          primary: true,
        },
      ],
      phoneNumbers: user.phone ? [{ value: user.phone }] : [],
      photos: user.avatar ? [{ type: 'photo', value: user.avatar }] : [],
      meta: {
        resourceType: 'User',
        location: `${this.baseConfig.publicOrigin}/api/scim/v2/Users/${user.id}`, // todo absolute url
      },
    };
  }

  async getUserByExternalId(externalId: string): Promise<IScimUsersMetaVo | null> {
    const existAccount = await this.prismaService.txClient().account.findFirst({
      where: { provider: 'oidc', providerId: externalId },
    });
    if (!existAccount) return null;

    const user = await this.userService.getUserById(existAccount.userId);
    if (!user) return null;

    return {
      ...this.userSchemaToScimUser(user),
      externalId: externalId,
    };
  }

  async createUser(user: IScimUsersVo): Promise<IScimUsersMetaVo> {
    const getAccount = await this.getUserByExternalId(user.externalId);
    if (getAccount !== null) throw new UniquenessException();

    // if (existAccount) throw new UniquenessException();

    return {
      ...user,
      id: '2819c223-7f76-453a-919d-413861904646',
      schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
      meta: {
        resourceType: 'User',
        location: 'https://example.com/scim/v2/Users/2819c223-7f76-453a-919d-413861904646',
      },
    };
  }
}
