import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
    MatTableModule,
    MatSortModule,
    CurrencyPipe,
    DatePipe,
    ConvertStatusPipe,
    MatButtonModule,
    IconDirective
  ],
  templateUrl: './finance.component.html',
})
export class FinanceComponent implements OnInit, AfterViewInit{
  @ViewChild(MatSort) public sort!: MatSort;

  private financeService = inject(FinanceService)
  private _liveAnnouncer = inject(LiveAnnouncer)
  readonly dialog = inject(MatDialog);

  private loading = signal(false);
  private months = MONTHS;

  private current_month = new Date().getMonth();
  private current_year = new Date().getFullYear();

  public displayedColumns: string[] = ['description', 'type', 'category', 'expiry_date', 'value_installment'];
  public dataSource = new MatTableDataSource(<ITransaction[]>[]);

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

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
        this.dataSource.data = data;
        this.loading.set(false);
      },
    });
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
}
