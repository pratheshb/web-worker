const querableFuctions = {
    getDifference(a, b) {
        reply('printStuff', a-b);
    },
    wait() {
        setTimeout(() => {
            reply('doAlert', 3, 'seconds')
        }, 3000)
    }
}

function reply(method, ...args) {
    postMessage({
        method,
        args
    })
}

onmessage = e => {
    if(e.data instanceof Object && Object.hasOwn(e.data, 'method')) {
        querableFuctions[e.data.method].apply(self, e.data.args);
    } else {
        const res = e.data[0] * e.data[1];
        if(isNaN(res)) {
            postMessage('Please enter valid number');
        } else {
            postMessage(`Result: ${res}`);
        }
    }
}