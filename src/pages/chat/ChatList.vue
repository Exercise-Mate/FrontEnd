<template>
    <div class="container">
        <div class="list-group list-group-horizontal-sm mt-5">
            <div class="list-group-item list-group-item-action text-center" :class="{ active: activeTab === 'club' }"
                @click="activeTab = 'club'">
                클럽
                <span class="badge bg-info ms-1">{{ clubs.length }}</span>
            </div>
            <div class="list-group-item list-group-item-action text-center"
                :class="{ active: activeTab === 'appointment' }" @click="activeTab = 'appointment'">
                약속
                <span class="badge bg-info ms-1">{{ appointments.length }}</span>
            </div>
        </div>

        <div class="mt-5">
            <div class="d-sm-flex align-items-center row g-0 border-0 card-hover card-lifted mb-5"
                v-for="chat in currentChats" :key="chat.id" @click="goToChatDetail(chat.id)" style="cursor: pointer;">
                <div class="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                    style="width: 100px; height: 100px;" :style="{ backgroundImage: `url(${chat.imgUrl})` }"></div>

                <div class="col d-flex flex-column ms-3 pt-1 pb-1">
                    <div class="d-flex align-items-center ps-sm-4 pe-lg-4" style="flex: 1;">
                        <div class="h4 mb-0">{{ chat.name }}</div>
                        <span class="ai-user-check lead ms-5"></span>
                        <span class="fw-bold ms-1 mt-1">{{ chat.members }}</span>
                        <div class="ms-auto text-muted">{{ chat.time }}</div>
                    </div>

                    <div class="d-flex align-items-center ps-sm-4 pe-lg-4 mt-3" style="flex: 1;">
                        <p class="mb-0 d-sm-none d-md-block flex-grow-1">
                            {{ chat.message }}
                        </p>
                        <span class="badge bg-danger ms-3" v-if="chat.unreadCount > 0">{{ chat.unreadCount }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToChatDetail = (id) => {
  router.push(`/chat/${id}`)
}

const activeTab = ref('club')

// (임시) api호출해서 가져와야함
const clubs = ref([
    {
        id: 1,
        name: 'DM 클라이밍 크루',
        members: 5,
        time: '15:01',
        message: '클라이밍 약속 만드려고 하는데, 낼 토요일 오후 2시로 만들면 많이들 참석하실까요~~~?',
        unreadCount: 2,
        imgUrl: 'assets/img/blog/list/04.jpg'
    },
    {
        id: 2,
        name: '강남 배드민턴 모임',
        members: 8,
        time: '14:23',
        message: '오늘 저녁 7시 게임 있으니 라켓 꼭 챙기세요!',
        unreadCount: 4,
        imgUrl: 'assets/img/blog/list/01.jpg'
    },
    {
        id: 3,
        name: '주말 농구 크루',
        members: 12,
        time: '13:10',
        message: '이번 주 일요일에 체육관 예약 완료했습니다!',
        unreadCount: 0,
        imgUrl: 'assets/img/blog/list/02.jpg'
    },
    {
        id: 4,
        name: '테니스 러버스',
        members: 6,
        time: '12:45',
        message: '신입 회원 모집 중입니다 :)',
        unreadCount: 1,
        imgUrl: 'assets/img/blog/list/03.jpg'
    },
    {
        id: 5,
        name: '서울 러닝 클럽',
        members: 20,
        time: '11:05',
        message: '이번 주 토요일 오전 9시에 한강 러닝!',
        unreadCount: 5,
        imgUrl: 'assets/img/blog/list/05.jpg'
    },
    {
        id: 6,
        name: '강동 풋살 팀',
        members: 10,
        time: '10:33',
        message: '수요일 밤 9시 경기 있습니다. 유니폼 꼭 착용!',
        unreadCount: 3,
        imgUrl: 'assets/img/blog/list/06.jpg'
    },
])

// (임시) api호출해서 가져와야함
const appointments = ref([
    {
        id: 101,
        name: '5/1 클라이밍 약속',
        members: 4,
        time: '16:10',
        message: '내일 약속 장소는 건대입구역 1번 출구입니다!',
        unreadCount: 1,
        imgUrl: 'assets/img/avatar/03.jpg'
    },
    {
        id: 102,
        name: '5/2 풋살 저녁 모임',
        members: 8,
        time: '18:40',
        message: '풋살장 예약 완료, 7시까지 오세요!',
        unreadCount: 0,
        imgUrl: 'assets/img/avatar/08.jpg'
    },
    {
        id: 103,
        name: '5/3 한강 러닝 번개',
        members: 6,
        time: '07:00',
        message: '아침 7시 반포대교 앞에서 출발합니다.',
        unreadCount: 3,
        imgUrl: 'assets/img/avatar/13.jpg'
    },
    {
        id: 104,
        name: '5/4 테니스 싱글 경기',
        members: 2,
        time: '10:15',
        message: '상암 코트 2번에서 만나요.',
        unreadCount: 0,
        imgUrl: 'assets/img/avatar/01.jpg'
    },
    {
        id: 105,
        name: '5/5 농구 연습 게임',
        members: 10,
        time: '13:30',
        message: '잠실 체육관으로 바로 와주세요!',
        unreadCount: 5,
        imgUrl: 'assets/img/avatar/11.jpg'
    },
    {
        id: 106,
        name: '5/6 클라이밍 초보 모임',
        members: 5,
        time: '15:00',
        message: '초보자 위주로 난이도 낮게 진행합니다~',
        unreadCount: 0,
        imgUrl: 'assets/img/avatar/21.jpg'
    },
    {
        id: 107,
        name: '5/7 배드민턴 토너먼트',
        members: 12,
        time: '17:20',
        message: '팀 조 편성은 현장에서 공지할게요.',
        unreadCount: 2,
        imgUrl: 'assets/img/avatar/19.jpg'
    },
    {
        id: 108,
        name: '5/8 풋살 친선전',
        members: 9,
        time: '19:00',
        message: '유니폼 챙겨오세요! 상대 팀 강해요.',
        unreadCount: 4,
        imgUrl: 'assets/img/avatar/14.jpg'
    },
    {
        id: 109,
        name: '5/9 러닝 후 야식 번개',
        members: 7,
        time: '20:30',
        message: '달리고 돼지국밥 먹으러 갑시다.',
        unreadCount: 0,
        imgUrl: 'assets/img/avatar/05.jpg'
    },
    {
        id: 110,
        name: '5/10 테니스 더블 경기',
        members: 4,
        time: '09:00',
        message: '더블 경기니까 파트너 꼭 정해주세요.',
        unreadCount: 0,
        imgUrl: 'assets/img/avatar/27.jpg'
    },
    {
        id: 111,
        name: '5/11 농구 리그 연습',
        members: 11,
        time: '14:00',
        message: '오늘은 수비 포지션 위주로 연습합니다.',
        unreadCount: 0,
        imgUrl: 'assets/img/avatar/29.jpg'
    },
])

const currentChats = computed(() => {
    return activeTab.value === 'club' ? clubs.value : appointments.value
})

// 새로고침해도 현재 탭 유지
onMounted(() => {
    const savedTab = localStorage.getItem('activeTab')
    if (savedTab === 'appointment') {
        activeTab.value = 'appointment'
    }
})
watch(activeTab, (newVal) => {
    localStorage.setItem('activeTab', newVal)
})

</script>

<style scoped></style>