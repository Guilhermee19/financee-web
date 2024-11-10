import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IconDirective } from '../../directives/icon.directive';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [MatButtonModule, IconDirective, CurrencyPipe],
  templateUrl: './overview.component.html',
})
export class OverviewComponent {
  public view_values = signal(true);

  public balance = 2700;
  public investment = 3500;
  public revenue = 8150;
  public expenses = 2950;

  public modeView(){
    this.view_values.set(!this.view_values())
  }
}
