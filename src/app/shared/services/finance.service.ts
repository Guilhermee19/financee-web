import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITransaction } from '../../core/models/finance';
import { IFilter } from '../../core/models/utils';
import { BodyJson, HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  constructor(private http: HttpService) {}

  getAllFinance(params: IFilter): Observable<ITransaction[]> {
    let query = new HttpParams()
    if (params.year && params.month) {
      const startDate = new Date(params.year, params.month - 1, 1); // mês começa em 0, por isso `month - 1`
      const endDate = new Date(params.year, params.month, 0); // passando 0 como dia retorna o último dia do mês anterior

      query = query.set('start_date', startDate.toISOString().split('T')[0]);
      query = query.set('end_date', endDate.toISOString().split('T')[0]);
    }

    if(params?.order_by) query = query.set('order_by', params.order_by);
    if(params?.order_direction) query = query.set('order_direction', params.order_direction);


    return this.http.get<ITransaction[]>('core/transactions/', query);
  }

  postFinance(body: BodyJson): Observable<ITransaction> {
    return this.http.post<ITransaction>(`core/transactions/`, body);
  }

  patchFinance(id: number, body: BodyJson): Observable<ITransaction> {
    return this.http.patch<ITransaction>(`core/transactions/${id}/`, body);
  }

  paymentTransaction(body: BodyJson): Observable<ITransaction> {
    return this.http.patch<ITransaction>(`core/transactions/`, body);
  }

  deleteFinance(id: number, all = false): Observable<ITransaction> {
    return this.http.delete<ITransaction>(`core/transactions/${id}/?all_transaction=${all}`);
  }
}
