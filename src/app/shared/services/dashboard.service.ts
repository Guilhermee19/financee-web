import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategoryPercentages, IDashbaord, IDashbaordTransaction } from '../../core/models/dashboard';
import { IFilter } from '../../core/models/utils';
import { HttpService } from './http.service';

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

    return this.http.get<IDashbaord>('core/dashboard/resumo/', query);
  }

  getDashboardCategory(params: IFilter): Observable<ICategoryPercentages[]> {
    let query = new HttpParams();
    if (params.year && params.month) {
      const startDate = new Date(params.year, params.month - 1, 1); // mês começa em 0, por isso `month - 1`
      const endDate = new Date(params.year, params.month, 0); // passando 0 como dia retorna o último dia do mês anterior

      query = query.set('start_date', startDate.toISOString().split('T')[0]);
      query = query.set('end_date', endDate.toISOString().split('T')[0]);
    }

    return this.http.get<ICategoryPercentages[]>('core/dashboard/categorias/', query);
  }


  getDashboardUpcomingAndUnpaidTransactions(params: IFilter): Observable<IDashbaordTransaction> {
    let query = new HttpParams();
    if (params.year && params.month) {
      const startDate = new Date(params.year, params.month - 1, 1); // mês começa em 0, por isso `month - 1`
      const endDate = new Date(params.year, params.month, 0); // passando 0 como dia retorna o último dia do mês anterior

      query = query.set('start_date', startDate.toISOString().split('T')[0]);
      query = query.set('end_date', endDate.toISOString().split('T')[0]);
    }

    return this.http.get<IDashbaordTransaction>('core/dashboard/transacoes_futuras_vencidas/', query);
  }

}
