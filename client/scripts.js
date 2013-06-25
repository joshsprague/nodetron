var worker = new Worker('worker.js');
worker.postMessage(); // call worker with string or JSON - use string for compatibility.
