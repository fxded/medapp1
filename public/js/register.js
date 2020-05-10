document.querySelector('#radioDoctor').onclick = function () {
    let speciality = document.querySelector('#signup-speciality');
    speciality.style.display = 'inline';
}
document.querySelector('#radioPatient').onclick = function () {
    let speciality = document.querySelector('#signup-speciality');
    speciality.style.display = 'none';
}


document.querySelector('#signup-submit').onclick = function () {
    console.log("register");
    let name = document.querySelector('#signup-name').value,
        pass = document.querySelector('#signup-pass').value,
        passConf = document.querySelector('#password_conf').value,
        email = document.querySelector('#signup-email').value,
        speciality = document.querySelector('#signup-speciality'),
        ifspec = document.querySelectorAll('.spec');

    for (let i = 0; i < ifspec.length; i++) {
        if (ifspec[i].checked) {
            ifspec = ifspec[i].value;
            break;
        }
    }
    if (ifspec == 'doctor') {
        if ((pass != passConf) || ((name == '') || (email == '') || (speciality.value == ''))) { 
		  	alert("Passwords do not match or empty field. Please try again.");
        } else {
            data = JSON.stringify({ name    : name,
                                    pass    : pass,
                                    email   : email,
                                    speciality: speciality.value});
            ajax('/signin', 'POST', showData, data);
        }
    } else {
        if ((pass != passConf) || ((name == '') || (email == ''))) { 
		  	alert("Passwords do not match or empty field. Please try again.");
        } else {
            data = JSON.stringify({ name    : name,
                                    pass    : pass,
                                    email   : email,
                                    speciality: false });
            ajax('/signin', 'POST', showData, data);
        }
        
    }
}

function showData(data) {
    data = JSON.parse(data.response);
    console.log('user cred: ', data);
    document.location.href = "login.html";
 }
