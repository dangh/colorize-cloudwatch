/*!
 * License: MIT
 * Author: Yusuf YILDIZ
 * http://github.com/yusufff
 */

function poll(timeout, task, interval = 100) {
  return new Promise(resolve => {
    let result;
    let intervalTimer = setInterval(() => {
      if (result = task()) {
        resolve([null, result]);
        clearInterval(intervalTimer);
        clearTimeout(timeoutTimer)
      }
    }, interval);
    let timeoutTimer = setTimeout(() => {
      resolve([new Error('Timeout')]);
      clearInterval(intervalTimer);
    }, timeout);
  });
}

function observe(target, handler) {
  let config = {};
  for (let type in handler) config[type] = true;

  let observer = new MutationObserver((mutations, observer) => {
    for (let mutation of mutations) {
      if (typeof handler[mutation.type] == 'function') {
        handler[mutation.type](mutation, observer);
      }
    }
  });

  observer.observe(target, config);
}

async function colorize() {
  let [err, logTable] = await poll(5000, () => document.querySelector('.cwdb-log-viewer-table-body'));
  if (err) return console.error('Log table not found:', err);

  observe(logTable, {
    childList(mutation) {
      for (let logGroup of mutation.addedNodes) {
        let logMessage = logGroup.querySelector('.cwdb-log-viewer-table-column-message');
        if (logMessage) {
          let match = /INFO|WARN|ERROR|DEBUG/.exec(logMessage.innerText);
          if (match) logGroup.classList.add(match[0]);
        }
      }
    }
  });
}

colorize();
