const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const returnResponse = (request, response, status, type, data) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(data);
  response.end();
};

const getIndex = (request, response) => {
  returnResponse(request, response, 200, 'text/html', index);
};

const getStyle = (request, response) => {
  returnResponse(request, response, 200, 'text/css', style);
};

const notFound = (request, response) => {
  returnResponse(request, response, 404, 'text/html', index);
};

module.exports = {
  getIndex,
  getStyle,
  notFound,
};
