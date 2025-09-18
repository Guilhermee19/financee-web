import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingCardsComponent } from '../../../../shared/components/loading-cards/loading-cards.component';
import { HiddenValuePipe } from '../../../../shared/pipes/hidden-value-pipe.pipe';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { ICategoryPercentages } from '../../../models/dashboard';

@Component({
  selector: 'app-card-porcent-category',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    HiddenValuePipe,
    LoadingCardsComponent
  ],
  templateUrl: './card-porcent-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardPorcentCategoryComponent {
  @Input() public form!: FormGroup;

  readonly dashboardService = inject(DashboardService);

  public loading = signal(true);
  public category_percentages: ICategoryPercentages[] = []

  public ngOnInit(){
    this.getDashboardCategory()
  }

  private getDashboardCategory(){
    this.loading.set(true);
    const params = {
      year: Number(this.form.value.date?.split('-')[0] || new Date().getFullYear()),
      month: Number(this.form.value.date?.split('-')[1] || new Date().getMonth() +1),
    };

    this.dashboardService.getDashboardCategory(params).subscribe({
      next: (data) => {
        this.category_percentages = data;
        this.loading.set(false);
      }
    })
  }
}
