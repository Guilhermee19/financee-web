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

  getAllCategories(page = 1, status: string = 'all', name: string = ''): Observable<IPagedReq<ICategory>> {
    const query = new HttpParams()
      .set('page', page.toString())        // Paginação
      .set('status', status)               // Filtro de status: 'active', 'inactive', 'all'
      .set('name', name);                  // Filtro de nome (caso haja)

    return this.http.get<IPagedReq<ICategory>>('core/categories/', query);
  }


  postCategory(body: BodyJson): Observable<ICategory> {
    return this.http.post<ICategory>(`core/categories/`, body);
  }

  patchCategory(id: number, body: BodyJson): Observable<ICategory> {
    return this.http.patch<ICategory>(`core/categories/${id}/`, body);
  }

  deleteCategory(id: number): Observable<ICategory> {
    return this.http.delete<ICategory>(`core/categories/${id}/`);
  }
}
