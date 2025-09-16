import { Injectable, NgZone } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITransaction } from '../../core/models/finance';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

// Interface customizada para suportar todas as propriedades de notificação
interface CustomNotificationOptions extends NotificationOptions {
  actions?: NotificationAction[];
  vibrate?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private isSupported = false;
  private permission: NotificationPermission = 'default';
  private notificationSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private swPush: SwPush,
    private ngZone: NgZone
  ) {
    this.checkSupport();
    this.initializeNotifications();
  }

  /**
   * Verifica se o navegador suporta notificações
   */
  private checkSupport(): void {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    if (this.isSupported) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Inicializa o sistema de notificações
   */
  private initializeNotifications(): void {
    if (!this.isSupported) return;

    // Escuta cliques em notificações
    if (this.swPush.isEnabled) {
      this.swPush.notificationClicks.subscribe(event => {
        this.handleNotificationClick(event);
      });
    }
  }

  /**
   * Solicita permissão para enviar notificações
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notificações não são suportadas neste navegador');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão para notificações:', error);
      return false;
    }
  }

  /**
   * Verifica se as notificações estão habilitadas
   */
  isEnabled(): boolean {
    return this.isSupported && this.permission === 'granted';
  }

  /**
   * Envia uma notificação local
   */
  async showNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isEnabled()) {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) return;
    }

    try {
      if (this.swPush.isEnabled) {
        // Usa Service Worker para notificações PWA
        await this.showServiceWorkerNotification(payload);
      } else {
        // Fallback para notificações do navegador
        this.showBrowserNotification(payload);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  /**
   * Envia notificação via Service Worker
   */
  private async showServiceWorkerNotification(payload: NotificationPayload): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;

      const options: CustomNotificationOptions = {
        body: payload.body,
        icon: payload.icon || '/assets/icons/icon-192x192.png',
        badge: payload.badge || '/assets/icons/icon-72x72.png',
        data: payload.data,
        tag: payload.tag || 'financee-notification',
        requireInteraction: payload.requireInteraction || false,
        silent: payload.silent || false,
        actions: payload.actions || [],
        vibrate: [200, 100, 200]
      };

      await registration.showNotification(payload.title, options);
    }
  }

  /**
   * Envia notificação via API do navegador (fallback)
   */
  private showBrowserNotification(payload: NotificationPayload): void {
    const notification = new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/assets/icons/icon-192x192.png',
      badge: payload.badge || '/assets/icons/icon-72x72.png',
      data: payload.data,
      tag: payload.tag || 'financee-notification',
      requireInteraction: payload.requireInteraction || false,
      silent: payload.silent || false
    });

    notification.onclick = (event) => {
      this.ngZone.run(() => {
        this.handleNotificationClick({
          action: 'default',
          notification: event.target as Notification
        });
      });
    };

    // Auto close após 5 segundos se não requer interação
    if (!payload.requireInteraction) {
      setTimeout(() => notification.close(), 5000);
    }
  }

  /**
   * Manipula cliques em notificações
   */
  private handleNotificationClick(event: any): void {
    event.notification.close();

    // Focar na janela do aplicativo
    this.focusWindow();

    // Emitir evento de clique para componentes interessados
    this.notificationSubject.next(event.action || 'default');

    // Navegar baseado na ação
    if (event.action === 'view-transactions' || event.action === 'default') {
      this.navigateToTransactions();
    }
  }

  /**
   * Foca na janela do aplicativo
   */
  private focusWindow(): void {
    if ('clients' in self) {
      // No contexto do Service Worker
      (self as any).clients.openWindow('/finance');
    } else {
      // No contexto principal
      window.focus();
    }
  }

  /**
   * Navega para a página de transações
   */
  private navigateToTransactions(): void {
    // Implementar navegação usando Router se necessário
    window.location.href = '/finance';
  }

  /**
   * Verifica transações que vencem hoje e envia notificações
   */
  async checkDueTransactions(transactions: ITransaction[]): Promise<void> {
    if (!transactions?.length || !this.isEnabled()) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueToday = transactions.filter(transaction => {
      if (!transaction.expiry_date) return false;

      const dueDate = new Date(transaction.expiry_date);
      dueDate.setHours(0, 0, 0, 0);

      return dueDate.getTime() === today.getTime() && !transaction.is_paid;
    });

    if (dueToday.length === 0) return;

    const totalAmount = dueToday.reduce((sum, t) => sum + (t.value_installment || 0), 0);

    const payload: NotificationPayload = {
      title: 'Financee - Transações Vencendo Hoje',
      body: dueToday.length === 1
        ? `${dueToday[0].description} - R$ ${dueToday[0].value_installment?.toFixed(2)}`
        : `${dueToday.length} transações vencem hoje - Total: R$ ${totalAmount.toFixed(2)}`,
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/icon-72x72.png',
      tag: 'due-transactions',
      requireInteraction: true,
      data: { transactions: dueToday, type: 'due-transactions' },
      actions: [
        {
          action: 'view-transactions',
          title: 'Ver Transações',
          icon: '/assets/icons/icon-72x72.png'
        },
        {
          action: 'dismiss',
          title: 'Dispensar',
          icon: '/assets/icons/icon-72x72.png'
        }
      ]
    };

    await this.showNotification(payload);
  }

  /**
   * Agenda verificação diária de transações
   */
  scheduleDailyCheck(transactions: ITransaction[]): void {
    // Verificar imediatamente
    this.checkDueTransactions(transactions);

    // Calcular tempo até próxima verificação (9h da manhã)
    const now = new Date();
    const nextCheck = new Date();
    nextCheck.setHours(9, 0, 0, 0);

    if (nextCheck <= now) {
      nextCheck.setDate(nextCheck.getDate() + 1);
    }

    const timeUntilCheck = nextCheck.getTime() - now.getTime();

    setTimeout(() => {
      this.checkDueTransactions(transactions);

      // Configurar verificação diária
      setInterval(() => {
        this.checkDueTransactions(transactions);
      }, 24 * 60 * 60 * 1000); // 24 horas
    }, timeUntilCheck);
  }

  /**
   * Observable para escutar cliques em notificações
   */
  getNotificationClicks(): Observable<string | null> {
    return this.notificationSubject.asObservable();
  }

  /**
   * Envia notificação de transação adicionada
   */
  async notifyTransactionAdded(transaction: ITransaction): Promise<void> {
    const payload: NotificationPayload = {
      title: 'Nova Transação Adicionada',
      body: `${transaction.description} - R$ ${transaction.value_installment?.toFixed(2)}`,
      tag: 'transaction-added',
      data: { transaction, type: 'transaction-added' }
    };

    await this.showNotification(payload);
  }

  /**
   * Envia notificação de meta atingida
   */
  async notifyGoalReached(goalName: string, amount: number): Promise<void> {
    const payload: NotificationPayload = {
      title: 'Meta Atingida! 🎉',
      body: `Parabéns! Você atingiu a meta "${goalName}" - R$ ${amount.toFixed(2)}`,
      tag: 'goal-reached',
      requireInteraction: true,
      data: { goalName, amount, type: 'goal-reached' }
    };

    await this.showNotification(payload);
  }

  /**
   * Limpa todas as notificações
   */
  async clearAllNotifications(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const notifications = await registration.getNotifications();
      notifications.forEach(notification => notification.close());
    }
  }
}
