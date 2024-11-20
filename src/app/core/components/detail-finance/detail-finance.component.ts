import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskDirective } from 'ngx-mask';
import { IconDirective } from '../../../shared/directives/icon.directive';

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
    edit_all: [false],
    type: ['Entrada'],
  });

  public selected = new FormControl(0);
  public recurrence = new FormControl(0);

  setSelected(event: number): void {
    this.selected.setValue(event)
  }

  setRecurrence(event: number): void {
    this.recurrence.setValue(event)
  }

  chance(chance: true | false): void {
    this.dialogRef.close(chance);
  }

}
