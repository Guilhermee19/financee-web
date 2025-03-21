import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmModalData } from '../../../../core/models/utils';
import { IconDirective } from '../../../directives/icon.directive';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    IconDirective
  ],
  templateUrl: './confirm-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmModalComponent {
  private dialogRef = inject(MatDialogRef);
  public data: ConfirmModalData = inject(MAT_DIALOG_DATA);

  public chance(chance: boolean): void {
    this.dialogRef.close(chance);
  }
}
