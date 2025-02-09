import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { DetailFinanceComponent } from '../../core/components/detail-finance/detail-finance.component';
import { CONFIG_MODAL_TRANSACTION, MONTHS } from '../../core/constants/utils';
import { ICategoryPercentages, IDashbaord } from '../../core/models/dashboard';
import { GraphicPieComponent } from '../../shared/components/graphic-pie/graphic-pie.component';
import { IconDirective } from '../../shared/directives/icon.directive';
import { DashboardService } from '../../shared/services/dashboard.service';
import { FinanceService } from '../../shared/services/finance.service';
import { ITransaction } from './../../core/models/finance';
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    IconDirective,
    CurrencyPipe,
    MatDialogModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    GraphicPieComponent
  ],
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  readonly dashboardService = inject(DashboardService);
  private financeService = inject(FinanceService)
  private fb = inject(FormBuilder);

  public view_values = signal(true);

  public current_month = new Date().getMonth();
  public current_year = new Date().getFullYear();

  public dashboard: IDashbaord = {
    balance: 0,
    total_income: 0,
    total_expenditure: 0,
  } as IDashbaord;

  public category_percentages: ICategoryPercentages[] = []

  public transactions_overdue_unpaid: WritableSignal<ITransaction[]> = signal([])
  public transactions_upcoming: WritableSignal<ITransaction[]> = signal([])

  public investment = 0;
  private months = MONTHS;

  public form = this.fb.nonNullable.group({
    date: [`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`],
  });

  public ngOnInit(){
    this.view_values.set(localStorage.getItem("VIEW") === 'true')
    this.form.controls.date.valueChanges
      .pipe(startWith(''), debounceTime(100), distinctUntilChanged())
      .subscribe(() => {
        console.log(this.form.value)
        this.getDashboard()
        this.getDashboardCategory()
        this.getDashboardUpcomingAndUnpaidTransactions();
      });

    this.getDashboard()
    this.getDashboardCategory()
    this.getDashboardUpcomingAndUnpaidTransactions();
  }

  public selectDate(){
    console.log(this.form.value.date);

  }

  public modeView(){
    this.view_values.set(!this.view_values())
    localStorage.setItem("VIEW", this.view_values().toString())
  }

  public createFinance(){
    const dialogRef = this.dialog.open(DetailFinanceComponent,{
      ...CONFIG_MODAL_TRANSACTION
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getDashboard()
        this.getDashboardCategory()
        this.getDashboardUpcomingAndUnpaidTransactions();
      }
    });
  }

  private getDashboardUpcomingAndUnpaidTransactions() {
    // this.loading.set(true);

    const params = {
      year: Number(this.form.value.date?.split('-')[0] || new Date().getFullYear()),
      month: Number(this.form.value.date?.split('-')[1] || new Date().getMonth() +1),
    };

    console.log(params);

    this.dashboardService.getDashboardUpcomingAndUnpaidTransactions(params).subscribe({
      next: (data) => {
        this.transactions_overdue_unpaid.set(data.overdue_unpaid); // Atualiza o signal
        this.transactions_upcoming.set(data.upcoming); // Atualiza o signal
      }
    })
  }

  private getDashboard(){
    const params = {
      year: Number(this.form.value.date?.split('-')[0] || new Date().getFullYear()),
      month: Number(this.form.value.date?.split('-')[1] || new Date().getMonth() +1),
    };

    this.dashboardService.getDashboard(params).subscribe({
      next: (data) => {
        this.dashboard = data;
      }
    })
  }

  private getDashboardCategory(){
    const params = {
      year: Number(this.form.value.date?.split('-')[0] || new Date().getFullYear()),
      month: Number(this.form.value.date?.split('-')[1] || new Date().getMonth() +1),
    };

    this.dashboardService.getDashboardCategory(params).subscribe({
      next: (data) => {
        this.category_percentages = data;
      }
    })
  }
}
