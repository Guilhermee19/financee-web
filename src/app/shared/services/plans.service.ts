import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlan } from '../../core/models/plan';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  constructor(private http: HttpService) {}

  getAllPlans(): Observable<IPlan[]> {
    return this.http.get<IPlan[]>('core/all-plan/');
  }
}
