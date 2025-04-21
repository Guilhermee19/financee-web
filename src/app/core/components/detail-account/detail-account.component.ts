import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskDirective } from 'ngx-mask';
import { IconDirective } from '../../../shared/directives/icon.directive';
import { AccountService } from '../../../shared/services/account.service';
import { BodyJson } from '../../../shared/services/http.service';
import { IAccount } from '../../models/accounts';

@Component({
  selector: 'app-detail-account',
  standalone: true,
  imports: [
    CommonModule,
    IconDirective,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTabsModule,
    MatSlideToggleModule,
    NgxMaskDirective,
  ],
  templateUrl: './detail-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailAccountComponent implements OnInit {
 private dialogRef = inject(MatDialogRef);
  public data?: { account: IAccount } = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);

  public categories: WritableSignal<IAccount[]> = signal([]);
  public accounts: WritableSignal<IAccount[]> = signal([]);

  public loading = signal(false);

  public form = this.fb.group({
    id: [-1],
    name: ['', Validators.required],
    balance: [''],
    is_active: [true],
  });

  public selected = new FormControl(0);
  public recurrence = new FormControl(0);

  public icons: WritableSignal<Array<keyof IconDirective['icon']>> = signal([
    'arrow_trend_down',
    'arrow_trend_up',
    'arrow_up_arrow_down',
    'file_lines',
    'piggy_bank',
    'wallet',
  ]);


  public ngOnInit(): void {
    this.form.reset();

    this.form.patchValue({
      is_active: true,
    })

    if(!this.data?.account?.id) return;

    this.form.patchValue({
      id: this.data.account.id,
      name: this.data.account.name,
      balance: this.data.account.balance,
      is_active: this.data.account.is_active,
    })
  }

  objectToArray<T>(obj: Record<string, T>): T[] {
    return Object.values(obj);
  }

  public handleFormSubmit(){
    if (this.loading()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);

    const body = {
      ...this.form.value,
    };

    if(this.data?.account?.id){
      this.accountService.patchAccount(this.data.account.id, body as BodyJson).subscribe({
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
      this.accountService.postAccount(body as BodyJson).subscribe({
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
  public chance(chance: boolean): void {
    this.dialogRef.close(chance);
  }
}
