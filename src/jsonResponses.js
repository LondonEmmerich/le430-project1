let events = [];

//add or update an event
const addEvent = (request, response, body) => {
  //if the data isn't there, exit
  if(!body.event || !body.start || !body.end){
    return;
  }

  //if there is already an event of the same name, update the start and end dates, then exit
  for(let i = 0; i < events.length; i++){
    if(body.event === events[i].event){
      events[i].start = body.start;
      events[i].end = body.end;
      return;
    }
  }

  //if there is no event with that name, put the data into an object and add it to the events array
  let obj = {
    "event":body.event,
    "start":body.start,
    "end":body.end
  };
  events.push(obj);
  console.log(events);
}

//delete an event
const deleteEvent = (request, response, body) => {
  //if the data isn't there, exit
  if(!body.event || !body.start || !body.end){
    return;
  }
  
  //if there is an event with the same name, delete it
  for(let i = 0; i < events.length; i++){
    if(body.event === events[i].event){
      events.splice(i, 1);
      return;
    }
  }
}

module.exports = {
  addEvent,
  deleteEvent,
};
