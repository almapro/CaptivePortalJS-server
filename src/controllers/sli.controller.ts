import {inject} from '@loopback/core';
import { get, getModelSchemaRef, HttpErrors, post, requestBody } from '@loopback/rest';
import { LOGIN_SECRET } from '..';
import { model, property } from '@loopback/repository';
import { securityId } from '@loopback/security';
import { TokenServiceBindings } from '@loopback/authentication-jwt';
import { JwtService } from '../services';
import { authenticate } from '@loopback/authentication';

@model()
export class Login {
  @property({
    type: 'string'
  })
  accessCode: string;
}

export class SliController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JwtService,
    @inject(LOGIN_SECRET)
    public loginSecret: string,
  ) {}

  @post('/auth/login', {
    responses: {
      '200': {
        description: 'JWT token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody({
      description: 'Login access code',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Login)
        }
      }
    }) login: Login,
  ): Promise<{ token: string }> {
      if (login.accessCode !== this.loginSecret) {
        throw new HttpErrors.Unauthorized('Invalid access code');
      }
      const token = await this.jwtService.generateToken({ [securityId]: '1' });
      return { token };
    }

  @authenticate('jwt')
  @get('/auth/me', {
    responses: {
      '200': {
        description: 'Verify token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                verified: {
                  type: 'boolean'
                }
              }
            }
          }
        }
      }
    }
  })
  async me(): Promise<{ verified: boolean }> {
    return { verified: true };
  }
}
