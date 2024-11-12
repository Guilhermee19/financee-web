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

  login(body: BodyJson) {
    return this.http.post<IToken>('core/auth/', body);
  }

  getMe(): Observable<IUser> {
    return this.http.get<IUser>('core/get-user/');
  }
}
