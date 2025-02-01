import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { DetailFinanceComponent } from '../../core/components/detail-finance/detail-finance.component';
import { MONTHS } from '../../core/constants/utils';
import { ITransaction } from '../../core/models/finance';
import { IconDirective } from '../../shared/directives/icon.directive';
import { ConvertStatusPipe } from '../../shared/pipes/convert-status.pipe';
import { FinanceService } from '../../shared/services/finance.service';

@Component({
  selector: 'app-finance',
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
  templateUrl: './finance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceComponent implements OnInit{

  private financeService = inject(FinanceService)
  private _liveAnnouncer = inject(LiveAnnouncer)
  readonly dialog = inject(MatDialog);

  public loading = signal(false);
  private months = MONTHS;

  private current_month = new Date().getMonth();
  private current_year = new Date().getFullYear();

  public displayedColumns: string[] = ['description', 'type', 'category', 'value_installment', 'expiry_date', 'options'];
  public dataSource: WritableSignal<ITransaction[]> = signal<ITransaction[]>([]);

  public ngOnInit() {
    this.getAllFinances();
  }

  private getAllFinances() {
    this.loading.set(true);

    const params = {
      year: this.current_year,
      month: this.months[this.current_month].month,
      return_all: true
    };

    this.financeService.getAllFinance(params).subscribe({
      next: (data) => {
        this.dataSource.set(data);
        this.loading.set(false);
      },
    });
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
      if(result){
        this.getAllFinances();
      }
    });
  }
}
