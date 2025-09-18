import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal, WritableSignal } from '@angular/core';
import { IconDirective } from '../../../../shared/directives/icon.directive';
import { HiddenValuePipe } from '../../../../shared/pipes/hidden-value-pipe.pipe';
import { LoadingCardsComponent } from '../../../../shared/components/loading-cards/loading-cards.component';

@Component({
  selector: 'app-card-monthly-balance',
  standalone: true,
  imports: [
    CommonModule,
    HiddenValuePipe,
    IconDirective,
    LoadingCardsComponent
  ],
  templateUrl: './card-monthly-balance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardMonthlyBalanceComponent {
  @Input() public dashboard!: { total_income: number; total_expenditure: number; balance: number };
  @Input() public loading: WritableSignal<boolean> = signal(true);
}
