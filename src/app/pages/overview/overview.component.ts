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
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatButtonModule, IconDirective, CurrencyPipe, MatDialogModule, MatProgressBarModule],
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  readonly dashboardService = inject(DashboardService);

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

  public ngOnInit(){
    this.getDashboard()
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
      year: this.current_year,
      month: this.months[this.current_month].month,
    };

    this.dashboardService.getDashboard(params).subscribe({
      next: (data) => {
        this.dashboard = data;
      }
    })
  }
}
