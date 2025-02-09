import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { DetailCategoryComponent } from '../../core/components/detail-category/detail-category.component';
import { CONFIG_MODAL_TRANSACTION } from '../../core/constants/utils';
import { ICategory } from '../../core/models/category';
import { IconDirective } from '../../shared/directives/icon.directive';
import { ConvertStatusPipe } from '../../shared/pipes/convert-status.pipe';
import { CategoryService } from '../../shared/services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    CurrencyPipe,
    DatePipe,
    ConvertStatusPipe,
    MatButtonModule,
    IconDirective
  ],
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit {

  private categoryService = inject(CategoryService)
  readonly dialog = inject(MatDialog);

  public loading = signal(false);
  // private months = MONTHS;

  // private current_month = new Date().getMonth();
  // private current_year = new Date().getFullYear();

  public displayedColumns: string[] = ['description', 'type', 'category', 'value_installment', 'expiry_date', 'options'];
  public dataSource: WritableSignal<ICategory[]> = signal<ICategory[]>([]);

  public ngOnInit() {
    this.getAllCategories();
  }

  private getAllCategories(page = 1) {
    this.loading.set(true);

    // const params = {
    //   year: this.current_year,
    //   month: this.months[this.current_month].month,
    //   return_all: true
    // };

    this.categoryService.getAllCategories(page).subscribe({
      next: (data) => {
        this.dataSource.set(data.results);
        this.loading.set(false);
      },
    });
  }

  public createFinance(){
    const dialogRef = this.dialog.open(DetailCategoryComponent,{
      ...CONFIG_MODAL_TRANSACTION
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllCategories();
      }
    });
  }
}
