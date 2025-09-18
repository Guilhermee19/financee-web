import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from '../../core/models/category';
import { IPagedReq } from '../../core/models/utils';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  private http =inject(HttpService)

  getCreditCard(page = 1, status: string = 'all', name: string = ''): Observable<IPagedReq<ICategory>> {
    const query = new HttpParams()
      .set('page', page.toString())        // Paginação
      .set('status', status)               // Filtro de status: 'active', 'inactive', 'all'
      .set('name', name);                  // Filtro de nome (caso haja)

    return this.http.get<IPagedReq<ICategory>>('core/categories/', query);
  }
}
