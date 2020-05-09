 
 
ajax('/profilePatient', 'GET', getUserData, null);

function getUserData(result) {
    let table = document.querySelector('#tbody'),
        row, cell, span;
    result = JSON.parse(result.response);
    console.log('by getUserData: ',result);
    document.querySelector('#temp').innerHTML = result.head;
    table.idPatient = result.idPatient;
    result.sessionData.forEach (function(item) {
        row = table.insertRow();
        row.id = item._id;
        row.insertCell().innerHTML = item.speciality;
        row.insertCell().innerHTML = item.username;
        cell = row.insertCell();
        cell.classList.add('spanBtn');
        for (let s of item.timeToWork) {
            span = document.createElement('span');
            span.innerHTML = s;
            span.onclick = selectSession;
            cell.appendChild(span);
        } 
    });
}

function selectSession () {
    let data;
    if (!this.parentNode.sel || this.sel) {
        console.log( this.parentNode.parentNode.id
                    ,this.parentNode.parentNode.parentNode.idPatient
                    ,this.parentNode.parentNode.firstChild.innerHTML
                    ,this.innerHTML
                    ,[...this.parentNode.childNodes].indexOf(this));
        this.parentNode.classList.toggle('spanBtn');
        this.parentNode.classList.toggle('unavailable');
        this.classList.toggle('selected');
        this.parentNode.sel = this.parentNode.sel?false:true;
        this.sel = this.sel?false:true;
        data = JSON.stringify({ idDoctor: this.parentNode.parentNode.id
                                ,idPatient: this.parentNode.parentNode.parentNode.idPatient
                                ,index: [...this.parentNode.childNodes].indexOf(this)
                                ,action: this.sel });
        ajax('/selSession', 'POST', getAnswer, data);
    }
}

function getAnswer(result) {
    result = JSON.parse(result.response);
    console.log('by getAnswer: ',result);
}
