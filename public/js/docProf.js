 
ajax('/profileDoctor', 'GET', getUserData, null);

function getUserData(result) {
    let table = document.querySelector('#tbody'),
        row, cell, div;
    result = JSON.parse(result.response);
    console.log('by getUserData: ',result);
    document.querySelector('#temp').innerHTML = result.head;
    if (result.timeToWork.length > 0) {
    div = document.createElement('div');
    div.innerHTML = "You have today " + result.timeToWork.length 
                      + " available sessions at " + result.timeToWork;
    document.querySelector('#sessions').appendChild(div);
    }
    if (result.appointment.length > 0) {
        document.querySelector('#set').block = true;        
        document.querySelector('#table').classList.toggle('hide');
        result.appointment.forEach (function(item) {
            row = table.insertRow();
            row.insertCell().innerHTML = item.name;
            row.insertCell().innerHTML = item.time;
        });
    }
}

document.querySelector('#set').onclick = function () {
    if (!document.querySelector('#set').block) {
        let session = document.querySelector('#session').value,
            startTime = document.querySelector('#startTime').value.split(":"),
            endTime = document.querySelector('#endTime').value.split(":"),
            date = new Date (),
            diff =  date.setHours(endTime[0],endTime[1],0,0) - 
                    date.setHours(startTime[0],startTime[1],0,0),
            arrReception = [],
            temp,temp2,temp3;
        
        for (let i = 0; i < diff; i += session*1000*60) {
            temp = date.setHours(startTime[0],startTime[1],0,i);
            temp2 = new Date(temp);
            console.log(temp2.toTimeString());
            arrReception.push(temp2.toTimeString().replace(/:[0-9]{2,2} .*/, ''));
        }
        console.log("settings of reception", arrReception.length, arrReception);
        document.querySelector('#promise').innerHTML = "You have today " 
                                                        + arrReception.length 
                                                        + " sessions";
        ajax('/setParameter', 'POST', setReception, JSON.stringify({timeToWork: arrReception}));
    }
}

function setReception (data) {
    data = JSON.parse(data.response);
    console.log('setParameter: ', data, data.data);
    document.querySelector('#promise').innerHTML += " at " + data.data.timeToWork;
}

/*

var dif = ( new Date("1970-1-1 " + end-time) - new Date("1970-1-1 " + start-time) ) / 1000 / 60 / 60;

function diff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * (1000 * 60 * 60);
    var minutes = Math.floor(diff / 1000 / 60);
    diff -= minutes * (1000 * 60);
    var seconds = Math.floor(diff / 1000);



    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0)
       hours = hours + 24;


    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes + (seconds<= 9 ? "0" : "") + seconds;
}
 
*/
