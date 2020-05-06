 
 
ajax('/profilePatient', 'GET', getUserData, null);

function getUserData(result) {
    result = JSON.parse(result.response);
    console.log('by getUserData: ',result);
    document.querySelector('#temp').innerHTML = result.data;
    //document.querySelector('#signup-birthday').value = result.birthday;
}
