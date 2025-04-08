<template>
    <div class="my-appointments-page">
        <!-- 헤더 섹션 -->
        <div class="header-section">
            <div class="container">
                <div class="header-content">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="page-title">내가 생성한 약속</h1>
                            <p class="page-subtitle">총 <span class="appointment-count">{{ activeAppointments.length +
                                pastAppointments.length }}</span>개의 약속</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-secondary d-flex align-items-center gap-2"
                                @click="refreshAppointments">
                                <i class="bi bi-arrow-repeat"></i>
                                <span class="d-none d-md-inline">새로고침</span>
                            </button>
                            <button class="btn btn-custom-primary d-flex align-items-center gap-2"
                                @click="createNewAppointment">
                                <i class="bi bi-plus-lg"></i>
                                <span class="d-none d-md-inline">새 약속 생성</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 탭 네비게이션 -->
        <div class="tab-section">
            <div class="container">
                <ul class="nav nav-tabs" id="appointmentTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="active-tab" data-bs-toggle="tab"
                            data-bs-target="#active-appointments" type="button" role="tab"
                            aria-controls="active-appointments" aria-selected="true">
                            모집 중 <span class="badge bg-custom-primary ms-2">{{ activeAppointments.length }}</span>
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="past-tab" data-bs-toggle="tab" data-bs-target="#past-appointments"
                            type="button" role="tab" aria-controls="past-appointments" aria-selected="false">
                            종료됨 <span class="badge bg-secondary ms-2">{{ pastAppointments.length }}</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 약속 목록 섹션 -->
        <div class="appointments-section">
            <div class="container">
                <div class="tab-content" id="appointmentTabsContent">
                    <!-- 모집 중인 약속 탭 -->
                    <div class="tab-pane fade show active" id="active-appointments" role="tabpanel"
                        aria-labelledby="active-tab">
                        <!-- 검색 및 필터 -->
                        <div class="search-filter-container">
                            <div class="search-container">
                                <i class="bi bi-search search-icon"></i>
                                <input type="text" class="search-input" placeholder="약속 검색" v-model="activeSearchQuery">
                            </div>
                            <div class="filter-container">
                                <select class="filter-select" v-model="activeFilter">
                                    <option value="all">모든 종목</option>
                                    <option value="climbing">클라이밍</option>
                                    <option value="running">러닝</option>
                                    <option value="soccer">축구</option>
                                    <option value="tennis">테니스</option>
                                </select>
                                <select class="filter-select" v-model="activeSort">
                                    <option value="newest">최신순</option>
                                    <option value="oldest">오래된순</option>
                                    <option value="participants">참여자 많은순</option>
                                </select>
                            </div>
                        </div>

                        <!-- 모집 중인 약속 목록 -->
                        <div class="appointments-list" v-if="filteredActiveAppointments.length > 0">
                            <div v-for="appointment in filteredActiveAppointments" :key="appointment.id"
                                class="appointment-card">
                                <div class="appointment-image-container">
                                    <img :src="appointment.image" :alt="appointment.title" class="appointment-image">
                                    <div class="appointment-status active">모집중</div>
                                </div>
                                <div class="appointment-content">
                                    <div class="appointment-header">
                                        <div class="appointment-category">{{ appointment.category }}</div>
                                        <h3 class="appointment-title">{{ appointment.title }}</h3>
                                        <div class="appointment-date">
                                            <i class="bi bi-calendar3"></i>
                                            <span>{{ appointment.date }}</span>
                                        </div>
                                    </div>
                                    <div class="appointment-info">
                                        <div class="info-item">
                                            <i class="bi bi-geo-alt"></i>
                                            <span>{{ appointment.location }}</span>
                                        </div>
                                        <div class="info-item">
                                            <i class="bi bi-people"></i>
                                            <span>{{ appointment.participants.current }}/{{ appointment.participants.max
                                            }}명</span>
                                        </div>
                                        <div class="progress participation-progress">
                                            <div class="progress-bar bg-custom-primary" role="progressbar"
                                                :style="`width: ${(appointment.participants.current / appointment.participants.max) * 100}%`"
                                                :aria-valuenow="appointment.participants.current" aria-valuemin="0"
                                                :aria-valuemax="appointment.participants.max"></div>
                                        </div>
                                    </div>
                                    <div class="appointment-stats">
                                        <div class="stat-item">
                                            <i class="bi bi-eye"></i>
                                            <span>{{ appointment.views }}</span>
                                        </div>
                                        <div class="stat-item">
                                            <i class="bi bi-chat-dots"></i>
                                            <span>{{ appointment.comments }}</span>
                                        </div>
                                        <div class="stat-item">
                                            <i class="bi bi-bookmark"></i>
                                            <span>{{ appointment.bookmarks }}</span>
                                        </div>
                                    </div>
                                    <div class="appointment-actions">
                                        <button class="btn btn-outline-secondary btn-sm"
                                            @click="viewAppointment(appointment.id)">
                                            <i class="bi bi-eye"></i> 상세보기
                                        </button>
                                        <button class="btn btn-outline-custom-primary btn-sm"
                                            @click="viewApplicants(appointment.id)">
                                            <i class="bi bi-people"></i> 신청자 ({{ appointment.applicants }})
                                        </button>
                                        <button class="btn btn-custom-primary btn-sm"
                                            @click="editAppointment(appointment.id)">
                                            <i class="bi bi-pencil"></i> 수정
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 모집 중인 약속이 없는 경우 -->
                        <div class="empty-state" v-else>
                            <div class="empty-icon">
                                <i class="bi bi-calendar-x"></i>
                            </div>
                            <h3 class="empty-title">모집 중인 약속이 없습니다</h3>
                            <p class="empty-description">새로운 약속을 생성해보세요!</p>
                            <button class="btn btn-custom-primary" @click="createNewAppointment">
                                <i class="bi bi-plus-lg me-2"></i> 새 약속 생성
                            </button>
                        </div>
                    </div>

                    <!-- 종료된 약속 탭 -->
                    <div class="tab-pane fade" id="past-appointments" role="tabpanel" aria-labelledby="past-tab">
                        <!-- 검색 및 필터 -->
                        <div class="search-filter-container">
                            <div class="search-container">
                                <i class="bi bi-search search-icon"></i>
                                <input type="text" class="search-input" placeholder="약속 검색" v-model="pastSearchQuery">
                            </div>
                            <div class="filter-container">
                                <select class="filter-select" v-model="pastFilter">
                                    <option value="all">모든 종목</option>
                                    <option value="climbing">클라이밍</option>
                                    <option value="running">러닝</option>
                                    <option value="soccer">축구</option>
                                    <option value="tennis">테니스</option>
                                </select>
                                <select class="filter-select" v-model="pastSort">
                                    <option value="newest">최신순</option>
                                    <option value="oldest">오래된순</option>
                                    <option value="participants">참여자 많은순</option>
                                </select>
                            </div>
                        </div>

                        <!-- 종료된 약속 목록 -->
                        <div class="appointments-list" v-if="filteredPastAppointments.length > 0">
                            <div v-for="appointment in filteredPastAppointments" :key="appointment.id"
                                class="appointment-card past">
                                <div class="appointment-image-container">
                                    <img :src="appointment.image" :alt="appointment.title" class="appointment-image">
                                    <div class="appointment-status completed">종료됨</div>
                                </div>
                                <div class="appointment-content">
                                    <div class="appointment-header">
                                        <div class="appointment-category">{{ appointment.category }}</div>
                                        <h3 class="appointment-title">{{ appointment.title }}</h3>
                                        <div class="appointment-date">
                                            <i class="bi bi-calendar3"></i>
                                            <span>{{ appointment.date }}</span>
                                        </div>
                                    </div>
                                    <div class="appointment-info">
                                        <div class="info-item">
                                            <i class="bi bi-geo-alt"></i>
                                            <span>{{ appointment.location }}</span>
                                        </div>
                                        <div class="info-item">
                                            <i class="bi bi-people"></i>
                                            <span>{{ appointment.participants.current }}/{{ appointment.participants.max
                                            }}명 참여</span>
                                        </div>
                                    </div>
                                    <div class="appointment-stats">
                                        <div class="stat-item">
                                            <i class="bi bi-eye"></i>
                                            <span>{{ appointment.views }}</span>
                                        </div>
                                        <div class="stat-item">
                                            <i class="bi bi-chat-dots"></i>
                                            <span>{{ appointment.comments }}</span>
                                        </div>
                                        <div class="stat-item">
                                            <i class="bi bi-bookmark"></i>
                                            <span>{{ appointment.bookmarks }}</span>
                                        </div>
                                    </div>
                                    <div class="appointment-actions">
                                        <button class="btn btn-outline-secondary btn-sm"
                                            @click="viewAppointment(appointment.id)">
                                            <i class="bi bi-eye"></i> 상세보기
                                        </button>
                                        <button class="btn btn-outline-custom-primary btn-sm"
                                            @click="viewParticipants(appointment.id)"
                                            :disabled="appointment.participants.current === 0">
                                            <i class="bi bi-people"></i> 참여자 ({{ appointment.participants.current }})
                                        </button>
                                        <button class="btn btn-custom-primary btn-sm"
                                            @click="reviewParticipants(appointment.id)"
                                            :disabled="appointment.reviewed || appointment.participants.current === 0">
                                            <i class="bi bi-star"></i> {{ appointment.reviewed ? '평가 완료' : '참여자 평가' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 종료된 약속이 없는 경우 -->
                        <div class="empty-state" v-else>
                            <div class="empty-icon">
                                <i class="bi bi-calendar-check"></i>
                            </div>
                            <h3 class="empty-title">종료된 약속이 없습니다</h3>
                            <p class="empty-description">아직 종료된 약속이 없습니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 하단 네비게이션 -->
        <div class="bottom-nav d-md-none">
            <div class="bottom-nav-item">
                <i class="bi bi-house"></i>
                <span>홈</span>
            </div>
            <div class="bottom-nav-item active">
                <i class="bi bi-calendar2-check"></i>
                <span>내 약속</span>
            </div>
            <div class="bottom-nav-item">
                <i class="bi bi-plus-circle-fill"></i>
                <span>생성</span>
            </div>
            <div class="bottom-nav-item">
                <i class="bi bi-chat"></i>
                <span>채팅</span>
            </div>
            <div class="bottom-nav-item">
                <i class="bi bi-person"></i>
                <span>프로필</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 검색 및 필터 상태
const activeSearchQuery = ref('');
const activeFilter = ref('all');
const activeSort = ref('newest');
const pastSearchQuery = ref('');
const pastFilter = ref('all');
const pastSort = ref('newest');

// 모집 중인 약속 데이터 (실제로는 API에서 가져올 것)
const activeAppointments = ref([
    {
        id: 1,
        title: '오늘 클라이밍 한탕 뛰자',
        category: '클라이밍',
        date: '2024년 04월 15일 (월) 19:00',
        location: '서울시 동작구 클라이밍 센터',
        image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        participants: {
            current: 5,
            max: 8
        },
        views: 120,
        comments: 8,
        bookmarks: 12,
        applicants: 7,
        categoryKey: 'climbing'
    },
    {
        id: 2,
        title: '한강 러닝 크루 모집합니다',
        category: '러닝',
        date: '2024년 04월 18일 (목) 18:00',
        location: '서울시 서초구 반포한강공원',
        image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        participants: {
            current: 8,
            max: 15
        },
        views: 95,
        comments: 5,
        bookmarks: 7,
        applicants: 10,
        categoryKey: 'running'
    },
    {
        id: 3,
        title: '주말 테니스 한 판 어때요?',
        category: '테니스',
        date: '2024년 04월 20일 (토) 10:00',
        location: '서울시 강남구 테니스장',
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        participants: {
            current: 2,
            max: 4
        },
        views: 65,
        comments: 3,
        bookmarks: 5,
        applicants: 3,
        categoryKey: 'tennis'
    }
]);

// 종료된 약속 데이터 (실제로는 API에서 가져올 것)
const pastAppointments = ref([
    {
        id: 101,
        title: '축구 한 판 어때요?',
        category: '축구',
        date: '2024년 03월 25일 (토) 15:00',
        location: '서울시 송파구 잠실종합운동장',
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        participants: {
            current: 10,
            max: 12
        },
        views: 150,
        comments: 12,
        bookmarks: 18,
        reviewed: true,
        categoryKey: 'soccer'
    },
    {
        id: 102,
        title: '클라이밍 초보 환영',
        category: '클라이밍',
        date: '2024년 03월 18일 (토) 14:00',
        location: '서울시 마포구 클라이밍 센터',
        image: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        participants: {
            current: 6,
            max: 8
        },
        views: 110,
        comments: 7,
        bookmarks: 9,
        reviewed: false,
        categoryKey: 'climbing'
    },
    {
        id: 103,
        title: '아침 러닝 함께해요',
        category: '러닝',
        date: '2024년 03월 10일 (일) 07:00',
        location: '서울시 영등포구 여의도한강공원',
        image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        participants: {
            current: 3,
            max: 10
        },
        views: 75,
        comments: 2,
        bookmarks: 4,
        reviewed: true,
        categoryKey: 'running'
    },
    {
        id: 104,
        title: '테니스 레슨 모임',
        category: '테니스',
        date: '2024년 02월 28일 (수) 19:00',
        location: '서울시 서초구 테니스장',
        image: 'https://images.unsplash.com/photo-1622279457486-28f24ae637a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        participants: {
            current: 4,
            max: 6
        },
        views: 90,
        comments: 6,
        bookmarks: 8,
        reviewed: false,
        categoryKey: 'tennis'
    }
]);

// 필터링된 모집 중인 약속 목록
const filteredActiveAppointments = computed(() => {
    let result = [...activeAppointments.value];

    // 검색어 필터링
    if (activeSearchQuery.value) {
        const query = activeSearchQuery.value.toLowerCase();
        result = result.filter(appointment =>
            appointment.title.toLowerCase().includes(query) ||
            appointment.category.toLowerCase().includes(query) ||
            appointment.location.toLowerCase().includes(query)
        );
    }

    // 카테고리 필터링
    if (activeFilter.value !== 'all') {
        result = result.filter(appointment => appointment.categoryKey === activeFilter.value);
    }

    // 정렬
    switch (activeSort.value) {
        case 'newest':
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            result.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'participants':
            result.sort((a, b) => b.participants.current - a.participants.current);
            break;
    }

    return result;
});

// 필터링된 종료된 약속 목록
const filteredPastAppointments = computed(() => {
    let result = [...pastAppointments.value];

    // 검색어 필터링
    if (pastSearchQuery.value) {
        const query = pastSearchQuery.value.toLowerCase();
        result = result.filter(appointment =>
            appointment.title.toLowerCase().includes(query) ||
            appointment.category.toLowerCase().includes(query) ||
            appointment.location.toLowerCase().includes(query)
        );
    }

    // 카테고리 필터링
    if (pastFilter.value !== 'all') {
        result = result.filter(appointment => appointment.categoryKey === pastFilter.value);
    }

    // 정렬
    switch (pastSort.value) {
        case 'newest':
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            result.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'participants':
            result.sort((a, b) => b.participants.current - a.participants.current);
            break;
    }

    return result;
});

// 약속 새로고침
const refreshAppointments = () => {
    // 실제로는 API 호출하여 데이터 새로고침
    console.log('약속 목록 새로고침');
};

// 새 약속 생성
const createNewAppointment = () => {
    router.push('/appointments/create');
};

// 약속 상세 보기
const viewAppointment = (id) => {
    router.push(`/appointments/${id}`);
};

// 신청자 보기
const viewApplicants = (id) => {
    router.push(`/appointments/${id}/applicants`);
};

// 약속 수정
const editAppointment = (id) => {
    router.push(`/appointments/${id}/edit`);
};

// 참여자 보기
const viewParticipants = (id) => {
    router.push(`/appointments/${id}/participants`);
};

// 참여자 평가
const reviewParticipants = (id) => {
    router.push(`/appointments/${id}/review`);
};
</script>

<style scoped>
/* 전체 페이지 스타일 */
.my-appointments-page {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding-bottom: 80px;
}

/* 헤더 섹션 스타일 */
.header-section {
    background-color: white;
    padding: 2rem 0;
    margin-bottom: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
}

.page-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #333;
}

