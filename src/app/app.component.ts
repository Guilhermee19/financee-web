import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  title = 'financee-web';
  private theme = inject(ThemeService);

  public ngOnInit(){
    this.theme.loadCurrentTheme();
    console.log(!environment.production ? '--- is development ---' : '--- is production ---');
  }
}
