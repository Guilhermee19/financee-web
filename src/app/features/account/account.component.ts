import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {

}
