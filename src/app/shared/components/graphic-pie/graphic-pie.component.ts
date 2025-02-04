import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApexChart, ApexDataLabels, ApexPlotOptions, ApexStroke, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-graphic-pie',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule
  ],
  templateUrl: './graphic-pie.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphicPieComponent {
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
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      labels: {
        colors: "#333"
      },
      markers: {
        width: 12,
        height: 12
      }
    } as ApexLegend,
    plotOptions: {
      pie: {
        donut: {
          size: "50%" // Diminui a espessura do donut (padrão é 65%)
        }
      }
    } as ApexPlotOptions,
    colors: ['#55b02e', '#e93030', '#ffffff'],
  }
}
