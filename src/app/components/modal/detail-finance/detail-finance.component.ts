import { Component, inject } from '@angular/core';
import { IconDirective } from '../../../directives/icon.directive';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-finance',
  standalone: true,
  imports: [CommonModule, IconDirective, MatButtonModule],
  templateUrl: './detail-finance.component.html'
})
export class DetailFinanceComponent {
  private dialogRef = inject(MatDialogRef);

  chance(chance: true | false): void {
      this.dialogRef.close(chance);
  }

}
