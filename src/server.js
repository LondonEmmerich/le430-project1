const http = require('http');
const htmlHandler = require('./htmlResponses');
// const jsonHandler = require("./jsonResponses");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  const type = request.method;

  if (type === 'HEAD') {
    console.log('max headroom');
  } else if (type === 'POST') {
    console.log('postage stamp');
  } else {
    switch (request.url) {
      case '/':
      case '/index':
        htmlHandler.getIndex(request, response);
        break;
      case '/style.css':
        htmlHandler.getStyle(request, response);
        break;
      default:
        htmlHandler.notFound(request, response);
        break;
    }
  }
};

http.createServer(onRequest).listen(port, {

});
