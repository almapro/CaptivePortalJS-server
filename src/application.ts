import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingKey} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import { v4 } from 'uuid';
import { AuthenticationComponent } from '@loopback/authentication';
import { JWTAuthenticationComponent, TokenServiceBindings } from '@loopback/authentication-jwt';
import { JwtService } from './services';

export {ApplicationConfig};

export const LOGIN_SECRET = BindingKey.create<string>('login.secret');

export class CaptivePortalServerApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    const loginSecret = process.env.LOGIN_SECRET ?? v4();
    this.bind(LOGIN_SECRET).to(loginSecret);
    console.log(`Login secret: ${loginSecret}`);
    this.migrateSchema({
      existingSchema: 'alter',
    });
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JwtService);
  }
}
