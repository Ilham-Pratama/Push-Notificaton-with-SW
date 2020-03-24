/* eslint-env browser, serviceworker, es6 */

// 'use strict';

function isClientFocused() {
  return clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then(windowClients => {
      let clientIsFocused = false;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.focused) {
          clientIsFocused = true;
          break;
        }
      }

      return clientIsFocused;
    });
}

self.addEventListener('push', function(event) {
  const getResponse = isClientFocused().then(clientIsFocused => {
    if (clientIsFocused) {
      console.log("Don't need to show a notification.");
      return;
    }
    const randNum = Math.ceil(Math.random() * 10);
    return fetch(`https://jsonplaceholder.typicode.com/posts/${randNum}`)
      .then(res => res.json())
      .then(res => {
        const title = res.title;
        const options = {
          body: 'Google for Developer',
          icon: 'images/g.jpg',
          badge: 'images/badge.png',
          tag: 'menu',
          actions: [
            { action: 'fundamentals', title: 'Fundamentals' }, // icon: 'images/yes.png' },
            { action: 'tools', title: 'Tools' } // icon: 'images/no.png' }
          ]
        };
        return self.registration.showNotification(title, options);
      });
  });
  // const promiseChain = Promise.all([onlineData, getResponse]);
  event.waitUntil(getResponse);
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (!event.action) {
    event.waitUntil(clients.openWindow('https://developers.google.com/web'));
  }
  switch (event.action) {
    case 'fundamentals':
      event.waitUntil(
        clients.openWindow('https://developers.google.com/web/fundamentals')
      );
    case 'tools':
      event.waitUntil(
        clients.openWindow('https://developers.google.com/web/tools')
      );
    default:
      event.waitUntil(clients.openWindow('https://developers.google.com/web/'));
  }
});
