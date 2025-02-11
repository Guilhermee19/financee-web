import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { DetailFinanceComponent } from '../../core/components/detail-finance/detail-finance.component';
import { CONFIG_MODAL_TRANSACTION, MONTHS } from '../../core/constants/utils';
import { ITransaction } from '../../core/models/finance';
import { ConfirmModalComponent } from '../../shared/components/modals/confirm-modal/confirm-modal.component';
import { IconDirective } from '../../shared/directives/icon.directive';
import { ConvertStatusPipe } from '../../shared/pipes/convert-status.pipe';
import { SafePipe } from '../../shared/pipes/safe.pipe';
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
    IconDirective,
    FormsModule,
    ReactiveFormsModule,
    SafePipe
  ],
  templateUrl: './finance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceComponent implements OnInit{

  private financeService = inject(FinanceService)
  private fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);

  public loading = signal(false);
  private months = MONTHS;

  private current_month = new Date().getMonth();
  private current_year = new Date().getFullYear();

  public displayedColumns: string[] = ['description', 'type', 'account',  'category', 'value_installment', 'is_paid', 'expiry_date', 'options'];
  public dataSource: WritableSignal<ITransaction[]> = signal<ITransaction[]>([]);

  public form = this.fb.nonNullable.group({
    date: [`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`],
  });

  public ngOnInit() {
    this.getAllFinances();

    this.form.controls.date.valueChanges
      .pipe(startWith(''), debounceTime(100), distinctUntilChanged())
      .subscribe(() => {
        console.log(this.form.value)
        this.getAllFinances();
      });
  }

  private getAllFinances() {
    this.loading.set(true);

    const params = {
      year: Number(this.form.value.date?.split('-')[0] || new Date().getFullYear()),
      month: Number(this.form.value.date?.split('-')[1] || new Date().getMonth() +1),
    };

    this.financeService.getAllFinance(params).subscribe({
      next: (data) => {
        this.dataSource.set(data);
        this.loading.set(false);
      },
    });
  }

  public detailFinance(finance?: ITransaction){
    const dialogRef = this.dialog.open(DetailFinanceComponent,{
      ...CONFIG_MODAL_TRANSACTION,
      data: {finance}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllFinances();
      }
    });
  }

  public openDelete(finance: ITransaction){
      const dialogRef = this.dialog.open(ConfirmModalComponent,{
        panelClass: 'custom-dialog',
        data: {
          title: 'Deletar Transação?',
          message: `Deseja deletar a transação "${finance?.description ?? ''}" ?`,
          confirmText: 'Sim',
          cancelText: 'Não',
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deleteFinance(finance);
        }
      });
    }

    public deleteFinance(finance: ITransaction){
      this.financeService.deleteFinance(finance.id).subscribe({
        next: () => {
          this.getAllFinances();
        },
      });
    }
}
