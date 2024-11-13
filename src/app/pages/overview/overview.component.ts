import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IconDirective } from '../../directives/icon.directive';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetailFinanceComponent } from '../../components/modal/detail-finance/detail-finance.component';
import { DashboardService } from '../../services/dashboard.service';
import { MONTHS } from '../../constants/utils';
import { IDashbaord } from '../../models/dashboard';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
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
  ],
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  readonly dashboardService = inject(DashboardService);
  private fb = inject(FormBuilder);

  public view_values = signal(true);

  public current_month = new Date().getMonth();
  public current_year = new Date().getFullYear();

  private months = MONTHS;

  public dashboard: IDashbaord = {
    balance: 0,
    total_income: 0,
    total_expenditure: 0,
    category_percentages: []
  } as IDashbaord;

  public balance = 2700;
  public investment = 3500;
  public revenue = 8150;
  public expenses = 2950;

  public form = this.fb.nonNullable.group({
    date: [`${new Date().getFullYear()}-${new Date().getMonth()+1}`],
  });

  public ngOnInit(){
    console.log(new Date());

    this.form.controls.date.valueChanges
      .pipe(startWith(''), debounceTime(100), distinctUntilChanged())
      .subscribe((value) => {
        this.getDashboard()
      });

    this.getDashboard()
  }

  public selectDate(){
    console.log(this.form.value.date);

  }

  public modeView(){
    this.view_values.set(!this.view_values())
  }

  public createFinance(){
    const dialogRef = this.dialog.open(DetailFinanceComponent,{
      panelClass: 'custom-dialog', // classe CSS personalizada
      disableClose: true, // Impede o fechamento automático
      position: { right: '1rem', top: '1rem' }, // posição no canto superior direito
      width: 'calc(100% - 2rem)', // ajuste o tamanho conforme necessário
      maxWidth: '350px',
      height: 'calc(100dvh - 2rem)'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
}
