<template>
    <div class="container">

        <div class="offcanvas-header border-bottom">
            <h2 class="offcanvas-title">가입한 클럽</h2>
        </div>

        <div class="filter-container">
            <div class="filter-header">
                <span class="filter-title">클럽장</span>
                <span class="mx-2 opacity-50">|</span>

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
        </div>

        <div class="offcanvas shadow dark-mode-shadow-none rounded-3 my-4" data-offcanvas-show="true" tabindex="-1"
            style="position: static; transform: none; visibility: visible;">
            <div class="offcanvas-body" style="max-height: 50rem;">
                <article v-for="(club, index) in filteredClubs" :key="index"
                    class="row g-0 border-0 card-hover card-lifted" style="height: 200px;">
                    <div class="col-sm-4 bg-repeat-0 bg-size-cover bg-position-center rounded-5"
                        :style="{ backgroundImage: `url(${club.imageUrl})` }">
                    </div>

                    <div class="col d-flex flex-column ms-3 pt-1 pb-1">
                        <div class="d-flex align-items-center ps-sm-4 pe-lg-4" style="flex: 1;">
                            <div class="h4 mb-0">{{ club.title }}</div>
                        </div>

                        <div class="d-flex align-items-center ps-sm-4 pe-lg-4" style="flex: 1;">
                            <p class="mb-0 d-sm-none d-md-block">
                                {{ club.description }}
                            </p>
                        </div>

                        <div class="d-flex align-items-center flex-wrap ps-sm-4 pe-lg-4" style="flex: 1;">
                            <span class="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                                :style="{ backgroundImage: `url(${club.authorImage})`, width: '40px', height: '40px' }"></span>
                            <span class="ms-3 fs-sm">{{ club.author }}</span>

                            <span class="opacity-20 mx-3">|</span>
                            <span class="badge text-nav fs-xs border">{{ club.sport }}</span>
                            <span class="opacity-20 mx-3">|</span>
                            <span class="badge text-nav fs-xs border">{{ club.location }}</span>
                        </div>
                    </div>
                </article>

                <!-- 필터링된 결과가 없을 때 표시할 메시지 -->
                <div v-if="filteredClubs.length === 0" class="text-center py-5">
                    <p class="text-muted">표시할 클럽이 없습니다.</p>
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

const selectAuthor = (author) => {
    selectedAuthor.value = author;
};

// (임시) 통신으로 가입한 클럽 list를 가져와야함
const clubs = ref([
    {
        id: 1,
        title: '수원 러닝 챌린지',
        description: '주 2회 공원에서 모여 함께 러닝을 즐깁니다. 초보부터 고수까지 모두 환영하며, 정기적으로 내부 마라톤을 개최합니다.',
        imageUrl: 'assets/img/blog/list/01.jpg',
        author: '러닝요정',
        authorImage: 'assets/img/avatar/01.jpg',
        sport: '러닝',
        location: '수원 영통구'
    },
    {
        id: 2,
        title: '홍대 농구 동호회',
        description: '공격과 수비 모두 즐기는 캐주얼 농구 모임! 실력보다 즐기는 분위기를 중요시합니다.',
        imageUrl: 'assets/img/blog/list/02.jpg',
        author: '슬램덩커',
        authorImage: 'assets/img/avatar/12.jpg',
        sport: '농구',
        location: '서울 마포구'
    },
    {
        id: 3,
        title: '강서구 테니스 클럽',
        description: '직장인 대상 저녁 테니스 모임. 코트 대여부터 매칭까지 전부 제공되는 편한 시스템!',
        imageUrl: 'assets/img/blog/list/03.jpg',
        author: '라켓의정석',
        authorImage: 'assets/img/avatar/08.jpg',
        sport: '테니스',
        location: '서울 강서구'
    },
    {
        id: 4,
        title: '야외 클라이밍 동호회',
        description: '도심을 벗어나 자연 속에서 암벽을 오릅니다. 등산과 캠핑도 함께 즐기며 여유로운 분위기를 추구합니다.',
        imageUrl: 'assets/img/blog/list/04.jpg',
        author: '마운틴러버',
        authorImage: 'assets/img/avatar/06.jpg',
        sport: '클라이밍',
        location: '경기 양평'
    },
    {
        id: 5,
        title: '풋살 번개팀',
        description: '실력 무관! 당일 인원 모집 후 빠르게 경기를 즐기는 풋살 번개팀입니다. 빠른 매치 좋아하는 분들에게 추천!',
        imageUrl: 'assets/img/blog/list/05.jpg',
        author: '즉석경기러',
        authorImage: 'assets/img/avatar/10.jpg',
        sport: '풋살',
        location: '서울 송파구'
    }
]);

// 필터링된 클럽 목록
const filteredClubs = computed(() => {
    if (selectedAuthor.value === 'all') {
        return clubs.value;
    } else if (selectedAuthor.value === 'self') {
        return clubs.value.filter(club => club.author === currentUser.value);
    } else if (selectedAuthor.value === 'others') {
        return clubs.value.filter(club => club.author !== currentUser.value);
    }
    return clubs.value;
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