.page-subtitle {
    color: #6c757d;
    margin-bottom: 0;
}

.appointment-count {
    font-weight: 600;
    color: #37715D;
}

/* 탭 네비게이션 스타일 */
.tab-section {
    margin-bottom: 1.5rem;
}

.nav-tabs {
    border-bottom: 1px solid #dee2e6;
}

.nav-tabs .nav-link {
    color: #6c757d;
    border: none;
    padding: 1rem 1.5rem;
    font-weight: 500;
    position: relative;
}

.nav-tabs .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: transparent;
    transition: all 0.2s ease;
}

.nav-tabs .nav-link.active {
    color: #37715D;
    background-color: transparent;
    border: none;
}

.nav-tabs .nav-link.active::after {
    background-color: #37715D;
}

.nav-tabs .badge {
    font-weight: 500;
    font-size: 0.75rem;
}

/* 검색 및 필터 스타일 */
.search-filter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    background-color: white;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
}

.search-container {
    position: relative;
    flex: 1;
    max-width: 400px;
}

.search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #adb5bd;
}

.search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #dee2e6;
    border-radius: 2rem;
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.search-input:focus {
    outline: none;
    border-color: #37715D;
    box-shadow: 0 0 0 0.2rem rgba(55, 113, 93, 0.15);
}

