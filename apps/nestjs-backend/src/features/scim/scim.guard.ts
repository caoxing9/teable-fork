import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Snippet from secure-compare, MIT License

function timingSafeEqual(a: string, b: string): boolean {
  // noinspection SuspiciousTypeOfGuard
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  let mismatch = a.length === b.length ? 0 : 1;
  if (mismatch) b = a;
  for (let i = 0, il = a.length; i < il; ++i) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

// End of snippet from secure-compare

@Injectable()
export class ScimGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const response = context.switchToHttp().getResponse();
    response.setHeader('WWW-Authenticate', 'Bearer realm="SCIM"');

    const scimEnabled = this.configService.get<boolean>('BACKEND_SCIM_ENABLED');
    if (!scimEnabled) return false;
    const scimBearerToken = this.configService.getOrThrow<string>('BACKEND_SCIM_BEARER_TOKEN');
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) return false;
    return timingSafeEqual(`Bearer ${scimBearerToken}`, authorization);
  }
}
