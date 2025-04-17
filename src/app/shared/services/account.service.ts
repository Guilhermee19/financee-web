import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccount } from '../../core/models/accounts';
import { IPagedReq } from '../../core/models/utils';
import { BodyJson, HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http =inject(HttpService)

  getAllAccounts(page = 1): Observable<IPagedReq<IAccount>> {
    const query = new HttpParams().set('page', page);
    return this.http.get<IPagedReq<IAccount>>('core/all-accounts/', query);
  }

  postAccount(body: BodyJson): Observable<IAccount> {
    return this.http.post<IAccount>(`core/create-account/`, body);
  }

  patchAccount(id: number, body: BodyJson): Observable<IAccount> {
    return this.http.patch<IAccount>(`core/edit-account/${id}/`, body);
  }

  deleteAccount(id: number): Observable<IAccount> {
    return this.http.delete<IAccount>(`core/delete-account/${id}/`);
  }
}
