import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BodyJson, HttpService } from './http.service';
import { StorageService } from './storage.service';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpService) {}

  getMe(): Observable<IUser> {
    return this.http.get<IUser>('core/get-user/');
  }

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
