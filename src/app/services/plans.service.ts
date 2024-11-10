import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { IPlan } from '../models/plan';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  constructor(private http: HttpService) {}

  getAllPlans(): Observable<IPlan[]> {
    return this.http.get<IPlan[]>('core/all-plan/');
  }
}
