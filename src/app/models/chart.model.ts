import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  labels?: string[];
  plotOptions?: ApexPlotOptions;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  responsive?: ApexResponsive[];
};

export type DonutsOptions = {
  series?: any;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors?: any[];
  responsive: ApexResponsive[];
  labels?: any;
};

export const lineChartOptions: ChartOptions = {
  series: [
    {
      name: '',
      data: [],
    },
  ],
  chart: {
    type: 'area',
    stacked: false,
    width: '100%',
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true,
    },
    toolbar: {
      autoSelected: 'zoom',
    },
    redrawOnParentResize: true,
    parentHeightOffset: 20,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'straight',
  },
  labels: [],
  // title: {
  //   text: "",
  //   align: "left"
  // },
  // subtitle: {
  //   text: "Price Movements",
  //   align: "left"
  // },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
  },
  yaxis: {
    opposite: true,
  },
};

export const barChartOptions: ChartOptions = {
  series: [],
  chart: {
    type: 'bar',
    width: '100%',
    height: 350,
    redrawOnParentResize: true,
    parentHeightOffset: 20,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      // endingShape: "rounded"
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    type: 'category',
    categories: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
  },
  yaxis: {
    title: {
      text: '$ (thousands)',
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    enabled: false,
    onDatasetHover: {
      highlightDataSeries: false,
    },
    y: {
      formatter: undefined,
      title: {
        formatter: (seriesName: any) => seriesName + ' $',
      },
    },
    fixed: {
      enabled: true,
      position: 'topRight',
      offsetX: 0,
      offsetY: 0,
    },
  },
};

export const donutsChartOptions: DonutsOptions = {
  series: [],
  chart: {
    width: 350,
    height: 350,
    type: 'donut',
  },
  dataLabels: {
    enabled: false,
    formatter: function (val: any) {
      return val + '%';
    },
  },
  plotOptions: {
    pie: {
      expandOnClick: true,
      donut: {
        labels: {
          show: true,
          name: {
            formatter: function (val: any) {
              return 'Total';
            },
          },
          value: {
            formatter: function (val: any) {
              return val;
            },
          },
        },
      },
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          show: false,
        },
      },
    },
  ],
  legend: {
    show: true,
    position: 'bottom',
    width: 350,
  },
};
