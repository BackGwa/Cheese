
let RequestMessage = [
    { role: "system", content: SYSTEM_MESSAGE }
]

const text_arr = [
    ["반가워! 너는 누구야??",
     "좋은 여행지가 있을까?",
     "메뉴 고르는 걸 도와줄래?",
     "창업에 대해서 어떻게 생각해?",
     "스마트팩토리는 어떤 것 같아?",
     "연애를 하고 싶어!"],

    ["문제 푸는 것 좀 도와줘!",
     "파이썬을 배우고 싶어!",
     "개발자가 되기 위해서 무엇을 해야해?",
     "스마트팩토리가 뭐야?",
     "개발 환경을 설정하고 싶어!",
     "맥과 윈도우 중 무엇이 좋을까?"],

    ["요즘 자기 돌봄을 하기 힘들어..",
     "힘든 일을 겪고 있어..",
     "행복해지기 위한 방법이 있을까?",
     "우울을 극복하는 방법이 뭐야?",
     "부담감을 줄이기 위해 무엇을 해야해?",
     "휴식을 가지고 싶어.."]
];

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchAIResponse(params) {
    RequestMessage.push({ role: "user", content: params });

    const requestOptions = {
        method: 'POST',
        headers: {  'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: RequestMessage,
            temperature: 0.85, max_tokens: 300,
            top_p: 1,
            frequency_penalty: 0.45, presence_penalty: 0.48
        }),
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        return aiResponse;
    }
    catch (error) { console.error(error); }
}

function random_init() {
    document.querySelectorAll('init-item').forEach((i, index) => {
        subtitle = i.querySelector('item-subtitle');

        text_index = randint(0, 5);

        subtitle.innerHTML = `"${text_arr[index][text_index]}"`;

        i.setAttribute("onclick", `requestAI("${text_arr[index][text_index]}")`)
    });
}

function requestAI(params) {
    btnse.play()
    if (!document.querySelector('init-content').classList.contains("init-unshow")) {
        document.querySelector('init-content').classList.add("init-unshow");
        topicPoint(params);

        today = new Date();
        year = today.getFullYear();
        month = ('0' + (today.getMonth() + 1)).slice(-2);
        day = ('0' + today.getDate()).slice(-2);
        dateString = year + '년 ' + month  + '월 ' + day + '일';

        hours = ('0' + today.getHours()).slice(-2); 
        minutes = ('0' + today.getMinutes()).slice(-2);

        timeString = hours + ':' + minutes;

        document.querySelector('chat-layout').innerHTML += `<date-box>${dateString} - ${timeString}</date-box>`
    }

    user_input.value = "";
    user_input.disabled = true;

    document.querySelector('chat-layout').innerHTML += `
    <chat-box>
        <human-chat>${params}</human-chat>
    </chat-box>
    `;

    nowchat = document.querySelector('chat-layout').innerHTML;

    document.querySelector('chat-layout').innerHTML += `
    <chat-box class="thinking">
        <ai-chat>
            답변을 생성하고 있어요.
            <load-area>
                <load-bar></load-bar>
            </load-area>
        </ai-chat>
    </chat-box>
    `;

    document.querySelector('chat-layout').scrollTop = document.querySelector('chat-layout').scrollHeight;

    fetchAIResponse(params)
        .then(response => {
            if (response.length > 0) {
                rdfc = randint(0, 1000000);
                RequestMessage.push({ role: "assistant", content: response });
                document.querySelector('chat-layout').innerHTML = nowchat + `
                <chat-box>
                    <ai-chat id='x${rdfc}'>
                        ${response.replace(/\n/gi, "<br>")}
                    </ai-chat>
                </chat-box>
                `
                user_input.disabled = false;
                document.querySelector('chat-layout').scrollTop = document.querySelector('chat-layout').scrollHeight;

                // 메세지를 누르면 말하기
                document.querySelector(`#x${rdfc}`).onclick = () => {
                    // TTS 초기화
                    const speechMsg = new SpeechSynthesisUtterance();
                    window.speechSynthesis.cancel();
                    speechMsg.lang = "ko-KR";
                    speechMsg.pitch = 0.98;
                    speechMsg.rate = 0.9;

                    // TTS 말하기
                    speechMsg.text = response;
                    window.speechSynthesis.speak(speechMsg);
                }

            }
        })
        .catch(error => {
            console.error(error);
            document.querySelector('chat-layout').innerHTML = nowchat + `
                <chat-box>
                    <ai-chat>
                        오류가 발생했어! 조금만 있다가 다시시도 해줄래?
                    </ai-chat>
                </chat-box>
                `
            user_input.disabled = false;
            document.querySelector('chat-layout').scrollTop = document.querySelector('chat-layout').scrollHeight;
        });
}

function topicPoint(topicText) {
    menu_label.innerHTML = topicText;
}

function newTopic() {
    btnse.play()
    random_init();
    call_menu();
    topicPoint("새로운 주제");
    user_input.value = "";
    user_input.disabled = false;

    document.querySelector('init-content').classList.remove("init-unshow");

    chat_box = document.querySelectorAll("chat-box");
    chat_box.forEach(i => {
        i.remove();
    });

    document.querySelector("date-box").remove();

    RequestMessage = [
        { role: "system", content: SYSTEM_MESSAGE }
    ]
    
}

function reWrite() {
    btnse.play()
    req = RequestMessage[1].content;
    newTopic()
    requestAI(req);
}