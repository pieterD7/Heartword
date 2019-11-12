
/*
    This control avoids resetting the cursor to within or before
    the already typed characters.
    Prevent word completion on virtual keyboards with autocomplete='off'
    attribute
    On a resume-ed app state this control needs to have run the url
    javascript:adjustPassword(document.querySelector('#password'))
*/

var el = document.querySelector("#password"),
    elEye = document.querySelector("#passwordEye"),
    heartChar =  '&#x2764',
    passLength = 0,
    password = '',
    showHearts = true,
    tgl = document.querySelector("#passwordFieldToggle")

    if(tgl)
        tgl.addEventListener('click', (event) => {
            var q = document.querySelector('input[name=password]'),
                qq = document.querySelector("#specialPassword");
            if(q.getAttribute('type') == 'password'){
                q.setAttribute('type', 'hidden')
                qq.className = 'displayBlock'
                document.querySelector('#password').focus()
            }
            else{
                q.setAttribute('type', 'password')
                qq.className = 'displayNone'
            }   q.focus()

        })

function adjustPassword(el){

    el.innerHTML = ''
    if(showHearts)
        for(var c = 0; c < passLength; c ++){
            el.innerHTML += heartChar
        }
    else
        el.innerHTML = password

    if(passLength < 1) return


    // Adjust cursor

    var range = document.createRange();
    var sel = window.getSelection();
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if(isSafari)
        range.setStart(el, passLength);
    else
        range.setStart(el, 1)   
        
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

function adjustPasswordHints(event){
    var q = document.querySelector('#capsLockOn span')
    if(q && event.getModifierState("CapsLock")){
        q.className = 'visible'
    }
    else if(q)
        q.className = 'hidden'

    q = document.querySelector("#numLockOn span")
    if(q && event.getModifierState("NumLock")){
        q.className = 'visible'
    }
    else if(q)
        q.className = 'hidden'

    q = document.querySelector("#minPasslength span")
    if (q && passLength < 2) {
        q.className = 'visible'
    }
    else if (q)
        q.className = 'hidden'

}

function adjustPassword2() {

    var text = el.innerText,
        heartsNo = text.length;

    text = text.replace(new RegExp(heartCharRegexp, "g"), "")

    if (showHearts) {
        if (heartsNo > password.length) {
            password += text
        }
        else
            password = password.slice(0, heartsNo)
    }
    else {
        password = text
    }

    passLength = password.length

    var text2 = '';

    for (var c = 0; c < password.length; c++) {
        text2 += heartChar
    }

    if (showHearts)
        el.innerHTML = text2
    else
        el.innerHTML = password

    if (passLength < 1) return

    // Adjust cursor
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(el, 1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}


elEye.addEventListener('click', (event) =>{
    showHearts = ! showHearts
    adjustPassword(el)
})

// With autocomplete
el.addEventListener('textInput', (event) => {

    //alert(event)

})

el.addEventListener('paste', (event) => {
    event.stopPropagation()
    event.preventDefault()
})

el.addEventListener('selectstart', (event) => {

    if(password.length < 1)
    ;
    else{
        event.stopPropagation()
        event.preventDefault()
    }
})

el.addEventListener('keydown', (event) => {

    // Dont disable keyboard F keys and hide
    // the typed characters
    if(event.key.toUpperCase() == 'ENTER'){
        event.stopPropagation()
        event.preventDefault()

        // Submit ...

        if(typeof medicontact !== 'undefined')
            medicontact.setPassword(password)

    }

    else if(! event.code.match(/^F/)
        && ! event.ctrlKey){

        event.stopPropagation()
        event.preventDefault()
    }
    //else console.log(event)
})

var q = document.querySelector(".ok")
if(q){
    q.addEventListener("click", () => {
        if(typeof medicontact != 'undefined'){
            medicontact.setPassword(password)
        }
    })
}

var lastMillis = 0

el.addEventListener('keyup', (event) => {

    var millis = new Date().getTime()
    if(millis > lastMillis + 100 / 3)
        lastMillis = millis
    else{
        adjustPassword(el)
        event.stopPropagation()
        event.preventDefault()
        return -1
    }

    if(event.key.toUpperCase() == 'BACKSPACE'){
        if(passLength > 0){
            password = password.slice(0, passLength - 1)
            passLength--

            adjustPassword(el)
        }
    }
    else if (!event.code) {

        var t1 = setTimeout((event) => {
            adjustPassword2()
        }, 100)
    }
    else if(
        !event.ctrlKey
        && !event.altKey
        && event.key.length == 1
        && ++passLength < 128){

        password += event.key

        adjustPasswordHints(event)

        // Adjust cursor
        adjustPassword(el)

        event.stopPropagation();
        event.preventDefault()
    }
    else{
        adjustPasswordHints(event)
        adjustPassword(el)
    }
})


//var el2 = document.querySelector("body")
//el2.addEventListener("keydown", (event) => adjustPasswordHints(event))