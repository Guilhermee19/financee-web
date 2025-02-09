import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import moment from 'moment';
import { NgxMaskDirective } from 'ngx-mask';
import { AccountService } from '../../../shared/services/account.service';
import { CategoryService } from '../../../shared/services/category.service';
import { FinanceService } from '../../../shared/services/finance.service';
import { BodyJson } from '../../../shared/services/http.service';
import { ICONS } from '../../constants/icons';
import { IAccount } from '../../models/accounts';
import { ICategory } from '../../models/category';
import { ITransaction } from '../../models/finance';
import { IconDirective } from './../../../shared/directives/icon.directive';

@Component({
  selector: 'app-detail-category',
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
  templateUrl: './detail-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailCategoryComponent implements OnInit {
 private dialogRef = inject(MatDialogRef);
  public data?: { transaction: ITransaction } = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private financeService = inject(FinanceService);
  private categoryService = inject(CategoryService);
  private accountService = inject(AccountService);

  public categories: WritableSignal<ICategory[]> = signal([]);
  public accounts: WritableSignal<IAccount[]> = signal([]);

  public loading = signal(false);

  public form = this.fb.group({
    description: ['', Validators.required],
    value: ['', Validators.required],
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

  public icons = this.objectToArray(ICONS);

  public ngOnInit(): void {
    console.log(this.icons);

    this.getAlltags();

    this.form.reset();

    this.form.patchValue({
      expiry_date: moment(new Date().toISOString()).format('yyyy-MM-DD'),
      recurrence: 'SINGLE',
      edit_all: false,
      type: 'INCOME',
    })
    console.log(this.form.value);

    if(!this.data?.transaction) return;
  }

  objectToArray<T>(obj: Record<string, T>): T[] {
    return Object.values(obj);
  }

  getAlltags() {
    this.categoryService.getAllCategories().subscribe({
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

  public handleFormSubmit(){
    console.log(this.form.value);

    if (this.loading()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);

    const body = {
      ...this.form.value,
      type: this.selected.value === 0 ? 'INCOME' : 'EXPENDITURE',
      recurrence: this.recurrence.value === 0 ? 'SINGLE' : (this.recurrence.value === 2 ? 'INSTALLMENTS' : this.form.value.recurrence),
    };

    console.log(body);

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
  public chance(chance: boolean): void {
    this.dialogRef.close(chance);
  }
}
