import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

class ScimException extends HttpException {}

@Catch(ScimException)
export class ScimExceptionFilter implements ExceptionFilter {
  catch(exception: ScimException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const scimType = exception.getResponse();

    response.status(status).json({
      schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
      status: String(status),
      scimType,
    });
  }
}

export class UniquenessException extends ScimException {
  constructor() {
    super('uniqueness', HttpStatus.CONFLICT);
  }
}
