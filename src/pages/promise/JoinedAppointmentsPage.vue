<template>
    <div class="container">
        <div class="offcanvas-header border-bottom">
            <h2 class="offcanvas-title">참여한 약속</h2>
        </div>

        <div class="filter-container">
            <div class="filter-header">
                <span class="filter-title" style="margin-left: 6px;">약속장</span>
                <span class="opacity-50" style="margin-left: 16px; margin-right: 8px">|</span>

                <span class="toggle-buttons">
                    <button class="toggle-button" :class="{ 'active': selectedAuthor === 'all' }"
                        @click="selectAuthor('all')">
                        모두
                    </button>
                    <button class="toggle-button" :class="{ 'active': selectedAuthor === 'self' }"
                        @click="selectAuthor('self')">
                        자신
                    </button>
                    <button class="toggle-button" :class="{ 'active': selectedAuthor === 'others' }"
                        @click="selectAuthor('others')">
                        타인
                    </button>
                </span>
            </div>

            <div class="filter-header" style="margin-top: 15px">
                <span class="filter-title">평가여부</span>
                <span class="mx-2 opacity-50">|</span>

                <span class="toggle-buttons">
                    <button class="toggle-button" :class="{ 'active': selectedIsEvaluated === null }"
                        @click="selectIsEvaluated(null)">
                        모두
                    </button>
                    <button class="toggle-button" :class="{ 'active': selectedIsEvaluated === true }"
                        @click="selectIsEvaluated(true)">
                        완료
                    </button>
                    <button class="toggle-button" :class="{ 'active': selectedIsEvaluated === false }"
                        @click="selectIsEvaluated(false)">
                        미완료
                    </button>
                </span>
            </div>
        </div>

        <div class="offcanvas shadow dark-mode-shadow-none rounded-3 my-4" data-offcanvas-show="true" tabindex="-1"
            style="position: static; transform: none; visibility: visible;">
            <div class="offcanvas-body" style="max-height: 50rem;">
                <article v-for="(appointment, index) in filteredAppointments" :key="index"
                    class="row g-0 border-0 card-hover card-lifted" style="height: 200px;">
                    <div class="col-sm-4 bg-repeat-0 bg-size-cover bg-position-center rounded-5"
                        :style="{ backgroundImage: `url(${appointment.imageUrl})` }">
                    </div>

                    <div class="col d-flex flex-column ms-3 pt-1 pb-1">
                        <div class="d-flex align-items-center ps-sm-4 pe-lg-4" style="flex: 1;">
                            <div class="h4 mb-0">{{ appointment.title }}</div>
                            <span class="ai-user-check lead ms-3"></span>
                            <span class="fw-bold ms-1 mt-1">{{ appointment.participantCount }} / {{
                                appointment.participantLimit }}</span>
                            <button v-if="!appointment.isEvaluated" type="button"
                                class="btn btn-success btn-sm ms-auto">평가하기</button>
                        </div>

                        <div class="d-flex align-items-center ps-sm-4 pe-lg-4" style="flex: 1;">
                            <p class="mb-0 d-sm-none d-md-block">
                                {{ appointment.description }}
                            </p>
                        </div>

                        <div class="d-flex align-items-center flex-wrap ps-sm-4 pe-lg-4" style="flex: 1;">
                            <span class="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                                :style="{ backgroundImage: `url(${appointment.authorImage})`, width: '40px', height: '40px' }"></span>
                            <span class="ms-3 fs-sm">{{ appointment.author }}</span>

                            <span class="opacity-20 mx-3">|</span>
                            <span class="badge text-nav fs-xs border">{{ appointment.sport }}</span>
                            <span class="opacity-20 mx-3">|</span>
                            <span class="badge text-nav fs-xs border">{{ appointment.location }}</span>
                            <span class="opacity-20 mx-3">|</span>
                            <span class="badge text-nav fs-xs border">{{ appointment.createdAt }}</span>
                        </div>
                    </div>
                </article>

                <!-- 필터링된 결과가 없을 때 표시할 메시지 -->
                <div v-if="filteredAppointments.length === 0" class="text-center py-5">
                    <p class="text-muted">표시할 약속이 없습니다.</p>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, computed } from 'vue';

// (임시) 현재 로그인한 사용자의 닉네임
const currentUser = ref('슬램덩커');

const selectedAuthor = ref('all'); // 기본값으로 '모두' 선택
const selectedIsEvaluated = ref(null); // 기본값으로 null(모두) 선택

const selectAuthor = (author) => {
    selectedAuthor.value = author;
};

const selectIsEvaluated = (isEvaluated) => {
    selectedIsEvaluated.value = isEvaluated;
};

