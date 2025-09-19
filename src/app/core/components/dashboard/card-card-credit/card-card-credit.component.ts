import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { register } from 'swiper/element/bundle';
import { HiddenValuePipe } from '../../../../shared/pipes/hidden-value-pipe.pipe';

@Component({
  selector: 'app-card-card-credit',
  standalone: true,
  imports: [
    CommonModule,
    HiddenValuePipe,
    MatProgressBarModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './card-card-credit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardCardCreditComponent {

  constructor() {
    register();
  }

  public creditCardNumber = [
    {
      name: 'Nubank',
      brand: 'Visa',
      number: '**** **** **** 1234',
      progress: 70,
      limit: 5000,
      used: 3500,
      closingDate: '25',
    },
    {
      name: 'Banco Inter',
      brand: 'Mastercard',
      number: '**** **** **** 5678',
      progress: 50,
      limit: 3000,
      used: 1500,
      closingDate: '30',
    },
    {
      name: 'Banco Inter',
      brand: 'Mastercard',
      number: '**** **** **** 5678',
      progress: 50,
      limit: 3000,
      used: 1500,
      closingDate: '30',
    },
    {
      name: 'Banco Inter',
      brand: 'Mastercard',
      number: '**** **** **** 9012',
      progress: 30,
      limit: 4000,
      used: 1200,
      closingDate: '15',
    },
  ]
}
