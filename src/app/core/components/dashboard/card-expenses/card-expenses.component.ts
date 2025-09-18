import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal, WritableSignal } from '@angular/core';
import { LoadingCardsComponent } from '../../../../shared/components/loading-cards/loading-cards.component';
import { IconDirective } from '../../../../shared/directives/icon.directive';
import { HiddenValuePipe } from '../../../../shared/pipes/hidden-value-pipe.pipe';

@Component({
  selector: 'app-card-expenses',
  standalone: true,
  imports: [
    CommonModule,
    HiddenValuePipe, // ✅ Adicionar o pipe aqui
    IconDirective,
    LoadingCardsComponent
  ],
  templateUrl: './card-expenses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardExpensesComponent {
  @Input() public dashboard!: {balance: number, total_income: number, total_expenditure: number};
  @Input() public loading: WritableSignal<boolean> = signal(true);
}
