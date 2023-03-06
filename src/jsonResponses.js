const events = [];

function monthMath(year, value) {
  if (year % 4 === 0) {
    return value;
  }

  return value - 1;
}

// convert a date in YYYY-MM-DD format to an int
// in days from year 0
function convertDateToInt(dateString) {
  const dS = dateString.toString();
  const dateArray = dS.split('-');
  const year = parseInt(dateArray[0], 10);
  let dateValue = 0;
  // days
  dateValue += parseInt(dateArray[2], 10);
  // month
  // the value of all the days prior to month
  // we are already the counting the days of the month we are in
  switch (parseInt(dateArray[1], 10)) {
    // january has no previous months
    case 1:
      break;
    case 2:
      dateValue += 31;
      break;
    case 3:
      dateValue += monthMath(year, 60);
      break;
    case 4:
      dateValue += monthMath(year, 91);
      break;
    case 5:
      dateValue += monthMath(year, 121);
      break;
    case 6:
      dateValue += monthMath(year, 152);
      break;
    case 7:
      dateValue += monthMath(year, 182);
      break;
    case 8:
      dateValue += monthMath(year, 213);
      break;
    case 9:
      dateValue += monthMath(year, 244);
      break;
    case 10:
      dateValue += monthMath(year, 274);
      break;
    case 11:
      dateValue += monthMath(year, 305);
      break;
    case 12:
      dateValue += monthMath(year, 335);
      break;
    default:
      break;
  }
  // year
  // count every year but this one
  // this year is already accounted for in month and day
  dateValue += (year - 1) * 365;
  // add one for each leap year
  dateValue += Math.trunc((year - 1) / 4);
  return dateValue;
}

// get the earliest date an event starts
// a start will always be before the first end
function getEarliestDate(data) {
  let date = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < data.length; i += 1) {
    const eventStart = data[i].start;
    if (date > eventStart) {
      date = eventStart;
    }
  }

  return date;
}

// get the latest date an event ends
// an end will always be after the last start
function getLatestDate(data) {
  let date = -9999;
  for (let i = 0; i < data.length; i += 1) {
    const eventEnd = data[i].end;
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
const getTimeline = (request, response, timeline) => {
  const data = [];
  // get all the events in the designated timeline
  for (let i = 0; i < events.length; i += 1) {
    if (events[i].timeline === timeline) {
      data.push(events[i]);
    }
  }

  // convert all the dates to ints
  for (let i = 0; i < data.length; i += 1) {
    if (!Number.isInteger(data[i].start)) {
      data[i].start = convertDateToInt(data[i].start);
    }
    if (!Number.isInteger(data[i].end)) {
      data[i].end = convertDateToInt(data[i].end);
    }
  }
  // get the earliest and latest dates
  const earliest = getEarliestDate(data);
  const latest = getLatestDate(data);
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
  if (convertDateToInt(body.start) > convertDateToInt(body.end)) {
    const temp = thisBody.start;
    thisBody.start = thisBody.end;
    thisBody.end = temp;
  }

  // if there is already an event of the same name in the same timeline,
  // update the start and end dates, then exit
  for (let i = 0; i < events.length; i += 1) {
    if (thisBody.event === events[i].event && thisBody.timeline === events[i].timeline) {
      events[i].start = thisBody.start;
      events[i].end = thisBody.end;
      return respondJSON(request, response, 201, 'event date changed successfully');
    }
  }

  // if there is no event with that name,
  // put the data into an object and add it to the events array
  const obj = {
    timeline: thisBody.timeline,
    event: thisBody.event,
    start: thisBody.start,
    end: thisBody.end,
  };
  events.push(obj);
  return respondJSON(request, response, 201, 'event added successfully');
};

// delete an event
const deleteEvent = (request, response, body) => {
  // if the data isn't there, exit
  if (!body.event) {
    return respondJSON(request, response, 400, 'event does not exist');
  }

  // if there is an event with the same name, delete it
  for (let i = 0; i < events.length; i += 1) {
    if (body.event === events[i].event) {
      events.splice(i, 1);
      return respondJSON(request, response, 201, 'event deleted');
    }
  }
  return respondJSON(request, response, 400, 'event deleted');
};

const getHead = (request, response) => {
  response.writeHead(204, { 'Content-Type': 'application/json' });
  response.end();
};

module.exports = {
  addEvent,
  deleteEvent,
  getTimeline,
  getHead,
};
