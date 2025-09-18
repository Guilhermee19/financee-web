import { Pipe, PipeTransform, inject } from '@angular/core';
import { ValueVisibilityService } from '../services/value-visibility.service';

@Pipe({
  name: 'hiddenValue',
  standalone: true,
  pure: false
})
export class HiddenValuePipe implements PipeTransform {
  private valueVisibilityService = inject(ValueVisibilityService);

  transform(
    value: number | null | undefined,
    hiddenPattern: string = 'R$ •••••'
  ): string {
    // Se valor for null/undefined
    if (value == null) {
      return this.valueVisibilityService.isVisible() ? 'R$ 0,00' : hiddenPattern;
    }

    // Se deve mostrar o valor
    if (this.valueVisibilityService.isVisible()) {
      return this.formatCurrency(value);
    }

    // Se deve esconder o valor
    return hiddenPattern;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}
