import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { DetailAccountComponent } from '../../core/components/detail-account/detail-account.component';
import { CONFIG_MODAL_TRANSACTION } from '../../core/constants/utils';
import { IAccount } from '../../core/models/accounts';
import { ConfirmModalComponent } from '../../shared/components/modals/confirm-modal/confirm-modal.component';
import { IconDirective } from '../../shared/directives/icon.directive';
import { AccountService } from '../../shared/services/account.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    DatePipe,
    MatButtonModule,
    IconDirective,
  ],
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit {

  private accountService = inject(AccountService)
  readonly dialog = inject(MatDialog);

  public loading = signal(false);

  public displayedColumns: string[] = ['name', 'is_active', 'created_at', 'options'];
  public dataSource: WritableSignal<IAccount[]> = signal<IAccount[]>([]);

  public ngOnInit() {
    this.getAllCategories();
  }

  private getAllCategories(page = 1) {
    this.loading.set(true);

    this.accountService.getAllAccounts(page).subscribe({
      next: (data) => {
        this.dataSource.set(data.results);
        this.loading.set(false);
      },
    });
  }

  public detailAccount(account?: IAccount){
    const dialogRef = this.dialog.open(DetailAccountComponent,{
      ...CONFIG_MODAL_TRANSACTION,
      data: {
        account
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllCategories();
      }
    });
  }

  public openDelete(account: IAccount){
    const dialogRef = this.dialog.open(ConfirmModalComponent,{
      panelClass: 'custom-dialog',
      data: {
        title: 'Deletar Conta?',
        message: `Deseja deletar a conta "${account?.name ?? ''}" ?`,
        confirmText: 'Sim',
        cancelText: 'Não',
        account
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteAccount(account);
      }
    });
  }

  public deleteAccount(account: IAccount){
    this.accountService.deleteAccount(account.id).subscribe({
      next: () => {
        this.getAllCategories();
      },
    });
  }
}
