<template>
    <div class="my-clubs-page">

        <!-- 헤더 섹션 -->
        <div class="header-section">
            <div class="container">
                <div class="header-content">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="page-title">내 클럽</h1>
                            <p class="page-subtitle">가입한 클럽 <span class="club-count">{{ clubs.length }}</span>개</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-secondary">
                                <i class="bi bi-funnel me-1"></i> 필터
                            </button>
                            <button class="btn btn-custom-primary">
                                <i class="bi bi-plus-lg me-1"></i> 클럽 찾기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 클럽 목록 섹션 -->
        <div class="clubs-section">
            <div class="container">
                <!-- 검색 및 정렬 -->
                <div class="search-sort-container">
                    <div class="search-container">
                        <i class="bi bi-search search-icon"></i>
                        <input type="text" class="search-input" placeholder="클럽 검색" v-model="searchQuery">
                    </div>
                    <div class="sort-container">
                        <label class="sort-label">정렬:</label>
                        <select class="sort-select" v-model="sortOption">
                            <option value="newest">최신순</option>
                            <option value="oldest">오래된순</option>
                            <option value="name">이름순</option>
                            <option value="members">회원 많은순</option>
                        </select>
                    </div>
                </div>

                <!-- 클럽 카드 목록 -->
                <div class="club-list" v-if="filteredClubs.length > 0">
                    <div v-for="club in filteredClubs" :key="club.id" class="club-card"
                        @click="goToClubDetail(club.id)">
                        <div class="club-image-container">
                            <img :src="club.image" :alt="club.name" class="club-image">
                        </div>
                        <div class="club-content">
                            <div class="club-header">
                                <h3 class="club-name">{{ club.name }}</h3>
                                <div class="club-members">
                                    <i class="bi bi-people-fill"></i>
                                    <span>{{ club.members }}명</span>
                                </div>
                            </div>

                            <div class="club-info">
                                <div class="info-item">
                                    <div class="info-label">운동 종류</div>
                                    <div class="info-value">
                                        <span class="sport-badge" :class="getSportClass(club.sport)">{{ club.sport
                                        }}</span>
                                    </div>
                                </div>

                                <div class="info-item">
                                    <div class="info-label">지역</div>
                                    <div class="info-value">{{ club.location }}</div>
                                </div>

                                <div class="info-item">
                                    <div class="info-label">실력 수준</div>
                                    <div class="info-value">
                                        <span class="skill-badge">{{ getSkillText(club.skillLevel) }}</span>
                                    </div>
                                </div>

                                <div class="info-item">
                                    <div class="info-label">나이대</div>
                                    <div class="info-value">{{ club.ageRange }}</div>
                                </div>
                            </div>

                            <div class="club-footer">
                                <div class="club-activity" :class="getActivityClass(club.activityLevel)">
                                    <i class="bi bi-circle-fill"></i>
                                    <span>{{ getActivityText(club.activityLevel) }}</span>
                                </div>
                                <div class="club-joined-date">가입일: {{ club.joinedDate }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 클럽이 없는 경우 -->
                <div v-else class="empty-state">
                    <div class="empty-icon">
                        <i class="bi bi-people"></i>
                    </div>
                    <h3 class="empty-title">가입한 클럽이 없습니다</h3>
                    <p class="empty-description">새로운 클럽을 찾아 가입해보세요!</p>
                    <button class="btn btn-custom-primary btn-lg">
                        <i class="bi bi-search me-2"></i> 클럽 찾기
                    </button>
                </div>
            </div>
        </div>

        <!-- 추천 클럽 섹션 -->
        <div class="recommended-section" v-if="recommendedClubs.length > 0">
            <div class="container">
                <h2 class="section-title">추천 클럽</h2>
                <p class="section-subtitle">내 관심사와 지역에 맞는 클럽을 추천해드려요</p>

                <div class="recommended-list">
                    <div v-for="club in recommendedClubs" :key="club.id" class="recommended-card">
                        <div class="recommended-image-container">
                            <img :src="club.image" :alt="club.name" class="recommended-image">
                        </div>
                        <div class="recommended-content">
                            <h4 class="recommended-name">{{ club.name }}</h4>
                            <div class="recommended-sport">{{ club.sport }}</div>
                            <div class="recommended-location">{{ club.location }}</div>
                            <div class="recommended-members">회원 {{ club.members }}명</div>
                            <button class="btn btn-sm btn-outline-custom-primary mt-2">자세히 보기</button>
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
                <i class="bi bi-people-fill"></i>
                <span>클럽</span>
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
const searchQuery = ref('');
const sortOption = ref('newest');

// 가입한 클럽 데이터 (실제로는 API에서 가져올 것)
const clubs = ref([
    {
        id: 1,
        name: 'DM 클라이밍 크루',
        image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        members: 42,
        sport: '클라이밍',
        location: '서울시 동작구',
        skillLevel: 3, // 1-5 (초보-전문가)
        ageRange: '20대-40대',
        activityLevel: 'active', // active, moderate, inactive
        joinedDate: '2023-12-15'
    },
    {
        id: 2,
        name: '한강 러닝 크루',
        image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        members: 78,
        sport: '러닝',
        location: '서울시 서초구',
        skillLevel: 2, // 1-5 (초보-전문가)
        ageRange: '전 연령',
        activityLevel: 'active', // active, moderate, inactive
        joinedDate: '2024-01-23'
    },
    {
        id: 3,
        name: '강남 테니스 모임',
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        members: 24,
        sport: '테니스',
        location: '서울시 강남구',
        skillLevel: 4, // 1-5 (초보-전문가)
        ageRange: '30대-40대',
        activityLevel: 'moderate', // active, moderate, inactive
        joinedDate: '2023-09-05'
    },
    {
        id: 4,
        name: '주말 축구 동호회',
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        members: 32,
        sport: '축구',
        location: '서울시 송파구',
        skillLevel: 3, // 1-5 (초보-전문가)
        ageRange: '20대-30대',
        activityLevel: 'inactive', // active, moderate, inactive
        joinedDate: '2023-06-10'
    }
]);

// 추천 클럽 데이터
const recommendedClubs = ref([
    {
        id: 101,
        name: '서울 요가 클럽',
        image: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        members: 56,
        sport: '요가',
        location: '서울시 강남구'
    },
    {
        id: 102,
        name: '동작구 배드민턴 클럽',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        members: 38,
        sport: '배드민턴',
        location: '서울시 동작구'
    },
    {
        id: 103,
        name: '서초 수영 동호회',
        image: 'https://images.unsplash.com/photo-1560090995-01632a28895b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        members: 45,
        sport: '수영',
        location: '서울시 서초구'
    }
]);

// 필터링 및 정렬된 클럽 목록
const filteredClubs = computed(() => {
    let result = [...clubs.value];

    // 검색어 필터링
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(club =>
            club.name.toLowerCase().includes(query) ||
            club.sport.toLowerCase().includes(query) ||
            club.location.toLowerCase().includes(query)
        );
    }

    // 정렬
    switch (sortOption.value) {
        case 'newest':
            result.sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate));
            break;
        case 'oldest':
            result.sort((a, b) => new Date(a.joinedDate) - new Date(b.joinedDate));
            break;
        case 'name':
            result.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'members':
            result.sort((a, b) => b.members - a.members);
            break;
    }

    return result;
});

