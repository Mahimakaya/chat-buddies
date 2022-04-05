const socket = io(); // connected to server

let textarea = document.querySelector('#text')
let messageArea = document.querySelector('.messages')
let emodiv = document.querySelector(".emojis")
let filebox = document.querySelector("#files")
let user;
let boldText = false, italicText = false, strikeText = false, linker = false, blockQuote = false, code = false, bullets = false, numbers = false, i = 1
//take user name
do {
    user = prompt('Enter your name')
} while (!user)

//user name sent to server
socket.emit("new-user", user)

socket.on("new_user", (username) => {
    userstatus(username, 'joined');
})

//user left the chat
socket.on("user_left", (username) => {
    userstatus(username, 'left')
})

//user joined or left will be shown here
function userstatus(name, status) {
    let div = document.createElement('div')
    div.classList.add('users')
    let texts = `
        <h4>${name} ${status} the chat</h4>
    `
    div.innerHTML = texts
    messageArea.appendChild(div)
}
//display emojis
emoji()
function emoji() {
    var emoticon = ''
    for (var i = 128512; i <= 128591; i++) {
        emoticon += `<a href="#" onclick="getEmoji(this)">&#${i}</a>`
    }
    emodiv.innerHTML = emoticon
}

//show or close emojies
function showemoji(e) {
    if (emodiv.style.display === "flex") {
        emodiv.style.display = "none"
    }
    else {
        emodiv.style.display = "flex"
    }
}
function hideemoji() {
    emodiv.style.display = "none"
}
function getEmoji(emo) {
    textarea.value += emo.innerHTML
}
//make text bold
function fun1(e) {
    if (textarea.style.fontWeight === "bold") {
        textarea.style.fontWeight = "normal"
        e.style.background = "none"
        boldText = false
    } else {
        textarea.style.fontWeight = "bold"
        e.style.background = "#444950"
        boldText = true
    }
    textarea.focus()
}
//make text italic
function fun2(e) {
    if (textarea.style.fontStyle === "italic") {
        textarea.style.fontStyle = "normal"
        e.style.background = "none"
        italicText = false
    } else {
        textarea.style.fontStyle = "italic"
        e.style.background = "#444950"
        italicText = true
    }
    textarea.focus()
}
//make strike through the text
function fun3(e) {
    if (textarea.style.textDecoration === "line-through") {
        textarea.style.textDecoration = "none"
        e.style.background = "none"
        strikeText = false
    } else {
        textarea.style.textDecoration = "line-through"
        e.style.background = "#444950"
        strikeText = true
    }
    textarea.focus()
}
//link
function fun4() {
    if(linker===true){
        e.style.background = "#none"
    }
    else{
        e.style.background = "#444950"
    }
    linker = !linker

}

