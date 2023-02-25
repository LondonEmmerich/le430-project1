const events = [];

function convertDateToFloat(dateString) {
  const dateArray = dateString.split('-');
  const convertedValue = `${dateArray[0]}.${dateArray[1]}${dateArray[2]}`;
  const dateFloat = parseFloat(convertedValue);
  return dateFloat;
}

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

const getTimeline = (request, response) => {
  console.log('Timeline');
  console.log(getEarliestDate());
  console.log(getLatestDate());
};

// add or update an event
const addEvent = (request, response, body) => {
  // if the data isn't there, exit
  if (!body.event || !body.start || !body.end) {
    console.log('error');
  } else {
    // ensure start is before end
    const thisBody = body;
    if (convertDateToFloat(body.start) > convertDateToFloat(body.end)) {
      const temp = thisBody.start;
      thisBody.start = thisBody.end;
      thisBody.end = temp;
    }
    let updated = false;
    // if there is already an event of the same name, update the start and end dates, then exit
    for (let i = 0; i < events.length; i += 1) {
      if (thisBody.event === events[i].event) {
        events[i].start = thisBody.start;
        events[i].end = thisBody.end;
        updated = true;
      }
    }

    // if there is no event with that name,
    // put the data into an object and add it to the events array
    if (updated === false) {
      const obj = {
        event: thisBody.event,
        start: thisBody.start,
        end: thisBody.end,
      };
      events.push(obj);
    }
  }

  console.log(events);
  getTimeline(request, response);
};

// delete an event
const deleteEvent = (request, response, body) => {
  // if the data isn't there, exit
  if (!body.event || !body.start || !body.end) {
    return;
  }

  // if there is an event with the same name, delete it
  for (let i = 0; i < events.length; i += 1) {
    if (body.event === events[i].event) {
      events.splice(i, 1);
      return;
    }
  }
};

module.exports = {
  addEvent,
  deleteEvent,
  getTimeline,
};
