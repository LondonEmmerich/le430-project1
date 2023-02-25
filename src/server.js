const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses');
const jsonHandler = require('./jsonResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  const type = request.method;

  if (type === 'HEAD') {
    console.log('max headroom');
  } else if (type === 'POST') {
    const body = [];
    let bodyString;
    let bodyParams;

    switch (request.url) {
      case '/addEvent':
        // parse the data and run the add event
        request.on('data', (chunk) => {
          body.push(chunk);
        });
        request.on('end', () => {
          bodyString = Buffer.concat(body).toString();
          bodyParams = query.parse(bodyString);
          jsonHandler.addEvent(request, response, bodyParams);
        });
        break;
      case '/deleteEvent':
        // parse the data and run the delete event
        request.on('data', (chunk) => {
          body.push(chunk);
        });
        request.on('end', () => {
          bodyString = Buffer.concat(body).toString();
          bodyParams = query.parse(bodyString);
          jsonHandler.deleteEvent(request, response, bodyParams);
        });
        break;
      default:
        break;
    }
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
