if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
  navigator.serviceWorker.addEventListener('message', e => {
    if(e.data && e.data.type === 'SW_UPDATED') window.location.reload();
  });
}
