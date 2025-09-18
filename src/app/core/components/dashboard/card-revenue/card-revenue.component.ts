import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal, WritableSignal } from '@angular/core';
import { LoadingCardsComponent } from '../../../../shared/components/loading-cards/loading-cards.component';
import { IconDirective } from '../../../../shared/directives/icon.directive';
import { HiddenValuePipe } from '../../../../shared/pipes/hidden-value-pipe.pipe';

@Component({
  selector: 'app-card-revenue',
  standalone: true,
  imports: [
    CommonModule,
    HiddenValuePipe,
    IconDirective,
    LoadingCardsComponent
  ],
  templateUrl: './card-revenue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardRevenueComponent {
  @Input() public dashboard!: { total_income: number; total_expenditure: number; balance: number };
  @Input() public loading: WritableSignal<boolean> = signal(true);
}
