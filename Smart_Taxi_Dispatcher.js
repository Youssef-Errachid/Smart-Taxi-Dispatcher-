

const prompt = require("prompt-sync")();

let Taxis = [ 
{ id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 
0 }, 
{ id: 2, position: 12, available: true, timeRemaining: 0, 
totalRides: 0 }, 
{ id: 3, position: 20, available: true, timeRemaining: 0, 
totalRides: 0 } 
] 

let Requests = []; 
let Queue = [];

function min_distance(request_position){
    let min_dist = Infinity;
    let Taxiproche = null; 

        for(let i = 0 ; i < Taxis.length;i++){
if(Math.abs(request_position - Taxis[i].position ) < min_dist && Taxis[i].available == true ){
Taxiproche = Taxis[i];
}
    }
    return Taxiproche;
}

function getTAxi(request,time){
  let Taxi = min_distance(request.position);


  if (Taxi != null) {
    let distance = Math.abs(request.position - Taxi.position);
    Taxi.available = false;
    Taxi.position = request.position;
    Taxi.timeRemaining = request.duration;
    Taxi.totalRides++;

    console.log(
     ` Minute ${time}: Request ${request.reqId} at position ${Taxi.position} → Taxi ${Taxi.id} assigned (distance: ${distance})`
    );
  }  else {
    console.log(
      `Minute ${time}: Request ${request.reqId} at position${Taxi.position} → all taxis busy  → added to queue`
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

function start_requests(Requests) {
  let countertime  = 0;
  let maxTime = 10;

  while (countertime  <= maxTime) {
    for (let i = 0; i < Requests.length; i++) {
      if (Requests[i].time === countertime ) {
        getTAxi(Requests[i], countertime );
      }
    }

    Libérer_taxis(countertime );

    countertime ++;
  }
  console.log("\nMinute " + countertime  + ":");
  console.log("\nAll rides completed.");
  console.log("\n===  Final Report ===");
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

function get_request(){
    let Id = 0; 
    let position = 0; 
    let duration = 0; 
    let time = 0; 

        let obj = {
          reqId :  ++Id,
          position: +prompt("enter your position "),
          duration : +prompt("enter your duration "),
          time : +prompt("enter your time ")
        }
        console.log("\n");
        Requests.push(obj);
       start_requests(Requests);
  

}

get_request();











