const events = [];

// convert a date in YYYY-MM-DD format to a float, like so:
// YYYY.MMDD
function convertDateToFloat(dateString) {
  const dS = dateString.toString();
  const dateArray = dS.split('-');
  const convertedValue = `${dateArray[0]}.${dateArray[1]}${dateArray[2]}`;
  const dateFloat = parseFloat(convertedValue);
  return dateFloat;
}

// get the earliest date an event starts
// a start will always be before the first end
function getEarliestDate() {
  let date = 9999;
  for (let i = 0; i < events.length; i += 1) {
    const eventStart = convertDateToFloat(events[i].start);
    if (date > eventStart) {
      date = eventStart;
    }
  }

  return date;
}

// get the latest date an event ends
// an end will always be after the last start
function getLatestDate() {
  let date = -9999;
  for (let i = 0; i < events.length; i += 1) {
    const eventEnd = convertDateToFloat(events[i].end);
    if (date < eventEnd) {
      date = eventEnd;
    }
  }

  return date;
}

// respond with json
const respondJSON = (request, response, status, data) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(data));
  response.end();
};

// get the timeline to display
const getTimeline = (request, response) => {
  let data = [];
  data = data.concat(events);
  const earliest = getEarliestDate();
  const latest = getLatestDate();
  // convert all the dates to floats
  for (let i = 0; i < data.length; i += 1) {
    data[i].start = convertDateToFloat(data[i].start);
    data[i].end = convertDateToFloat(data[i].end);
  }
  // append the earliest and latest dates to the end of the array
  data.push(earliest);
  data.push(latest);
  return respondJSON(request, response, 200, data);
};

// add or update an event
const addEvent = (request, response, body) => {
  // if the data isn't there, exit
  if (!body.event || !body.start || !body.end) {
    return respondJSON(request, response, 400, 'incomplete data');
  }
  // ensure start is before end
  const thisBody = body;
  if (convertDateToFloat(body.start) > convertDateToFloat(body.end)) {
    const temp = thisBody.start;
    thisBody.start = thisBody.end;
    thisBody.end = temp;
  }

  // if there is already an event of the same name, update the start and end dates, then exit
  for (let i = 0; i < events.length; i += 1) {
    if (thisBody.event === events[i].event) {
      events[i].start = thisBody.start;
      events[i].end = thisBody.end;
      return respondJSON(request, response, 204, events);
    }
  }

  // if there is no event with that name,
  // put the data into an object and add it to the events array
  const obj = {
    event: thisBody.event,
    start: thisBody.start,
    end: thisBody.end,
  };
  events.push(obj);
  console.log(events);
  return respondJSON(request, response, 201, events);
};

// delete an event
const deleteEvent = (request, response, body) => {
  // if the data isn't there, exit
  if (!body.event || !body.start || !body.end) {
    return respondJSON(request, response, 400, events);
  }

  // if there is an event with the same name, delete it
  for (let i = 0; i < events.length; i += 1) {
    if (body.event === events[i].event) {
      events.splice(i, 1);
      return respondJSON(request, response, 201, events);
    }
  }
  return respondJSON(request, response, 400, events);
};

const getHead = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

module.exports = {
  addEvent,
  deleteEvent,
  getTimeline,
  getHead,
};
