import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-loading',
  standalone: true,
  imports: [],
  templateUrl: './page-loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageLoadingComponent {

}
