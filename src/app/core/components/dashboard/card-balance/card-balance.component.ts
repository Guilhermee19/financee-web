import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LoadingCardsComponent } from '../../../../shared/components/loading-cards/loading-cards.component';
import { IconDirective } from '../../../../shared/directives/icon.directive';
import { HiddenValuePipe } from '../../../../shared/pipes/hidden-value-pipe.pipe';
import { ValueVisibilityService } from '../../../../shared/services/value-visibility.service';
import { CONFIG_MODAL_TRANSACTION } from '../../../constants/utils';
import { DetailFinanceComponent } from '../../detail-finance/detail-finance.component';

@Component({
  selector: 'app-card-balance',
  standalone: true,
  imports: [
    CommonModule,
    IconDirective,
    MatButtonModule,
    HiddenValuePipe,
    LoadingCardsComponent
  ],
  templateUrl: './card-balance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardBalanceComponent {
  @Input() public dashboard!: {balance: number, total_income: number, total_expenditure: number};
  @Input() public loading: WritableSignal<boolean> = signal(true);
  @Output() private eventDash: EventEmitter<boolean> = new EventEmitter();

  readonly dialog = inject(MatDialog);
  private valueVisibilityService = inject(ValueVisibilityService);

  // Expor o signal para o template
  public isVisible = this.valueVisibilityService.isVisible;

  public modeView(){
    this.valueVisibilityService.toggleVisibility();
  }

  public createFinance(){
    const dialogRef = this.dialog.open(DetailFinanceComponent,{
      ...CONFIG_MODAL_TRANSACTION,
      data: {
        edit_all: true,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.eventDash.emit(true);
      }
    });
  }
}
