import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { CardBalanceComponent } from '../../core/components/dashboard/card-balance/card-balance.component';
import { CardCardCreditComponent } from '../../core/components/dashboard/card-card-credit/card-card-credit.component';
import { CardExpensesComponent } from '../../core/components/dashboard/card-expenses/card-expenses.component';
import { CardMonthlyBalanceComponent } from '../../core/components/dashboard/card-monthly-balance/card-monthly-balance.component';
import { CardPorcentCategoryComponent } from '../../core/components/dashboard/card-porcent-category/card-porcent-category.component';
import { CardRevenueComponent } from '../../core/components/dashboard/card-revenue/card-revenue.component';
import { CardTransationComponent } from '../../core/components/dashboard/card-transation/card-transation.component';
import { IDashbaord } from '../../core/models/dashboard';
import { IconDirective } from '../../shared/directives/icon.directive';
import { DashboardService } from '../../shared/services/dashboard.service';
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    IconDirective,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    // CARDS
    CardBalanceComponent,
    CardTransationComponent,
    CardMonthlyBalanceComponent,
    CardRevenueComponent,
    CardExpensesComponent,
    CardCardCreditComponent,
    CardPorcentCategoryComponent
  ],
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  readonly dashboardService = inject(DashboardService);
  private fb = inject(FormBuilder);

  public current_month = new Date().getMonth();
  public current_year = new Date().getFullYear();

  public dashboard: IDashbaord = {
    balance: 0,
    total_income: 0,
    total_expenditure: 0,
  } as IDashbaord;

  public form = this.fb.nonNullable.group({
    date: [`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`],
  });

  public loading = signal(true);

  public ngOnInit(){
    this.form.controls.date.valueChanges
      .pipe(startWith(''), debounceTime(100), distinctUntilChanged())
      .subscribe(() => {
        this.getDashboard()
        // this.getDashboardCategory()
        // this.getDashboardUpcomingAndUnpaidTransactions();
      });

    this.getDashboard()
    // this.getDashboardCategory()
    // this.getDashboardUpcomingAndUnpaidTransactions();
  }

  public handleEventDash(event: boolean) {
    console.log('Event Dashboard:', event);

    this.getDashboard()
    // this.getDashboardCategory()
    // this.getDashboardUpcomingAndUnpaidTransactions();
  }

  public selectDate(){
    console.log(this.form.value.date);
  }

  private getDashboard(){
    this.loading.set(true);
    const params = {
      year: Number(this.form.value.date?.split('-')[0] || new Date().getFullYear()),
      month: Number(this.form.value.date?.split('-')[1] || new Date().getMonth() +1),
    };

    this.dashboardService.getDashboard(params).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading.set(false);
      }
    })
  }
}