// 운동 종류에 따른 배지 클래스
const getSportClass = (sport) => {
    const sportMap = {
        '클라이밍': 'sport-climbing',
        '러닝': 'sport-running',
        '테니스': 'sport-tennis',
        '축구': 'sport-soccer',
        '요가': 'sport-yoga',
        '배드민턴': 'sport-badminton',
        '수영': 'sport-swimming'
    };

    return sportMap[sport] || 'sport-default';
};

// 실력 수준 표시
const getSkillText = (level) => {
    const skillMap = {
        1: '입문',
        2: '초급',
        3: '중급',
        4: '상급',
        5: '전문가'
    };

    return skillMap[level] || '중급';
};
// 활동 수준 클래스 및 텍스트
const getActivityClass = (activity) => {
    const activityMap = {
        'active': 'activity-active',
        'moderate': 'activity-moderate',
        'inactive': 'activity-inactive'
    };

    return activityMap[activity] || 'activity-moderate';
};

const getActivityText = (activity) => {
    const activityMap = {
        'active': '활발한 활동',
        'moderate': '보통 활동',
        'inactive': '낮은 활동'
    };

    return activityMap[activity] || '보통 활동';
};

// 클럽 상세 페이지로 이동
const goToClubDetail = (clubId) => {
    router.push(`/clubs/${clubId}`);
};
</script>

