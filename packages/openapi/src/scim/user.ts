import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute } from '../utils';
import { z } from '../zod';

export const SCIM_USERS = '/scim/v2/Users';

export const scimUsersVoSchema = z.object({
  externalId: z.string().openapi({ example: '701984' }),
  displayName: z.string().openapi({ example: 'Babs Jensen' }),
  schemas: z
    .array(z.string().openapi({ example: 'urn:ietf:params:scim:schemas:core:2.0:User' }))
    .nonempty(),
  emails: z
    .array(
      z.object({
        value: z.string().email(),
        primary: z.boolean(),
      })
    )
    .refine((emails) => emails.filter((email) => email.primary).length === 1, {
      message: 'There must be exactly one primary email.',
    }),
  phoneNumbers: z
    .array(
      z.object({
        value: z.string().openapi({ example: '555-555-4444' }),
      })
    )
    .optional(),
  photos: z
    .array(
      z.object({
        type: z.union([z.literal('photo'), z.literal('thumbnail')]),
        value: z
          .string()
          .url()
          .openapi({ example: 'https://photos.example.com/profilephoto/72930000000Ccne/F' }),
      })
    )
    .optional(),
});

const scimUsersVoSchemaMeta = scimUsersVoSchema.extend({
  id: z.string().openapi({ example: '2819c223-7f76-453a-919d-413861904646' }),
  schemas: z.array(z.literal('urn:ietf:params:scim:schemas:core:2.0:User')).nonempty(),
  meta: z.object({
    resourceType: z.literal('User'),
    location: z.string().url().openapi({
      example: 'https://example.com/scim/v2/Users/2819c223-7f76-453a-919d-413861904646',
    }),
  }),
});

export type IScimUsersVo = z.infer<typeof scimUsersVoSchema>;
export type IScimUsersMetaVo = z.infer<typeof scimUsersVoSchemaMeta>;

export const scimUsersRoute: RouteConfig = registerRoute({
  method: 'post',
  path: SCIM_USERS,
  description: 'Create a new user',
  request: {
    body: {
      content: {
        'application/scim+json': {
          schema: scimUsersVoSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successfully created resource',
      content: {
        'application/json': {
          schema: scimUsersVoSchemaMeta,
        },
      },
      headers: {
        Location: {
          description: 'URI of the created resource',
        },
      },
    },
    409: {
      description: 'Resource already exists',
      content: {
        'application/json': {
          schema: z.object({
            schemas: z.array(z.literal('urn:ietf:params:scim:api:messages:2.0:Error')).nonempty(),
            status: z.literal('409'),
            scimType: z.literal('uniqueness'),
          }),
        },
      },
    },
  },
  tags: ['scim'],
});

export const postScimUsers = async () => {
  return axios.post<IScimUsersVo>(SCIM_USERS);
};
