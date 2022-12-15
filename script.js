const num1 = document.querySelector('#num1');
const num2 = document.querySelector('#num2');
const result = document.querySelector('.result');

function queryableWorker(url, defaultListener) {
    const worker = new Worker(url);
    const listeners = {};

    this.postMessage = message => worker.postMessage(message);

    this.addEventListener = (name, listener) => listeners[name] = listener;

    this.removeEventListener = name => delete listeners[name];

    this.sendQuery = (method, ...args) => {
        this.postMessage({ method, args });
    }

    worker.onmessage = e => {
        if (e.data instanceof Object && Object.hasOwn(e.data, 'method')) {
            listeners[e.data.method].apply(this, e.data.args);
        } else {
            defaultListener(e.data);
        }
    }
}

function defaultListener(res) {
    result.textContent = res;
}

const tasks = new queryableWorker('worker.js', defaultListener);

tasks.addEventListener('printStuff', function (result) {
    document
        .getElementById('firstLink')
        .parentNode.appendChild(
            document.createTextNode(`The diff is ${result}`)
        )
});

tasks.addEventListener('doAlert', function (time, unit) {
    alert(`worker waited for ${time} ${unit} :-)`);
});

function postMessageToWorker() {
    tasks.postMessage([num1.value, num2.value]);
}

num1.addEventListener('change', postMessageToWorker);
num2.addEventListener('change', postMessageToWorker);

