import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IconDirective } from '../../directives/icon.directive';
import { CurrencyPipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetailFinanceComponent } from '../../components/modal/detail-finance/detail-finance.component';
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [MatButtonModule, IconDirective, CurrencyPipe, MatDialogModule],
  templateUrl: './overview.component.html',
})
export class OverviewComponent {
  readonly dialog = inject(MatDialog);

  public view_values = signal(true);

  public balance = 2700;
  public investment = 3500;
  public revenue = 8150;
  public expenses = 2950;

  public modeView(){
    this.view_values.set(!this.view_values())
  }

  public createFinance(){
    const dialogRef = this.dialog.open(DetailFinanceComponent,{
      panelClass: 'custom-dialog', // classe CSS personalizada
      disableClose: true, // Impede o fechamento automático
      position: { right: '1rem', top: '1rem' }, // posição no canto superior direito
      width: 'calc(100% - 2rem)', // ajuste o tamanho conforme necessário
      maxWidth: '350px',
      height: 'calc(100dvh - 2rem)'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
