import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plansCheck',
  standalone: true
})
export class PlansCheckPipe implements PipeTransform {

  transform(value: string): string {
    // Substituir "[X]" por ícone de "check" e "[]" por ícone de "X"
    if (value) {
      value = value.replace(/\[X\]/g, '✔️'); // Substitui [X] por ✔️ (check)
      value = value.replace(/\[\]/g, '❌');  // Substitui [] por ❌ (X)
    }
    return value;
  }

}
