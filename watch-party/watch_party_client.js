let rcBase = '012345ABCDEFGHIJKLMNOPQR'
var videoArea = document.getElementById("video-player")

const homePage = document.getElementById("home")
//const profilePage = document.getElementById("profile")
const createRoomPage = document.getElementById("createRoom")
const joinRoomPage = document.getElementById("joinRoom")
const roomDisplayPage = document.getElementById("roomDisplay")
const chat_msg = document.getElementById("send-form")
// const socket = io.connect("http://localhost:3001")
const socket = io.connect("https://cs553watchparty.onrender.com/")

function RandomCodeGenerator(n, baseString)
{   
    let randomCode = '';
    for(var i=n;i>0;i--)
        randomCode += baseString[Math.floor(Math.random()*baseString.length)];
    return randomCode;
}


socket.on('connect', function (socket) {
    console.log('Connected to the server!');    
});

socket.on('userInRoom', data => {
    
    console.log(data)
    if(data.partyRoomCode == localStorage.getItem("partyRoomCode"))
    {
        msg = data.name + ", Joined the Party!"
        document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg}</span></div>`
        document.getElementById("messagesDisplayArea").scrollTop = document.getElementById("messagesDisplayArea").scrollHeight
    }
        //Write a logic to show the user details in message box
    // if(data.partyRoomCode == localStorage.getItem("partyRoomCode")){
        
    //     document.getElementById("pplinparty").setAttribute("title", `People in party: ${data.members}`)
    //     var toolTipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
    //     toolTipTriggerList.map(function (tooltipTriggerE1){
    //         return new bootstrap.Tooltip(tooltipTriggerE1)
    //         });
    //     document.getElementById("messagesDisplayArea").scrollTop = document.getElementById("messagesDisplayArea").scrollHeight
    // }
})

//Displaying the Message when a chat message event is recieved
socket.on('chat_msg_recvd', data => {
    console.log(data)
    msg = data.name + ": " + data.chat_msg
    document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg}</span></div>`
    document.getElementById("messagesDisplayArea").scrollTop = document.getElementById("messagesDisplayArea").scrollHeight
})

let canEmit = true
socket.on('updateVideoControls', control_settings => {
    console.log('Updated Vide Control Settings: \n',control_settings)
    control_recvd_client = Date.now()
    if(control_settings.message=='play_video')
    {
        //setting the video's time based on the updated settings
        videoArea.currentTime = control_settings.vcontrol_time
        canEmit = false;
        videoArea.play()
        //Updating the message box
        var lag1 = control_settings.control_recvd_server-control_settings.control_triggered_time
        var lag2 = control_recvd_client - control_settings.control_recvd_server
        var tot_lag = lag1+lag2
        var msg = control_settings.video_user+ ": played the video from -> " + control_settings.vcontrol_time + "s.<br>"
        var msg2 = "Lag between Sender and Server: "+lag1 + " ms.<br>"
        var msg3 = "Lag between Server and Receiver: "+lag2 + " ms.<br>"
        var msg4 = "Total Lag: " + tot_lag + " ms."
        msg = msg + msg2 + msg3+msg4
        document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg}</span></div>`
        // document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg2}</span></div>`
        // document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg3}</span></div>`
        // document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg4}</span></div>`
        
        document.getElementById("messagesDisplayArea").scrollTop = document.getElementById("messagesDisplayArea").scrollHeight

    }
    if(control_settings.message=='pause_video')
    {
        //setting the video's time based on the updated settings
        videoArea.currentTime = control_settings.vcontrol_time
        canEmit = false;
        videoArea.pause()
        //Updating the message box
        var lag1 = control_settings.control_recvd_server-control_settings.control_triggered_time
        var lag2 = control_recvd_client - control_settings.control_recvd_server
        var tot_lag = lag1+lag2
        var msg = control_settings.video_user+ ", paused the video at -> " + control_settings.vcontrol_time + "s.<br>"
        var msg2 = "Lag between Sender and Server: "+lag1 + " ms.<br>"
        var msg3 = "Lag between Server and Receiver: "+lag2 + " ms.<br>"
        var msg4 = "Total Lag: " + tot_lag + " ms."
        msg = msg + msg2 + msg3+msg4
        document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg}</span></div>`
        // document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg2}</span></div>`
        // document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg3}</span></div>`
        // document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg4}</span></div>`
        
        document.getElementById("messagesDisplayArea").scrollTop = document.getElementById("messagesDisplayArea").scrollHeight
    }
})