.filter-container {
    display: flex;
    gap: 0.75rem;
}

.filter-select {
    padding: 0.5rem 1rem;
    border: 1px solid #dee2e6;
    border-radius: 2rem;
    font-size: 0.9rem;
    background-color: white;
    color: #495057;
}

.filter-select:focus {
    outline: none;
    border-color: #37715D;
    box-shadow: 0 0 0 0.2rem rgba(55, 113, 93, 0.15);
}

/* 약속 목록 스타일 */
.appointments-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.appointment-card {
    background-color: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.appointment-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.appointment-card.past {
    opacity: 0.85;
}

.appointment-image-container {
    position: relative;
    height: 160px;
    overflow: hidden;
}

.appointment-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.appointment-card:hover .appointment-image {
    transform: scale(1.05);
}

.appointment-status {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.35rem 0.75rem;
    border-radius: 2rem;
    font-size: 0.8rem;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.appointment-status.active {
    background-color: #37715D;
    color: white;
}

.appointment-status.completed {
    background-color: #6c757d;
    color: white;
}

.appointment-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.appointment-header {
    margin-bottom: 1rem;
}

.appointment-category {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: white;
    background-color: #37715D;
    margin-bottom: 0.75rem;
}

.appointment-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #333;
    line-height: 1.3;
}

.appointment-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c757d;
    font-size: 0.9rem;
}

