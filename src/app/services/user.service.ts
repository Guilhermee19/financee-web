import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { BodyJson } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  createUser(body: BodyJson): Observable<IUser> {
    return this.http.post<IUser>('core/create-user/', body);
  }

  updateUser(body: BodyJson): Observable<IUser> {
    return this.http.patch<IUser>('core/update-user/', body);
  }

  getNotification(): Observable<string[]> {
    return this.http.get<string[]>('core/notifications/');
  }
}
