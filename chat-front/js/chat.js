
// 로그인 시스템 대신 임시방편
let username = prompt('아이디를 입력하세요.')
let roomNum = prompt('채팅방 번호를 입력하세요.')

// 화면에 유저네임 보여주기
document.querySelector('#username').innerHTML = username;

// SSE 연결하기
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);

eventSource.onmessage = (e) => {
    const data = JSON.parse(e.data); // 디비의 정보 가져오기

    // 로그인한 유저가 보낸 메시지 (오른쪽)
    if(data.sender === username){
        initMyMessage(data)
    } else { // 아닌 것들은 회색박스 (왼쪽) 이어야 한다.
        initYourMessage(data)
    }

}

// 서버에서 가져올 박스 (파란박스)
function getSendMsgBox(data) {

    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md

    return `<div class="sent_msg">
                <p>${data.msg}</p>
                <span class="time_date"> ${convertTime} / <b>${data.sender}</b> </span>
            </div> `;
}

// 회색박스 만들기
function getReceiveMsgBox(data) {

    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md

    return `<div class="received_withd_msg">
                <p>${data.msg}</p>
                <span class="time_date"> ${convertTime} / <b>${data.sender}</b> </span>
            </div> `;
}

// 최초 초기화 될 때 1번방 3건있으면 3건을 다 가져온다.
// addMessage() 함수 호출 시 DB에 insert되고, 그 데이터가 자동으로 흘러들어온다.(SSE)
// 파란박스 초기화
function initMyMessage(data){
    let chatBox = document.querySelector('#chat-box');
    //let msgInput = document.querySelector('#chat-outgoing-msg');

    

    let sendBox = document.createElement('div');
    sendBox.className = 'outgoing_msg';

    sendBox.innerHTML = getSendMsgBox(data);
    chatBox.append(sendBox);

    // 스크롤 내리기
    document.documentElement.scrollTop = document.body.scrollHeight;
}

// 회색박스 초기화
function initYourMessage(data){
    let chatBox = document.querySelector('#chat-box');
    //let msgInput = document.querySelector('#chat-outgoing-msg');

    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md

    let receivedBox = document.createElement('div');
    receivedBox.className = 'received_msg';

    receivedBox.innerHTML = getReceiveMsgBox(data);
    chatBox.append(receivedBox);

    // 스크롤 내리기
    document.documentElement.scrollTop = document.body.scrollHeight;
}


document.querySelector('#chat-send').addEventListener('click', () => {
    addMessage();
    
});


// DB에 인서트만 시켜주면 된다.
// AJAX로 채팅 메시지를 전송
async function addMessage(){
    let msgInput = document.querySelector('#chat-outgoing-msg');

    let chatOutgoinBox = document.createElement('div');
    chatOutgoinBox.className = 'outgoing_msg';

    // 서버쪽으로 데이터 보내기
    let chat = {
        sender: username,
        roomNum: roomNum,
        msg: msgInput.value
    };

    fetch('http://localhost:8080/chat', {
        method: 'post',
        body: JSON.stringify(chat), // JS -> JSON
        headers: {
            'Content-Type':'application/json; charset=UTF-8'
        }
    })

    msgInput.value = '';
}

// 버튼 클릭 시 메시지 전송
document.querySelector('#chat-send').addEventListener('click', () => {
    addMessage();
    
});

// 엔터 치면 메시지 전송
document.querySelector('#chat-outgoing-msg').addEventListener('keydown', (e) => {
    if(e.keyCode === 13){
        addMessage();
    }
});

