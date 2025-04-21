import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlan } from '../../core/models/plan';
import { IPagedReq } from '../../core/models/utils';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  constructor(private http: HttpService) {}

  getAllPlans(): Observable<IPagedReq<IPlan>> {
    return this.http.get<IPagedReq<IPlan>>('core/plans/');
  }
}
