document.querySelector('#signup-submit').onclick = function () {
    console.log("register");
    let name = document.querySelector('#signup-name').value,
        pass = document.querySelector('#signup-pass').value,
        passConf = document.querySelector('#password_conf').value,
        email = document.querySelector('#signup-email').value;

        if ((pass != passConf) || ((name == '') || (email == ''))) { 
		  	alert("Passwords do not match. Please try again.");
        } else {
            data = JSON.stringify({ name    : name,
                                    pass    : pass,
                                    email   : email });
            ajax('/signin', 'POST', showData, data);
        }
}

function showData(data) {
    data = JSON.parse(data.response);
    console.log('user cred: ', data);
}