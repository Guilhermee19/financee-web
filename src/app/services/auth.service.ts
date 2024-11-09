/* eslint-disable camelcase */
import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
// import { Auth, signOut, user } from '@angular/fire/auth';
import { IToken, IUser } from '../models/user';
import { Router } from '@angular/router';
import { BodyJson, HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpService, private router: Router) {}

  // firebaseAuth = inject(Auth);
  // user$ = user(this.firebaseAuth);

  login(body: BodyJson) {
    return this.http.post<IToken>('core/auth/', body);
  }

  getMe(): Observable<IUser> {
    return this.http.get<IUser>('core/get-user/');
  }

  // loginGoogle(token: any, social_network: string): Observable<any> {
  //   const photo_profile = token.user.photoURL.replace('=s96', '=s900');
  //   const body = {
  //     social_network,
  //     profile_image: photo_profile,
  //     access_token: token.user.accessToken,
  //     token: token.user.accessToken,
  //   };

  //   return this.http.post<any>('core/social-network/', body);
  // }
}