// (임시) 통신으로 참여한 약속 list를 가져와야함
const appointments = ref([
    {
        id: 1,
        title: '4일 금요일 호수공원 러닝 뛰실 분',
        description: '호수공원에서 함께 러닝할 분을 모집합니다. 제가 잘 못해서.. 페이스 맞춰서 뛰실 초보분들 환영해요. 6분 페이스정도요',
        imageUrl: 'assets/img/blog/list/04.jpg',
        author: '러닝요정',
        authorImage: 'assets/img/avatar/03.jpg',
        sport: '러닝',
        location: '수원 영통구',
        createdAt: '2025-04-01 10:30',
        isEvaluated: false,
        participantCount: 3,
        participantLimit: 10
    },
    {
        id: 2,
        title: '3:3이나 4:4 농구, 즐기며 플레이!',
        description: '내일 저녁 서울 마포구 홍대 근처에서 캐주얼 농구 함께 하실 분! 실력보다 즐기는 분위기를 중요시하는 약속입니다.',
        imageUrl: 'assets/img/blog/list/06.jpg',
        author: '슬램덩커',
        authorImage: 'assets/img/avatar/09.jpg',
        sport: '농구',
        location: '서울 마포구',
        createdAt: '2025-04-02 14:15',
        isEvaluated: true,
        participantCount: 5,
        participantLimit: 7
    },
    {
        id: 3,
        title: '주말에 2:2 테니스 치실 분',
        description: '서울 강서구 테니스 코트에서 주말 저녁 약속을 진행합니다. 코트 예약과 매칭이 준비된 편한 운동 약속이에요.',
        imageUrl: 'assets/img/blog/list/05.jpg',
        author: '라켓의정석',
        authorImage: 'assets/img/avatar/14.jpg',
        sport: '테니스',
        location: '서울 강서구',
        createdAt: '2025-04-03 18:00',
        isEvaluated: true,
        participantCount: 3,
        participantLimit: 3
    },
    {
        id: 4,
        title: '다음주 주말 낮에 야외 클라이밍장 가실 분',
        description: '경기 양평에서 야외 암벽 클라이밍 하실 분 모집! 클라이밍과 함께 캠핑·등산도 함께 즐기는 여유로운 약속입니다.',
        imageUrl: 'assets/img/blog/list/03.jpg',
        author: '마운틴러버',
        authorImage: 'assets/img/avatar/06.jpg',
        sport: '클라이밍',
        location: '경기 양평',
        createdAt: '2025-04-04 09:45',
        isEvaluated: false,
        participantCount: 5,
        participantLimit: 10
    },
    {
        id: 5,
        title: '풋살 번개 구해요. 오늘 저녁 8시',
        description: '서울 송파구 풋살장 번개 모집! 빠르게 모여 경기를 즐기는 즉석 약속입니다. 실력 무관, 경기만 즐기고 싶은 분 환영!',
        imageUrl: 'assets/img/blog/list/01.jpg',
        author: '즉석경기러',
        authorImage: 'assets/img/avatar/10.jpg',
        sport: '풋살',
        location: '서울 송파구',
        createdAt: '2025-04-05 19:20',
        isEvaluated: true,
        participantCount: 5,
        participantLimit: 9
    }
]);

// 필터링된 약속 목록
const filteredAppointments = computed(() => {
    let result = appointments.value;

    // 작성자 필터
    if (selectedAuthor.value === 'self') {
        result = result.filter(appointment => appointment.author === currentUser.value);
    } else if (selectedAuthor.value === 'others') {
        result = result.filter(appointment => appointment.author !== currentUser.value);
    }

    // 평가 여부 필터
    if (selectedIsEvaluated.value === true) {
        result = result.filter(appointment => appointment.isEvaluated === true);
    } else if (selectedIsEvaluated.value === false) {
        result = result.filter(appointment => appointment.isEvaluated === false);
    }

    return result;
});

</script>

<style scoped>
.offcanvas-header {
    margin-top: 20px;
    padding-bottom: 10px;
}

.filter-container {
    max-width: 500px;
    margin-top: 20px;
}

.filter-header {
    display: flex;
    align-items: center;
    gap: 15px;
}

.filter-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
}

.divider {
    color: #ccc;
    font-weight: 300;
}

.toggle-buttons {
    display: flex;
    gap: 10px;
}

.toggle-button {
    padding: 3px 20px;
    border-radius: 50px;
    border: 1px solid #e0e0e0;
    background-color: white;
    color: #333;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
}

.toggle-button.active {
    background-color: #5a8a73;
    color: white;
    border-color: #5a8a73;
}

.toggle-button:hover:not(.active) {
    background-color: #f5f5f5;
}

article {
    margin-bottom: 25px;
}
</style>