.appointment-info {
    margin-bottom: 1rem;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: #495057;
    font-size: 0.9rem;
}

.info-item i {
    color: #37715D;
}

.participation-progress {
    height: 0.5rem;
    border-radius: 1rem;
    background-color: #e9ecef;
    margin-top: 0.5rem;
}

.appointment-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid #f1f3f5;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c757d;
    font-size: 0.85rem;
}

.appointment-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
}

/* 빈 상태 스타일 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
    text-align: center;
}

.empty-icon {
    font-size: 3.5rem;
    color: #dee2e6;
    margin-bottom: 1.5rem;
}

.empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #333;
}

.empty-description {
    color: #6c757d;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
}

/* 하단 네비게이션 스타일 */
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: white;
    display: flex;
    justify-content: space-around;
    padding: 0.75rem 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    z-index: 1000;
}

.bottom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #adb5bd;
    font-size: 0.7rem;
}

.bottom-nav-item i {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
}

.bottom-nav-item.active {
    color: #37715D;
}

/* 커스텀 색상 클래스 */
.custom-primary {
    color: #37715D !important;
}

.bg-custom-primary {
    background-color: #37715D !important;
}

.btn-custom-primary {
    background-color: #37715D !important;
    border-color: #37715D !important;
    color: white !important;
}

.btn-custom-primary:hover {
    background-color: #2c5a4a !important;
    border-color: #2c5a4a !important;
}

.btn-outline-custom-primary {
    color: #37715D !important;
    border-color: #37715D !important;
}

.btn-outline-custom-primary:hover {
    background-color: #37715D !important;
    color: white !important;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
    .header-section {
        padding: 1.5rem 0;
    }

    .page-title {
        font-size: 1.5rem;
    }

    .search-filter-container {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    .search-container {
        width: 100%;
        max-width: none;
    }

    .filter-container {
        width: 100%;
    }

    .filter-select {
        flex: 1;
    }

    .appointments-list {
        grid-template-columns: 1fr;
    }

    .appointment-actions {
        flex-wrap: wrap;
    }

    .appointment-actions button {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>