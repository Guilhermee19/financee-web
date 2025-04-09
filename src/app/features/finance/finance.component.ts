import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { DetailFinanceComponent } from '../../core/components/detail-finance/detail-finance.component';
import { CONFIG_MODAL_CENTER, CONFIG_MODAL_TRANSACTION } from '../../core/constants/utils';
import { ITransaction, TType } from '../../core/models/finance';
import { IFilter, TOrderBy } from '../../core/models/utils';
import { ConfirmModalComponent } from '../../shared/components/modals/confirm-modal/confirm-modal.component';
import { IconDirective } from '../../shared/directives/icon.directive';
import { ConvertStatusPipe } from '../../shared/pipes/convert-status.pipe';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { FinanceService } from '../../shared/services/finance.service';
import { Toastr } from '../../shared/services/toastr.service';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    CurrencyPipe,
    DatePipe,
    ConvertStatusPipe,
    MatButtonModule,
    IconDirective,
    FormsModule,
    ReactiveFormsModule,
    SafePipe,
    MatMenuModule,
  ],
  templateUrl: './finance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceComponent implements OnInit {
  @ViewChild(MatSort) public sort!: MatSort;

  private financeService = inject(FinanceService);
  private toastr = inject(Toastr);
  private fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);

  public loading = signal(false);
  private cdRef!: ChangeDetectorRef;
  public displayedColumns: string[] = ['description', 'account', 'category', 'value_installment', 'is_paid', 'expiry_date', 'options'];
  // public dataSource: WritableSignal<ITransaction[]> = signal<ITransaction[]>([]);
  public dataSource!: MatTableDataSource<ITransaction>;

  public form = this.fb.nonNullable.group({
    date: [`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`],
  });

  // Para controlar a ordenação
  public sortColumn: TOrderBy = 'expiry_date';  // Default column to sort
  public sortDirection: 'asc' | 'desc' = 'asc'; // Default sort direction

  ngOnInit() {
    this.loading.set(true);

    this.getAllFinances();

    this.form.controls.date.valueChanges
      .pipe(startWith(''), debounceTime(100), distinctUntilChanged())
      .subscribe(() => {
        this.getAllFinances();
      });
  }

  // Lógica de obtenção de finanças com parâmetros de ordenação
  private getAllFinances() {
    // this.loading.set(true);

    const params: IFilter = {
      year: Number(this.form.value.date?.split('-')[0] || new Date().getFullYear()),
      month: Number(this.form.value.date?.split('-')[1] || new Date().getMonth() + 1),
      order_by: this.sort?.active,
      order_direction: this.sort?.start
    };

    this.financeService.getAllFinance(params).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.loading.set(false);
      },
    });
  }

  // Função para alterar a ordenação ao clicar no título da coluna
  public sortData(column: TOrderBy): void {
    if (this.sortColumn === column) {
      // Alterna entre crescente e decrescente
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc'; // Default to ascending if changing column
    }
    // Atualiza as finanças com a nova ordenação
    this.getAllFinances();
  }

  public paidTransaction(finance: ITransaction) {
    // Lógica de pagamento de transações
    // Se já estiver paga, não faz nada
    if (finance.is_paid) return;

    const isExpenditure = finance.type === 'EXPENDITURE';
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      ...CONFIG_MODAL_CENTER,
      data: {
        title: isExpenditure ? 'Pagamento Efetuado?' : 'Valor Recebido?',
        message: `Deseja marcar ${isExpenditure ? 'a conta' : 'o recebimento de'}
                  <strong class='!font-bold'>${finance.description}</strong>
                  no valor de <strong class='!font-bold'>R$ ${finance.value_installment}</strong> como concluído?`,
        confirmText: isExpenditure ? 'Confirmar Pagamento' : 'Confirmar Recebimento',
        cancelText: 'Voltar',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success(`${isExpenditure ? 'Pagamento Efetuado!' : 'Valor Recebido!'}`);
        this.paymentTransaction(finance);
      }
    });
  }

  // Função para efetuar o pagamento ou recebimento
  private paymentTransaction(finance: ITransaction) {
    this.loading.set(true);

    const params = {
      transaction_id: finance.id,
    };

    this.financeService.paymentTransaction(params).subscribe({
      next: () => {
        this.loading.set(true);

        this.getAllFinances();
      },
    });
  }

  public detailFinance(finance?: ITransaction, all = false) {
    const dialogRef = this.dialog.open(DetailFinanceComponent, {
      ...CONFIG_MODAL_TRANSACTION,
      data: { finance, edit_all: all },
      autoFocus: true // Garantir foco no modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading.set(true);

        this.getAllFinances();
      }
    });
  }

  // Excluir transação
  public openDelete(finance: ITransaction, all = false) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      ...CONFIG_MODAL_CENTER,
      data: {
        title: 'Deletar Transação?',
        message: `Deseja deletar a transação "${finance?.description ?? ''}" ?`,
        confirmText: 'Sim',
        cancelText: 'Não',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteFinance(finance, all);
      }
    });
  }

  // Função de exclusão
  public deleteFinance(finance: ITransaction, all = false) {
    this.financeService.deleteFinance(finance.id, all).subscribe({
      next: () => {
        this.loading.set(true);
        this.getAllFinances();
      },
    });
  }

  // Função para setar o status de pagamento
  public setStatus(type: TType, is_paid: boolean) {
    if (type === 'EXPENDITURE') return is_paid ? 'Pago' : 'não pago';
    else if (type === 'INCOME') return is_paid ? 'Recebido' : 'não recebido';
    else return '-';
  }
}
