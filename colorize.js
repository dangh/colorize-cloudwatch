/*!
 * License: MIT
 * Author: Yusuf YILDIZ
 * http://github.com/yusufff
 */

function observe(target, handler) {
  let config = {};
  for (let type in handler) config[type] = !!handler[type];

  let observer = new MutationObserver((mutations, observer) => {
    for (let mutation of mutations) {
      if (typeof handler[mutation.type] == 'function') {
        handler[mutation.type](mutation, observer);
      }
    }
  });

  observer.observe(target, config);
}

function colorize() {
  observe(document.body, {
    subtree: true,
    childList(mutation) {
      for (let node of mutation.addedNodes) {
        if (node.classList && node.classList.contains('cwdb-log-viewer-table-row-group')) {
          let logMessage = node.querySelector('.cwdb-log-viewer-table-column-message');
          if (logMessage) {
            let match = /INFO|WARN|ERROR|DEBUG/.exec(logMessage.innerText);
            if (match) node.classList.add(match[0]);
          }
        }
      }
    }
  });
}

colorize();
