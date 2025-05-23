/* eslint-disable camelcase */
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IToken, IUser } from '../../core/models/user';
import { BodyJson, HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject (HttpService)

  login(body: BodyJson) {
    return this.http.post<IToken>('core/auth/login/', body);
  }

  getMe(): Observable<IUser> {
    return this.http.get<IUser>('core/users/me/');
  }
}
