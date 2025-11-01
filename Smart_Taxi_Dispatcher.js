const prompt = require("prompt-sync")();

let Taxis = [
  { id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 0 },
  { id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 },
  { id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 },
];

let Requests = [
  { reqId: 1, position: 10, duration: 10, time: 0 },
  { reqId: 2, position: 3, duration: 12, time: 2 },
  { reqId: 3, position: 18, duration: 15, time: 4 },
  { reqId: 4, position: 7, duration: 15, time: 5 },
];
let Queue = [];
let nextRequestId = 5;

function min_distance(request_position) {
  let min_dist = Infinity;
  let Taxiproche = null;

  for (let i = 0; i < Taxis.length; i++) {
    if (Taxis[i].available) {
      let dist = Math.abs(request_position - Taxis[i].position);
      if (dist < min_dist) {
        min_dist = dist;
        Taxiproche = Taxis[i];
      }
    }
  }
  return Taxiproche;
}

function getTAxi(request, time) {
  let Taxi = min_distance(request.position);

  if (Taxi != null) {
    let distance = Math.abs(request.position - Taxi.position);
    Taxi.available = false;
    Taxi.position = request.position;
    Taxi.timeRemaining = request.duration;
    Taxi.totalRides++;

    console.log(
      `Minute ${time}: Request ${request.reqId} at position ${request.position} → Taxi ${Taxi.id} assigned (distance: ${distance})`
    );
  } else {
    console.log(
      `Minute ${time}: Request ${request.reqId} at position ${request.position} → all taxis busy → added to queue`
    );
    Queue.push(request);
  }
}

function Libérer_taxis(currentTime) {
  for (let i = 0; i < Taxis.length; i++) {
    if (!Taxis[i].available) {
      Taxis[i].timeRemaining--;

      if (Taxis[i].timeRemaining <= 0) {
        Taxis[i].available = true;

        if (Queue.length > 0) {
          let nextReq = Queue.shift();
          getTAxi(nextReq, currentTime);
        }
      }
    }
  }
}

function start_requests() {
  let countertime = 0;

  while (
    Requests.length > 0 ||
    Queue.length > 0 ||
    Taxis.some((t) => !t.available)
  ) {
    for (let i = Requests.length - 1; i >= 0; i--) {
      if (Requests[i].time === countertime) {
        getTAxi(Requests[i], countertime);
        Requests.splice(i, 1);
      }
    }

    Libérer_taxis(countertime);
    countertime++;
  }

  console.log("\nMinute " + countertime + ":");
  console.log("\nAll rides completed.");
  console.log("\n=== Final Report ===");

  let totalRides = 0;
  for (let i = 0; i < Taxis.length; i++) {
    totalRides += Taxis[i].totalRides;
  }

  for (let i = 0; i < Taxis.length; i++) {
    console.log(
      `Taxi ${Taxis[i].id}: ${Taxis[i].totalRides} rides, final position: ${Taxis[i].position}`
    );
  }

  console.log(`Total rides completed: ${totalRides}`);
}

function get_time() {
  let maxTime = 0;
  for (let i = 0; i < Requests.length; i++) {
    if (Requests[i].time > maxTime) {
      maxTime = Requests[i].time;
    }
  }
  return maxTime + 1;
}

function get_request() {
  let position = +prompt("Enter your position: ");
  let duration = +prompt("Enter your duration: ");
  let time = get_time();

  let obj = {
    reqId: nextRequestId++,
    position: position,
    duration: duration,
    time: time,
  };

  console.log(`\nRequest ${obj.reqId} added at time ${time}\n`);
  Requests.push(obj);
  start_requests();
}

get_request();
