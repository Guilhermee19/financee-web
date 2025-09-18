import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoadingCardsComponent } from '../../../../shared/components/loading-cards/loading-cards.component';
import { HiddenValuePipe } from '../../../../shared/pipes/hidden-value-pipe.pipe';
import { SafePipe } from '../../../../shared/pipes/safe.pipe';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { ValueVisibilityService } from '../../../../shared/services/value-visibility.service';
import { ITransaction } from '../../../models/finance';

@Component({
  selector: 'app-card-transation',
  standalone: true,
  imports: [
    CommonModule,
    SafePipe,
    HiddenValuePipe,
    LoadingCardsComponent
  ],
  templateUrl: './card-transation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardTransationComponent {
  @Input() public form!: FormGroup;
  readonly dashboardService = inject(DashboardService);
  private valueVisibilityService = inject(ValueVisibilityService);

  public transactions_overdue_unpaid: WritableSignal<ITransaction[]> = signal([])
  public transactions_upcoming: WritableSignal<ITransaction[]> = signal([])

  public loading = signal(true);
  public isVisible = this.valueVisibilityService.isVisible;

  public ngOnInit(){
    this.getDashboardUpcomingAndUnpaidTransactions();
  }

  private getDashboardUpcomingAndUnpaidTransactions() {
    this.loading.set(true);
    const params = {
      year: Number(this.form.value.date?.split('-')[0] || new Date().getFullYear()),
      month: Number(this.form.value.date?.split('-')[1] || new Date().getMonth() +1),
    };

    this.dashboardService.getDashboardUpcomingAndUnpaidTransactions(params).subscribe({
      next: (data) => {
        this.transactions_overdue_unpaid.set(data.overdue_unpaid); // Atualiza o signal
        this.transactions_upcoming.set(data.upcoming); // Atualiza o signal
        this.loading.set(false);
      }
    })
  }
}
