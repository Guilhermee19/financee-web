import { Component, inject } from '@angular/core';
import { IconDirective } from '../../../directives/icon.directive';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

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
    MatTabsModule
  ],
  templateUrl: './detail-finance.component.html'
})
export class DetailFinanceComponent {
  private dialogRef = inject(MatDialogRef);
  private fb = inject(FormBuilder);

  public form = this.fb.nonNullable.group({
    description: ['', Validators.required],
    value: ['', Validators.required],
    category: [''],
    account: [''],
    date: ['', Validators.required],
    installments: [''],
    recurrence: [''],
    type: ['Entrada'],
  });

  public tabs = ['First', 'Second', 'Third'];
  public selected = new FormControl(0);

  setValue(event: number): void {
    this.selected.setValue(event)
  }

  chance(chance: true | false): void {
    this.dialogRef.close(chance);
  }

}
