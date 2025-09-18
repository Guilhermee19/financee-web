import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-cards',
  standalone: true,
  imports: [],
  templateUrl: './loading-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingCardsComponent {
  @Input() public count: number = 1;
  @Input() public type: 'CARD' | 'PRICE' | 'LIST' = 'LIST';
}