//adding bullets and numbers to the text in textarea to make it list
//start and numstart functions to add the first bullet or number when textarea is empty
//bulleters and num function to add bullets and nums whenever enter is clicked
function start() {
    if (textarea.value === '') {
        textarea.value += '• '
    }
}
function bulleters(e) {
    if (e.key === 'Enter') {
        textarea.value += '• '
    }
}
function numstart() {
    if (textarea.value === '') {
        textarea.value += 1 + '. '
    }
}
function num(e) {
    if (e.key === 'Enter') {
        textarea.value += i + '. '
        i = i + 1
    }
}
//making bulleted list
function fun5(e) {
    if (bullets === false) {
        e.style.background = "#444950"
        /*textarea.onfocus = function(){
            console.log("entered")
            if(textarea.value===''){
                console.log("working")
                textarea.value += '• '
            }
        }
        textarea.addEventListener('keyup',(e)=>{
            if(e.key==='Enter'){
                textarea.value += '• '
            }
        })*/
        textarea.addEventListener('focus', start)
        textarea.addEventListener('keyup', bulleters)
        bullets = true
    }
    else {
        e.style.background = "none"
        textarea.removeEventListener('focus', start)
        textarea.removeEventListener('keyup', bulleters)
        bullets = false
    }
}
//making numbered list
function fun6(e) {
    i = 2
    if (numbers === false) {
        e.style.background = "#444950"
        textarea.addEventListener('focus', numstart)
        textarea.addEventListener('keyup', num)
        numbers = true
    }
    else {
        e.style.background = "none"
        textarea.removeEventListener('focus', numstart)
        textarea.removeEventListener('keyup', num)
        numbers = false
    }
}
//make text blockquote
function fun7(e) {
    if (textarea.style.textAlign === "center") {
        textarea.style.textAlign = "left"
        blockQuote = true
        e.style.background = "none"
    } else {
        textarea.style.textAlign = "center"
        blockQuote = false
        e.style.background = "#444950"
    }
    textarea.focus()
}
//sending files
function fileSend() {
    filebox.click()
}
function fun8() {
    /*let pre = document.querySelector(".pre")
    pre.innerHTML = textarea.value
    textarea.appendChild(pre)
    pre.style.display="block"*/
    code = !code
}
function coder(e) {
  /*  if (code) {
        let pre = document.querySelector(".pre")
        pre.innerHTML = e.value
        pre.style.display = "block"
        textarea.style.display = "none"
    }
    else {
        pre.style.display = "none"
        textarea.style.display = "block"
    }*/
}
function fileSelected(e) {
    var file = e.files[0]
    if (file) {
        var reader = new FileReader()
        reader.addEventListener("load", function () {
            let msg = {
                Name: user,
                message: reader.result,
                fileName: file.name,
            }
            appendMessage(msg, 'sent_msg')
            textarea.value = ''
            textarea.focus()
            scrollBottom()
            socket.emit('message', msg)
        }, false)
        reader.readAsDataURL(file)
    }
}
function getFileName(str){
    return str.substring(str.lastIndexOf('/') + 1);
}
function download(e) {
    let imagepath = e.getAttribute('src')
    let filename = getFileName(imagepath)
    saveAs(imagepath,filename)
}
//sending message on clicking send button
function send() {
    if (textarea.value) {
        sendMessage(textarea.value)
    }
}

function sendMessage(m) {
    let msg = {
        Name: user,
        message: m.trim(),
        bold: boldText,
        italic: italicText,
        strike: strikeText,
        block: blockQuote,
        link: linker,
        code: code
    }

    appendMessage(msg, 'sent_msg')
    textarea.value = ''
    textarea.focus()
    scrollBottom()
    socket.emit('message', msg)
}

function appendMessage(msg, type) {
    var mess = ""
    if (msg.message.indexOf("base64") !== -1) {
        let m = msg.fileName
        if (m.indexOf(".jpeg") !== -1 || m.indexOf(".jpg") !== -1 || m.indexOf(".jfif") !== -1 || m.indexOf(".png") !== -1 || m.indexOf(".gif") !== -1) {
            mess = `
            <a href="${msg.message}" download style="text-decoration:none">
                <img src="${msg.message}" onclick="download(this)" class="image"></img>
                </a>
            `
        }
        else if (m.indexOf(".pdf") !== -1 || m.indexOf(".docx") !== -1 || m.indexOf(".ppt") !== -1) {
            mess = `
                <b>${msg.fileName}</b>
                <a href="${msg.message}" download><i class="fa fa-download" aria-hidden="true"></i></a>
            `
        }
    }
    else {
        mess = msg.message
    }
    let box = document.createElement('div')
    let heading = document.createElement('h4')
    let para = document.createElement('p')
    let classname = type
    box.classList.add(classname)
    para.style.display = "flex"

    if (msg.bold === true) {
        para.style.fontWeight = "bold"
    }
    if (msg.italic === true) {
        para.style.fontStyle = "italic"
    }
    if (msg.strike === true) {
        para.style.textDecoration = "line-through"
    }
    if (msg.block === true) {
        para.style.textAlign = "center"
        para.style.width = "100%"
    }
    if (msg.link === true) {
        let anchor = document.createElement('a')
        anchor.setAttribute("target", "_blank")
        anchor.href = mess
        anchor.innerHTML = `${mess}`
        para.appendChild(anchor)
        linker=false
    }
    else {
        para.innerHTML = `${mess}`
    }
    heading.innerHTML = `${msg.Name}`
    box.appendChild(heading)
    box.appendChild(para)
    messageArea.appendChild(box)
}

//message recieve
socket.on('message', (msg) => {
    appendMessage(msg, 'recieved_msg')
    scrollBottom()
})

function scrollBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}