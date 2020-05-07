 
 
ajax('/profilePatient', 'GET', getUserData, null);

function getUserData(result) {
    result = JSON.parse(result.response);
    console.log('by getUserData: ',result);
    document.querySelector('#temp').innerHTML = result.head;
    result.data.forEach (function(item) {
        document.querySelector('#promise').innerHTML += item.speciality
                    + " " + item.username
                    + " avaible session " + item.timeToWork + "<br>";
    });
}