//Adding event listners for all the buttions based on the functionality
document.addEventListener("click", function (ev) {
    
    if(ev.target.id=="createPartyRoomButton"){
        homePage.style.display = "none"
        createRoomPage.style.display="block"
    }
    //New Room is being created
    if(ev.target.id=="newRoom")
    {
        let partyRoomName = document.getElementById('rName').value
        let partyHostName = document.getElementById('hName').value
        let partyRoomVideo = document.getElementById('uploadedVideoLink').value
        partyRoomVideo = partyRoomVideo.replace("file/d/","uc?id=")
        partyRoomVideo = partyRoomVideo.replace(partyRoomVideo.substring(partyRoomVideo.indexOf("/view?")),"")
        console.log("Modified Videolink : ", partyRoomVideo)
        //let partyRoomName = document.getElementById('').value
        if(partyHostName.length==0 || partyRoomName.length==0 || partyRoomVideo.length==0 /*localStorage.getItem("uploadedVideoPath")==null*/)
        {
            //Display Necessary Error
            console.log("Error: Some field is Empty")
            document.getElementById("crPlaceholder").innerHTML = 'Make sure to fill all the fields'
        }
        else
        {
            //Setting up necessary Local Variables
            localStorage.setItem("partyRoomName", partyRoomName)
            localStorage.setItem("partyHostName", partyHostName)
            let partyRoomCode = RandomCodeGenerator(6,rcBase)
            console.log("PartyRoom created with Code: ", partyRoomCode)
            document.getElementById("crPlaceholder").innerHTML = ""
            document.getElementById("roomCodeText").innerHTML = partyRoomCode
            document.getElementById("roomNameText").innerHTML = partyRoomName
            //Set up VideoPlayers src attribute
            //videoArea.setAttribute("src", localStorage.getItem("uploadedVideoPath"))
            videoArea.setAttribute("src", partyRoomVideo)


            //Post API call to server to create a Room
            var header = new Headers();
            header.append("Content-Type","application/json")
            var raw_body = JSON.stringify({
                "partyRoomName": partyRoomName,
                "partyRoomId": partyRoomCode,
                //"partyVideoSize" : Number(localStorage.getItem("uploadedVideoSize"))
                "partyRoomVideo":partyRoomVideo
            })
            //console.log("Body:", raw_body)
            var requestPrams = {method:'POST', headers: header, body:raw_body}
            //fetch("http://localhost:3001/room/createRoom", requestPrams)
            fetch("https://cs553watchparty.onrender.com/room/createRoom", requestPrams)
            .then(async(res) => {
                var response = await res.json()
                if(response.message=='room_created')
                {
                    //Setting Up local variable
                    localStorage.setItem("partyRoomCode", partyRoomCode)
                    socket.emit('EnteredRoom', { name: partyHostName, partyRoomCode: partyRoomCode })
                    createRoomPage.style.display="none"
                    roomDisplayPage.style.display="block"
                }
            })
            .catch(err => console.log("Error: ", err))

        }
    }
    if(ev.target.id == "joinPartyRoomButton") {
        homePage.style.display = "none"
        joinRoomPage.style.display = "block"
    }
    if(ev.target.id=="newRoomJoinee")
    {
        let roomJoineeName = document.getElementById("jName").value
        let roomId = document.getElementById("rId").value
        if(roomJoineeName.length==0 || roomId.length==0 /*|| localStorage.getItem("uploadedVideoPath")==null*/)
        {
            //Display Necessary Error
            console.log("Error: Some field is Empty")
            document.getElementById("jrPlaceholder").innerHTML = 'Make sure to fill all the fields..'
        }
        else
        {
            //Post API call to server to create a Room
            var header = new Headers();
            header.append("Content-Type","application/json")
            var raw_body = JSON.stringify({
                "partyRoomId": roomId
                //,"partyVideoSize" : Number(localStorage.getItem("uploadedVideoSize"))
            })
            console.log("Body:", raw_body)
            var requestPrams = {method:'POST', headers: header, body:raw_body}
            //fetch("http://localhost:3001/room/joinRoom", requestPrams)
            fetch("https://cs553watchparty.onrender.com/room/joinRoom", requestPrams)
            .then(async(res) => {
                var response = await res.json()
                //console.log(response.message)
                if(response.message=='room_joined')
                {
                    document.getElementById("jrPlaceholder").innerHTML = ""
                    //Setting Up local variable
                    localStorage.setItem("partyRoomCode", roomId)
                    localStorage.setItem("partyJoineeName", document.getElementById("jName").value)
                    document.getElementById("roomCodeText").innerHTML = roomId
                    document.getElementById("roomNameText").innerHTML = response.partyRoomName
                    socket.emit('EnteredRoom', { name: localStorage.getItem("partyJoineeName"), partyRoomCode: roomId })
                    //Set up VideoPlayers src attribute
                    //videoArea.setAttribute("src", localStorage.getItem("uploadedVideoPath"))
                    videoArea.setAttribute("src",response.partyRoomVideo)
                    joinRoomPage.style.display="none"
                    roomDisplayPage.style.display="block"
                }
                else
                {
                    document.getElementById("jrPlaceholder").innerHTML = response.message
                }
            })
            .catch(err => console.log("Error: ", err))
        }    
    }
    if(ev.target.id == 'roomLeaveButton')
    {
        videoArea.setAttribute("src","")
        location.reload()
    }
    if(ev.target.id == "backButton") {
        joinRoomPage.style.display = "none"
        createRoomPage.style.display = "none"
        homePage.style.display = "block"
    }
})

