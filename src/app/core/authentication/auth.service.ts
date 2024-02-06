import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserManager, UserManagerSettings, User } from 'oidc-client';

import { BaseService } from '../../shared/base.service';
import { ConfigService } from '../../shared/config.service';

import { StorageService } from 'src/app/providers/storage.service';
import { ConsoleService } from 'src/app/providers/console.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private claimsUrl: string = this.getClaimsUrl;
  private manager = new UserManager(getClientSettings(this.configService, this.claimsUrl));
  private user: User | null = null;

  constructor(
    public configService: ConfigService,
    public storageService: StorageService,
    public router: Router,
    public consoleService: ConsoleService,
  ) {
    super();

    this.manager.getUser().then(user => {
      this.user = user;
      this._authNavStatusSource.next(this.isAuthenticated());
    });

    this.manager.events.addAccessTokenExpired(() => {
      this._authNavStatusSource.next(this.isAuthenticated());
      this.router.navigate(['']);
    });

    // this.manager.events.addAccessTokenExpiring(() => {
    //   this.manager.signinSilent({
    //     scope: 'openid profile email api.read role',
    //     response_type: 'id_token token'
    //   })
    //     .then((user: User) => {
    //       // this.user = user; // This function just set the current user
    //     })
    //     .catch((error: Error) => {
    //       this.manager.getUser()
    //         .then((user: User) => {
    //           // this.handleUser(user); // This function just set the current user
    //           // this.user = user;
    //         });
    //     });
    // });
  }

  // async completeSilentLogin() {
  //   const some = await this.manager.signinSilentCallback();
  // }


  get getClaimsUrl(): string {
    const companyId  = this.storageService.getCompanyId;
    return `${this.configService.resourceApiServiceURI}/accountclaim?companyId=${companyId}`;
  }

  login(args?: any) {
    this.claimsUrl = this.getClaimsUrl;
    this.manager = new UserManager(getClientSettings(this.configService, this.claimsUrl));

    return this.manager.signinRedirect(args);
  }

  async completeAuthentication() {
    this.user = await this.manager.signinRedirectCallback();
    this.consoleService.consoleMessage(this.user.access_token);
    this._authNavStatusSource.next(this.isAuthenticated());
  }

  signout() {
    this.manager.signoutRedirect();
  }

  async completeSignOut() {
    await this.manager.signoutRedirectCallback();
    this.manager.clearStaleState();
    this._authNavStatusSource.next(this.isAuthenticated());
  }

  isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  get authorizationHeaderValue(): string {
    return `${this.user!.token_type} ${this.user!.access_token}`;
  }

  get name(): string {
    return this.user!.profile.name ?? '';
  }

  get firstName(): string {
    return this.user!.profile.given_name ?? '';
  }

  get lastName(): string {
    return this.user!.profile.family_name ?? '';
  }

  get userId(): string {
    return this.user!.profile.sub ?? '';
  }

  get userClaims(): any {
    if (!this.user) {
      return null;
    }

    let result : any = {};
    const claims = this.user.profile[this.configService.clientId];

    if (typeof (claims) === 'string') {
      result[claims] = true;
    } else if (claims && claims.length > 0) {
      claims.forEach((element: string | number) => {
        result[element] = true;
      });
    }

    return result;
  }

  get state(): any {
    return this.user!.state;
  }
}

export function getClientSettings(configService: ConfigService, claimsUrl: string): UserManagerSettings {

  const config: UserManagerSettings = {
    authority: configService.authApiAuthority,
    client_id: `${configService.clientId}`,
    redirect_uri: `${configService.appAuthority}/auth-callback`,
    post_logout_redirect_uri: `${configService.appAuthority}/`,
    response_type: 'id_token token',
    scope: `openid profile email api.read role`,
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: `${configService.appAuthority}/auth-silent-refresh-callback`,
    extraQueryParams: {
      'resource': `${claimsUrl}`
    },
    includeIdTokenInSilentRenew: true
    // metadata: {
    //   issuer: `${configService.authApiAuthority}/`,
    //   authorization_endpoint: `${configService.authApiAuthority}/connect/authorize/callback`,
    //   userinfo_endpoint: `${configService.authApiAuthority}/connect/userinfo`,
    //   end_session_endpoint:
    //     // `${configService.authApiAuthority}/logout?returnTo=http%3A%2F%2Flocalhost%3A4200%2Fsignout-callback.html`
    //     `${configService.authApiAuthority}/logout?returnTo=${encodeURI(configService.appAuthority)}`,
    //   jwks_uri: `${configService.authApiAuthority}/account/SigningKeys`
    // },
    // signingKeys: [
    //   {
    //     kty: 'RSA',
    //     use: 'sig',
    //     kid: '',
    //     x5t: '',
    //     n: '',
    //     e: 'AQAB',
    //     x5c: [''],
    //     issuer: 'https://login.microsoftonline.com/TENANT_ID/v2.0'
    //   }
    // ]
  };

  return config;
}