<style scoped>
/* 전체 페이지 스타일 */
.my-clubs-page {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding-bottom: 80px;
}

/* 헤더 섹션 스타일 */
.header-section {
    background-color: white;
    padding: 2rem 0;
    margin-bottom: 1.5rem;
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

.club-count {
    font-weight: 600;
    color: #37715D;
}

/* 검색 및 정렬 스타일 */
.search-sort-container {
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

.sort-container {
    display: flex;
    align-items: center;
}

.sort-label {
    margin-right: 0.5rem;
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 0;
}

.sort-select {
    padding: 0.5rem 1rem;
    border: 1px solid #dee2e6;
    border-radius: 2rem;
    font-size: 0.9rem;
    background-color: white;
    color: #495057;
}

.sort-select:focus {
    outline: none;
    border-color: #37715D;
    box-shadow: 0 0 0 0.2rem rgba(55, 113, 93, 0.15);
}

/* 클럽 카드 스타일 */
.club-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.club-card {
    background-color: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.club-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.club-image-container {
    position: relative;
    height: 160px;
    overflow: hidden;
}

.club-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.club-card:hover .club-image {
    transform: scale(1.05);
}

.club-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 32px;
    height: 32px;
    background-color: #37715D;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.club-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.club-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.25rem;
}

.club-name {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0;
    color: #333;
    line-height: 1.3;
}

.club-members {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c757d;
    font-size: 0.9rem;
    white-space: nowrap;
}

.club-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.25rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.info-label {
    font-size: 0.8rem;
    color: #6c757d;
}

.info-value {
    font-size: 0.95rem;
    font-weight: 500;
    color: #333;
}

/* 운동 종류 배지 스타일 */
.sport-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: white;
}

.sport-climbing {
    background-color: #e74c3c;
}

.sport-running {
    background-color: #3498db;
}

.sport-tennis {
    background-color: #2ecc71;
}

.sport-soccer {
    background-color: #f39c12;
}

.sport-yoga {
    background-color: #9b59b6;
}

.sport-badminton {
    background-color: #1abc9c;
}

.sport-swimming {
    background-color: #3498db;
}

.sport-default {
    background-color: #95a5a6;
}

/* 실력 수준 스타일 */
.skill-level {
    position: relative;
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 0.25rem;
}

.skill-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #37715D;
    border-radius: 4px;
}

.skill-text {
    position: absolute;
    top: -18px;
    right: 0;
    font-size: 0.8rem;
    color: #495057;
}

/* 클럽 푸터 스타일 */
.club-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #f1f3f5;
}

.club-activity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    font-weight: 500;
}

.club-activity i {
    font-size: 0.7rem;
}

.activity-active {
    color: #2ecc71;
}

.activity-moderate {
    color: #f39c12;
}

.activity-inactive {
    color: #e74c3c;
}

.club-joined-date {
    font-size: 0.8rem;
    color: #adb5bd;
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

/* 추천 클럽 섹션 스타일 */
.recommended-section {
    background-color: white;
    padding: 2.5rem 0;
    margin-top: 2rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #333;
}

.section-subtitle {
    color: #6c757d;
    margin-bottom: 1.5rem;
}

.recommended-list {
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    padding: 0.5rem 0.25rem;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.recommended-list::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

.recommended-card {
    flex: 0 0 auto;
    width: 220px;
    background-color: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.recommended-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.recommended-image-container {
    height: 120px;
    overflow: hidden;
}

.recommended-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.recommended-card:hover .recommended-image {
    transform: scale(1.05);
}

.recommended-content {
    padding: 1rem;
}

.recommended-name {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
    line-height: 1.3;
}

.recommended-sport {
    font-size: 0.85rem;
    color: #37715D;
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.recommended-location {
    font-size: 0.85rem;
    color: #6c757d;
    margin-bottom: 0.25rem;
}

.recommended-members {
    font-size: 0.85rem;
    color: #6c757d;
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

    .search-sort-container {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    .search-container {
        width: 100%;
        max-width: none;
    }

    .club-list {
        grid-template-columns: 1fr;
    }

    .club-info {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .recommended-section {
        padding: 2rem 0;
    }
}
</style>