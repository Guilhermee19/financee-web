// Custom Service Worker para notificações
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.', event);

  let notificationData = {};

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = {
        title: 'Financee',
        body: event.data.text() || 'Você tem uma nova notificação!',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png'
      };
    }
  } else {
    notificationData = {
      title: 'Financee',
      body: 'Você tem transações vencendo hoje!',
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/icon-72x72.png'
    };
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon || '/assets/icons/icon-192x192.png',
    badge: notificationData.badge || '/assets/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: notificationData.data || {
      dateOfArrival: Date.now(),
      primaryKey: Math.random()
    },
    requireInteraction: notificationData.requireInteraction || false,
    tag: notificationData.tag || 'financee-notification',
    actions: notificationData.actions || [
      {
        action: 'view',
        title: 'Ver Detalhes',
        icon: '/assets/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/assets/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title || 'Financee', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.', event);

  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data;

  if (action === 'close') {
    // Apenas fecha a notificação
    return;
  }

  // Para todas as outras ações (incluindo clique na notificação)
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      // Se já existe uma janela aberta, foca nela
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          // Navega para a página apropriada baseada no tipo de notificação
          let targetUrl = '/';

          if (notificationData && notificationData.type) {
            switch (notificationData.type) {
              case 'due-transactions':
                targetUrl = '/finance';
                break;
              case 'transaction-added':
                targetUrl = '/finance';
                break;
              case 'goal-reached':
                targetUrl = '/overview';
                break;
              default:
                targetUrl = '/';
            }
          } else if (action === 'view' || action === 'view-transactions') {
            targetUrl = '/finance';
          }

          // Envia mensagem para o cliente com a URL de navegação
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            action: action,
            data: notificationData,
            navigateTo: targetUrl
          });

          return client.focus();
        }
      }

      // Se não há janela aberta, abre uma nova
      let targetUrl = self.registration.scope;

      if (notificationData && notificationData.type) {
        switch (notificationData.type) {
          case 'due-transactions':
            targetUrl += 'finance';
            break;
          case 'transaction-added':
            targetUrl += 'finance';
            break;
          case 'goal-reached':
            targetUrl += 'overview';
            break;
        }
      } else if (action === 'view' || action === 'view-transactions') {
        targetUrl += 'finance';
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('notificationclose', function(event) {
  console.log('[Service Worker] Notification closed.', event);

  // Opcional: enviar analytics ou limpar dados relacionados
  const notificationData = event.notification.data;

  if (notificationData && notificationData.type) {
    // Pode enviar informações sobre notificações fechadas sem interação
    console.log('Notification closed without interaction:', notificationData.type);
  }
});

// Escuta mensagens do app principal
self.addEventListener('message', function(event) {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;

    self.registration.showNotification(title, {
      ...options,
      icon: options.icon || '/assets/icons/icon-192x192.png',
      badge: options.badge || '/assets/icons/icon-72x72.png'
    });
  }
});

// Cache de notificações para controle de duplicatas
const notificationCache = new Map();

// Função para verificar e evitar notificações duplicadas
function shouldShowNotification(tag, data) {
  const cacheKey = `${tag}-${JSON.stringify(data)}`;
  const lastShown = notificationCache.get(cacheKey);
  const now = Date.now();

  // Evita mostrar a mesma notificação em menos de 5 minutos
  if (lastShown && (now - lastShown) < 5 * 60 * 1000) {
    return false;
  }

  notificationCache.set(cacheKey, now);

  // Limpa cache antigo (mantém apenas últimas 50 entradas)
  if (notificationCache.size > 50) {
    const oldestKey = notificationCache.keys().next().value;
    notificationCache.delete(oldestKey);
  }

  return true;
}

// Exporta funções para uso no app principal se necessário
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    shouldShowNotification
  };
}
