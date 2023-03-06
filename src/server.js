const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses');
const jsonHandler = require('./jsonResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  const type = request.method;

  if (type === 'HEAD') {
    switch (request.url) {
      case '/headData':
        jsonHandler.getHead(request, response);
        break;
      default:
        jsonHandler.getHead(request, response);
        break;
    }
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
  // get requests
  } else {
    const urlArray = request.url.split('=');
    let queryP = '';
    switch (urlArray[0]) {
      case '/':
      case '/index':
        htmlHandler.getIndex(request, response);
        break;
      case '/style.css':
        htmlHandler.getStyle(request, response);
        break;
      // if there is a query parameter, return that specific timeline
      case '/getTimeline?timeline':
        queryP = urlArray[1] || '';
        jsonHandler.getTimeline(request, response, queryP);
        break;
      // if not, get the default timeline
      case '/getTimeline':
        jsonHandler.getTimeline(request, response, '');
        break;
      default:
        htmlHandler.notFound(request, response);
        break;
    }
  }
};

http.createServer(onRequest).listen(port, {

});
