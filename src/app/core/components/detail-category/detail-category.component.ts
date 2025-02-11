import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { CategoryService } from '../../../shared/services/category.service';
import { BodyJson } from '../../../shared/services/http.service';
import { IAccount } from '../../models/accounts';
import { ICategory } from '../../models/category';
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
    MatSelectModule,
    MatTabsModule,
    MatSlideToggleModule,
  ],
  templateUrl: './detail-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailCategoryComponent implements OnInit {
 private dialogRef = inject(MatDialogRef);
  public data?: { category: ICategory } = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  public categories: WritableSignal<ICategory[]> = signal([]);
  public accounts: WritableSignal<IAccount[]> = signal([]);

  public loading = signal(false);

  public form = this.fb.group({
    id: [-1],
    name: ['', Validators.required],
    icon: [''],
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

    if(!this.data?.category?.id) return;

    this.form.patchValue({
      id: this.data.category.id,
      name: this.data.category.name,
      icon: this.data.category.icon,
      is_active: this.data.category.is_active,
    })
  }

  objectToArray<T>(obj: Record<string, T>): T[] {
    return Object.values(obj);
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
    };

    console.log(body);

    if(this.data?.category?.id){
      this.categoryService.patchCategory(this.data.category.id, body as BodyJson).subscribe({
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
      this.categoryService.postCategory(body as BodyJson).subscribe({
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
