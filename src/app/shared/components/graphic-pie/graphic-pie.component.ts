import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApexChart, ApexDataLabels, ApexLegend, ApexPlotOptions, ApexStroke, NgApexchartsModule } from 'ng-apexcharts';
import { IDashbaord } from '../../../core/models/dashboard';
import { IconDirective } from '../../directives/icon.directive';

@Component({
  selector: 'app-graphic-pie',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    IconDirective
  ],
  templateUrl: './graphic-pie.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphicPieComponent implements OnChanges{
  @Input() public dashboard: IDashbaord = {} as IDashbaord;

  public array: {label: string, icon: keyof IconDirective['icon'], color: string, value: number, percentage: number }[] = [
    // { label: "Ganhos", icon: 'arrow_trend_up', color: 'text-primary', value: 0, percentage: 0 },
    // { label: "Gastos", icon: 'arrow_trend_down', color: 'text-Red', value: 0, percentage: 0 },
    // { label: "Saldo", icon: 'piggy_bank', color: 'text-black dark:text-white', value: 0, percentage: 0 }
  ]

  public donut_chart = {
    series: [44, 55, 13] as number[],
    labels: ['Ganhos', 'Gastos', 'Saldo'] as string[],
    chart: {
      type: 'donut',
    } as ApexChart,
    dataLabels: {
      enabled: false // Remove os valores do gráfico
    } as ApexDataLabels,
    stroke: {
      width: 0
    } as ApexStroke,
    legend: {
      show: false,
      markers: {
        width: 12,
        height: 12
      }
    } as ApexLegend,
    plotOptions: {
      pie: {
        donut: {
          size: "83%" // Diminui a espessura do donut (padrão é 65%)
        }
      }
    } as ApexPlotOptions,
    colors: ['#55b02e', '#e93030', '#ffffff'],
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['dashboard']?.currentValue) {
      const { total_income, total_expenditure } = this.dashboard;

      // Criar array com os valores
      this.array = [
        { label: "Ganhos", icon: 'arrow_trend_up', color: 'text-primary', value: total_income, percentage:0 },
        { label: "Gastos", icon: 'arrow_trend_down', color: 'text-Red', value: total_expenditure, percentage: 0 }
      ];

      // Calcular o total de valores
      const total = total_income + total_expenditure;

      // Evita divisão por zero e calcula a porcentagem corretamente
      this.array = this.array.map(item => ({
        ...item,
        percentage: total > 0 ? Number(((item.value / total) * 100).toFixed(2)) : 0
      }));

      // Atualiza o gráfico com os valores calculados
      this.donut_chart = {
        ...this.donut_chart,
        series:  [this.array[0].percentage, this.array[1].percentage] ,
        labels: this.array.map(item => item.label)
      };
    }
  }

}
