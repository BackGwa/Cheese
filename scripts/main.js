
// 어플리케이션 로드 시
window.onload = () => {

    // 오디오 객체
    btnse = document.querySelector('#btnse');

    // 스플래쉬 스크린
    splash_screen = document.querySelector('splash-screen');

    // 채팅 레이아웃 엘리먼트
    chat_screen = document.querySelector('chat-screen');

    // 메뉴 엘리먼트
    menu_layout = document.querySelector('menu-layout');
    menu_button = document.querySelector('menu-button');
    menu_label = document.querySelector('menu-label');

    // 유저 입력 엘리먼트
    input_layout = document.querySelector('input-layout');
    user_input = document.querySelector('#user-input');
    submit_input = document.querySelector('submit-input');

    // 메뉴 이벤트 등록
    menu_button.onclick = () => {
        if (document.querySelector('init-content').classList.contains("init-unshow")) {
            call_menu();
        }
    }

    // 메뉴 입력 등록
    user_input.onfocus = call_focus;
    user_input.onblur = call_blur;

    // 요청 이벤트 등록
    submit_input.onclick = () => {
        if (user_input.value && user_input.value.replace(/ /gi).length > 0) {
            requestAI(user_input.value);
        }
    }

    user_input.onkeypress = (e) => {
        if(e.keyCode == 13){
            if (user_input.value && user_input.value.replace(/ /gi).length > 0) {
                requestAI(user_input.value);
            }
        }
    }

    random_init();
    
    setTimeout(() => {
        call_splash();
    }, 500)
}

function call_menu() {
    btnse.play()
    if (menu_layout.classList.contains("menu-focus")) {
        menu_layout.classList.remove("menu-focus");
        chat_screen.classList.remove("menu-expand");
    } else {
        menu_layout.classList.add("menu-focus");
        chat_screen.classList.add("menu-expand");
    }
}

function call_splash() {
    splash_screen.classList.add("load-application");
    chat_screen.classList.remove("zoom-screen");
}

function call_focus() {
    btnse.play()
    input_layout.classList.add("input-focus");
    document.querySelector('chat-layout').classList.add("focus-chat");
}

function call_blur() {
    input_layout.classList.remove("input-focus");
    document.querySelector('chat-layout').classList.remove("focus-chat");
}