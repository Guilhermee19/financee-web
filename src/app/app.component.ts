import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { NotificationService } from './shared/services/notification.service';
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
  private notificationService = inject(NotificationService);

  public ngOnInit(){
    this.theme.loadCurrentTheme();

    // Inicializar notificações PWA
    this.initializeNotifications();

    console.log(!environment.production ? '--- is development ---' : '--- is production ---');
  }

  private async initializeNotifications(): Promise<void> {
    // Verificar se estamos no ambiente do navegador
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      console.log('Notificações não disponíveis no ambiente SSR');
      return;
    }

    try {
      // Solicitar permissão para notificações
      const hasPermission = await this.notificationService.requestPermission();

      if (hasPermission) {
        console.log('✅ Notificações PWA habilitadas');

        // Escutar mensagens do Service Worker
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
              console.log('Clique em notificação recebido:', event.data);

              // Aqui você pode adicionar lógica adicional para navegação
              // ou atualização de estado baseado no clique da notificação
            }
          });
        }
      } else {
        console.log('❌ Permissão para notificações negada');
      }
    } catch (error) {
      console.error('Erro ao inicializar notificações:', error);
    }
  }
}