chat_msg.addEventListener('submit', (ev)=>{
    ev.preventDefault()
    let input_msg = document.getElementById("chatMessage").value
    if(input_msg.length>0)
    {
        socket.emit('sending_chat_msg', input_msg)
        if(localStorage.getItem("partyHostName") == null) //different browsers
            msg = localStorage.getItem("partyJoineeName") + ": " + input_msg
        else if(localStorage.getItem("partyJoineeName") == null)
            msg = localStorage.getItem("partyHostName") + ": " + input_msg
        else{  //check for same browser -- Update the logic
            msg = localStorage.getItem("partyJoineeName") + ": " + input_msg
        }
        document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg}</span></div>`
        document.getElementById("chatMessage").value = ""
        document.getElementById("messagesDisplayArea").scrollTop = document.getElementById("messagesDisplayArea").scrollHeight
    }
})


videoArea.addEventListener('play',videoController,false)
videoArea.addEventListener('pause',videoController,false)



function videoController(ev)
{
    if(ev.type=='play')
    {
        if(canEmit)
        {
            let video_play_time = videoArea.currentTime
            console.log("Play Control- Current Time: ",video_play_time)
            socket.emit('vController',{message: "play_video", vcontrol_time: video_play_time, partyRoomCode: localStorage.getItem("partyRoomCode"), control_triggered_time:Date.now()})
            msg = "You played the video from " + video_play_time
            document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg}</span></div>`
            document.getElementById("messagesDisplayArea").scrollTop = document.getElementById("messagesDisplayArea").scrollHeight
        }
        setTimeout(() => {
            canEmit = true
        }, 500)
    }
    else if(ev.type=='pause')
    {
        if(canEmit)
        {
            let video_pause_time = videoArea.currentTime
            console.log("Pause Control- Current Time: ",video_pause_time)
            socket.emit('vController',{message: "pause_video", vcontrol_time: video_pause_time, partyRoomCode: localStorage.getItem("partyRoomCode"), control_triggered_time:Date.now()})
            msg = "You paused the video at " + video_pause_time
            document.getElementById("messagesDisplayArea").innerHTML = document.getElementById("messagesDisplayArea").innerHTML + `<div class="col-12 mt-3" id="message"><span>${msg}</span></div>`
            document.getElementById("messagesDisplayArea").scrollTop = document.getElementById("messagesDisplayArea").scrollHeight
        }
        setTimeout(() => {
            canEmit = true
        }, 500)
    }
}

// function onFileUpload()
// {
//     let vidfile;
//     if(arguments[0]=="join")
//         vidfile = document.getElementById('juploadedFile').files[0]
//     else
//         vidfile = document.getElementById('uploadedFile').files[0]
//     console.log(vidfile)
//     let vidpath = (window.URL || window.webkitURL).createObjectURL(vidfile)
//     const vidsize = vidfile.size
//     localStorage.setItem("uploadedVideoSize", vidsize)
//     localStorage.setItem("uploadedVideoPath", vidpath)
// }
