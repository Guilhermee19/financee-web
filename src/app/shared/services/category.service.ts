import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from '../../core/models/category';
import { IPagedReq } from '../../core/models/utils';
import { BodyJson, HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http =inject(HttpService)

  getAllCategories(page = 1): Observable<IPagedReq<ICategory>> {
    const query = new HttpParams().set('page', page);
    return this.http.get<IPagedReq<ICategory>>('core/all-categories/', query);
  }

  postCategory(body: BodyJson): Observable<ICategory> {
    return this.http.post<ICategory>(`core/create-category/`, body);
  }

  patchCategory(id: number, body: BodyJson): Observable<ICategory> {
    return this.http.patch<ICategory>(`core/edit-category/${id}/`, body);
  }

  deleteCategory(id: number): Observable<ICategory> {
    return this.http.delete<ICategory>(`core/delete-category/${id}/`);
  }
}
