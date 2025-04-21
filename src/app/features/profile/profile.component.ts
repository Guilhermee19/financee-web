import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { TabsComponent } from "../../shared/components/tabs/tabs.component";
import { IconDirective } from '../../shared/directives/icon.directive';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, AvatarComponent, IconDirective, MatMenuModule, TabsComponent],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private storage = inject(StorageService);

  public user = this.storage.myself;

  // public view
}
