import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import moment from 'moment';
import { NgxMaskDirective } from 'ngx-mask';
import { IconDirective } from '../../../shared/directives/icon.directive';
import { AccountService } from '../../../shared/services/account.service';
import { CategoryService } from '../../../shared/services/category.service';
import { FinanceService } from '../../../shared/services/finance.service';
import { BodyJson } from '../../../shared/services/http.service';
import { IAccount } from '../../models/accounts';
import { ICategory } from '../../models/category';
import { ITransaction } from '../../models/finance';

@Component({
  selector: 'app-detail-finance',
  standalone: true,
  imports: [
    CommonModule,
    IconDirective,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    MatSelectModule,
    MatTabsModule,
    MatSlideToggleModule
  ],
  templateUrl: './detail-finance.component.html'
})
export class DetailFinanceComponent implements OnInit {
  private dialogRef = inject(MatDialogRef);
  public data: { finance: ITransaction, edit_all: boolean } = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private financeService = inject(FinanceService);
  private categoryService = inject(CategoryService);
  private accountService = inject(AccountService);

  public categories: WritableSignal<ICategory[]> = signal([]);
  public accounts: WritableSignal<IAccount[]> = signal([]);

  public loading = signal(false);

  public form = this.fb.group({
    description: ['', Validators.required],
    value: [0, Validators.required],
    value_installment: [0, Validators.required],
    category: [0],
    account: [0],
    expiry_date: ['', Validators.required],
    installments: [0],
    recurrence: [''],
    edit_all: [false],
    type: [''],
  });

  public selected = new FormControl(0);
  public recurrence = new FormControl(0);

  public ngOnInit(): void {
    console.log(this.data)

    if(!this.data.finance?.id){
      const { value_installment } = this.form.controls;
      value_installment.clearValidators();
      value_installment.updateValueAndValidity();
    }

    this.getAllCategories();

    this.form.reset();

    this.form.patchValue({
      expiry_date: moment(new Date().toISOString()).format('yyyy-MM-DD'),
      recurrence: 'SINGLE',
      edit_all: this.data?.edit_all || false,
      type: 'INCOME',
    })

    if(!this.data?.finance) return;

    this.form.patchValue({
      description: this.data.finance.description,
      value: this.data.finance.value,
      value_installment: this.data.finance.value_installment,
      category: this.data.finance.category,
      account: this.data.finance.account,
      installments: this.data.finance.installments,
      type: this.data.finance.type,

      expiry_date: moment(this.data.finance.expiry_date).startOf('day').format('YYYY-MM-DD'),
      recurrence: this.data.finance.recurrence,
      edit_all: this.data?.edit_all || false,
    })

    const tab = this.data.finance.type === 'INCOME'? 0 : 1;
    const recurrence = this.data.finance.recurrence === 'SINGLE' ? 0 : (this.data.finance.recurrence === 'INSTALLMENTS' ? 2 : 1);

    this.setSelected(tab)
    this.setRecurrence(recurrence)
  }

  getAllCategories() {
    this.categoryService.getAllCategories(1, 'active').subscribe({
      next: (data) => {
        this.categories.set(data.results)
        this.getAllAccounts();
      },
      error: () => {
        this.getAllAccounts();
      },
    });
  }

  getAllAccounts() {
    this.accountService.getAllAccounts(1).subscribe({
      next: (data) => {
        this.accounts.set(data.results);
      },
    });
  }

  public setSelected(event: number): void {
    this.selected.setValue(event)
    this.form.patchValue({
      type: event === 0 ? 'INCOME' : 'EXPENDITURE'
    })
  }

  public setRecurrence(event: number): void {
    this.recurrence.setValue(event)
    if(event !== 1){
      this.form.patchValue({
        recurrence: event === 0 ? 'SINGLE' :
        (event === 2 ? 'INSTALLMENTS' : '')
      })
    }
  }

  public handleFormSubmit(){
    if (this.loading()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);

    const installments = this.form.get('installments')?.value || 1;

    const body = {
      ...this.form.value,
      type: this.selected.value === 0 ? 'INCOME' : 'EXPENDITURE',
      recurrence: this.recurrence.value === 0 ? 'SINGLE' : (this.recurrence.value === 2 ? 'INSTALLMENTS' : this.form.value.recurrence),
      installments: this.setInstallmentsToRecurrence(installments, this.form.value.recurrence || this.form.value.type),
    };

    if(!body['account']) delete body.account;
    if(!body['category']) delete body.category;
    // if(!body['edit_all']) delete body.edit_all;

    if(this.data?.finance?.id){
      this.financeService.patchFinance(this.data.finance.id, body as BodyJson).subscribe({
        next: () => {
          this.chance(true);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
    }
    else{
      this.financeService.postFinance(body as BodyJson).subscribe({
        next: () => {
          this.chance(true);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
    }

  }


  private  setInstallmentsToRecurrence(installments: number, option: string | undefined | null): number {
    if (!option) return installments;

    const today = new Date();
    const yearEnd = new Date(today.getFullYear(), 11, 31); // Último dia do ano

    if (['único', 'SINGLE'].includes(option)) {
      return 1;
    } else if (['semanal', 'WEEKLY'].includes(option)) {
      // Calcula a diferença em dias até o final do ano e converte para semanas
      const diffInDays = Math.ceil((yearEnd.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      const weeks = Math.ceil(diffInDays / 7); // Garante que dezembro seja incluído
      return weeks;
    } else if (['mensal', 'MONTHLY'].includes(option)) {
      // Diferença em meses até o final do ano
      const remainingMonths = (yearEnd.getFullYear() - today.getFullYear()) * 12 + (yearEnd.getMonth() - today.getMonth()) + 1;
      return remainingMonths;
    } else if (['anual', 'ANNUAL'].includes(option)) {
      return 10;
    } else if (['parcelada', 'INSTALLMENTS'].includes(option)) {
      return installments;
    } else {
      return 1;
    }
  }

  public chance(chance: boolean): void {
    this.dialogRef.close(chance);
  }

}
