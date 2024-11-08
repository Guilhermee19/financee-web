import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true,
})
export class ConvertStatusPipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (value === 'WAITING') return '';
    else if (value === 'PAY_TODAY') return 'pagar hoje!';
    else if (value === 'PAID') return 'pago';
    else if (value === 'SOLD') return 'atrasado';

    else if (value === 'TRANSFER') return 'Transferência';
    else if (value === 'EXPENDITURE') return 'Saída';
    else if (value === 'INCOME') return 'Entrada';

    else if (value === 'SINGLE') return 'Única';
    else if (value === 'WEEKLY') return 'Semanal';
    else if (value === 'MONTHLY') return 'Mensal';
    else if (value === 'ANNUAL') return 'Anual';
    else return value;
  }
}
