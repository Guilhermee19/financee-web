import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IFilter } from '../models/utils';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDashbaord } from '../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpService) {}

  getDashboard(params: IFilter): Observable<IDashbaord> {
    let query = new HttpParams();
    if (params.year && params.month) {
      const startDate = new Date(params.year, params.month - 1, 1); // mês começa em 0, por isso `month - 1`
      const endDate = new Date(params.year, params.month, 0); // passando 0 como dia retorna o último dia do mês anterior

      query = query.set('start_date', startDate.toISOString().split('T')[0]);
      query = query.set('end_date', endDate.toISOString().split('T')[0]);
    }

    return this.http.get<IDashbaord>('core/get-dashboard-new/', query);
  }
}
