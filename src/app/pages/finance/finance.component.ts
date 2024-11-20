import { Component, inject, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { FinanceService } from '../../services/finance.service';
import { MONTHS } from '../../constants/utils';
import { ITransaction } from '../../models/finance';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ConvertStatusPipe } from '../../pipes/convert-status.pipe';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [MatTableModule, MatSortModule, CurrencyPipe, DatePipe, ConvertStatusPipe],
  templateUrl: './finance.component.html',
})
export class FinanceComponent implements OnInit, AfterViewInit{
  @ViewChild(MatSort) public sort!: MatSort;

  private financeService = inject(FinanceService)
  private _liveAnnouncer = inject(LiveAnnouncer)

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
}
