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

    return this.http.get<ITransaction[]>('core/all-transaction/', query);
  }

  postFinance(body: BodyJson): Observable<ITransaction> {
    return this.http.post<ITransaction>(`core/create-transaction/`, body);
  }

  patchFinance(id: number, body: BodyJson): Observable<ITransaction> {
    return this.http.patch<ITransaction>(`core/edit-transaction/${id}/`, body);
  }

  paymentTransaction(body: BodyJson): Observable<ITransaction> {
    return this.http.patch<ITransaction>(`core/pay-transaction/`, body);
  }

  uploadTransactionReceipt(body: BodyJson): Observable<ITransaction> {
    return this.http.patch<ITransaction>(`core/upload-transaction-image/`, body);
  }

  deleteFinance(id: number): Observable<ITransaction> {
    return this.http.delete<ITransaction>(`core/delete-transaction/${id}/`);
  }
}
