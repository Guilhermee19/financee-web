import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { IUser } from '../../core/models/user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private cookieService = inject(CookieService);
  private router = inject(Router);

  UserSubject = new Subject<void>();
  myUser: IUser = {} as IUser;

  get myself() {
    return this.myUser;
  }

  set myself(user: IUser) {
    this.myUser = user;
  }

  watchUser() {
    return this.UserSubject.asObservable();
  }

  unwatchUser() {
    this.UserSubject.unsubscribe();
  }

  changeUser(): void {
    this.UserSubject.next();
  }

  public get token() {
    if (this.cookies) {
      return this.cookieService.get('token');
    } else {
      return sessionStorage.getItem('token');
    }
  }

  public get cookies() {
    return localStorage.getItem('cookies') === 'true';
  }

  public set cookies(value: boolean) {
    localStorage.setItem('cookies', value.toString());
  }

  /**
   * Função para setar o token no cookie
   * @param token Token que vem da API
   * @param keep Se true, o cookie expira em 60 dias, se false, o cookie expira quando o browser é fechado
   * @returns void
   */
  setToken(token: string, keep = false): void {
    if (this.cookies) {
      this.cookieService.set(
        'token',
        token,
        keep ? 60 : undefined,
        '/',
        undefined,
        true,
        'Strict'
      );
    } else {
      sessionStorage.setItem('token', token);
    }

    this.router.navigate(['/overview']);
  }

  logout() {
    this.setToken('', false);
    this.router.navigate(['/login']);
  }
}
