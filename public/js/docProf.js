 
ajax('/profileDoctor', 'GET', getUserData, null);

function getUserData(result) {
    result = JSON.parse(result.response);
    console.log('by getUserData: ',result);
    document.querySelector('#temp').innerHTML = result.data;
    //document.querySelector('#signup-birthday').value = result.birthday;
}

document.querySelector('#set').onclick = function () {
    console.log("settings of reception");
    //ajax('/setParameter', 'POST', setReception, null);
}

function setReception () {
    
}
