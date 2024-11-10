import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { IUser } from '../models/user';

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

  get token() {
    return this.cookieService.get('token');
  }

  /**
   * Função para setar o token no cookie
   * @param token Token que vem da API
   * @param keep Se true, o cookie expira em 60 dias, se false, o cookie expira quando o browser é fechado
   * @returns void
   */
  setToken(token: string, keep = false): void {
    this.cookieService.set(
      'token',
      token,
      keep ? 60 : undefined, // Número de dias (60 dias ou sessão)
      '/',                   // Caminho do cookie
      undefined,             // Domínio (pode ser `undefined` em `localhost`)
      true,                  // Envia o cookie apenas por HTTPS
      'Strict'               // Modo de SameSite para maior segurança
    );

    this.router.navigate(['/']);
  }

  logout() {
    this.setToken('', false);
    this.router.navigate(['/login']);
  }
}
