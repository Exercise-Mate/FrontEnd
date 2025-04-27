<template>
    <div class="container">
        유저이름:
        <input v-model="writer" type="text" />
        내용:
        <input v-model="message" type="text" @keyup="sendMessage" />
        <div v-for="(item, idx) in receiveMsg" :key="idx">
            <h3>채팅방: {{ item.chatRoomId }}</h3>
            <h3>보낸사람: {{ item.writer }}</h3>
            <h3>내용: {{ item.message }}</h3>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'
import Stomp from 'webstomp-client';
import SockJS from 'sockjs-client';

// 현재 라우트 정보
const route = useRoute()

// path에서 추출한 memberId
const chatRoomId = computed(() => route.params.id)

// reactive 상태 관리
const writer = ref('');
const message = ref('');
const receiveMsg = ref([]);

// stompClient를 선언 (여기서는 전역으로 사용되지 않도록 ref로 관리)
let stompClient = null;

// WebSocket 연결 함수
const connect = () => {
    const serverURL = "http://localhost:8080/stomp/chat";
    let socket = new SockJS(serverURL);
    stompClient = Stomp.over(socket);
    console.log(`소켓 연결을 시도합니다. 서버 주소: ${serverURL}`);

    stompClient.connect(
        {},
        (frame) => {
            console.log('소켓 연결 성공', frame);

            // 서버의 메시지 전송 endpoint를 구독합니다.
            stompClient.subscribe("/sub/chat/room/" + chatRoomId.value, (result) => {
                console.log('구독으로 받은 메시지 입니다.', result.body);

                // 화면에 표시하기 위해 push
                receiveMsg.value.push(JSON.parse(result.body));
            });
        },
        (error) => {
            console.log('소켓 연결 실패', error);
        }
    );
};

// 메시지를 보내는 함수
const sendMessage = (e) => {
    if (e.keyCode === 13 && writer.value !== '' && message.value !== '') {
        send();
        message.value = '';
    }
};

// 실제로 메시지를 전송하는 함수
const send = () => {
    const msg = {
        chatRoomId: chatRoomId.value,
        writer: writer.value,
        message: message.value
    };

    if (stompClient && stompClient.connected) {     // stompClient가 연결되어 있는지 확인
        stompClient.send("/pub/chat/message", JSON.stringify(msg), {});
    }
};

onMounted(() => {
    connect();
});

</script>