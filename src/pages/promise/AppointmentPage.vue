<template>
  <div class="app bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- 히어로 섹션 -->
    <hero-section />

    <!-- 필터 섹션 - Bootstrap 스타일 적용 -->
    <div class="filter-section sticky-top shadow-sm bg-white py-2">
      <div class="container">
        <div class="filter-container d-flex align-items-center overflow-auto pb-1">
          <!-- 운동 종목 필터 -->
          <div class="filter-group me-3">
            <div class="d-flex align-items-center">
              <label class="me-2 text-secondary small fw-medium">종목:</label>
              <div class="filter-buttons">
                <button v-for="category in ['전체', '클라이밍', '러닝', '축구']" :key="category" type="button" class="filter-btn"
                  :class="selectedCategory === category ? 'active' : ''" @click="selectedCategory = category">
                  {{ category }}
                </button>
              </div>
            </div>
          </div>

          <div class="vr mx-2"></div>

          <!-- 지역 필터 -->
          <div class="filter-group me-3">
            <div class="d-flex align-items-center">
              <label class="me-2 text-secondary small fw-medium">지역:</label>
              <div class="filter-buttons">
                <button v-for="location in ['전체', '강남구', '서초구', '동작구']" :key="location" type="button" class="filter-btn"
                  :class="selectedLocation === location ? 'active' : ''" @click="selectedLocation = location">
                  {{ location }}
                </button>
              </div>
            </div>
          </div>

          <div class="vr mx-2"></div>

          <!-- 날짜 필터 -->
          <div class="filter-group me-3">
            <div class="d-flex align-items-center">
              <label class="me-2 text-secondary small fw-medium">날짜:</label>
              <div class="filter-buttons">
                <button v-for="date in ['전체', '오늘', '내일', '이번 주']" :key="date" type="button" class="filter-btn"
                  :class="selectedDate === date ? 'active' : ''" @click="selectedDate = date">
                  {{ date }}
                </button>
              </div>
            </div>
          </div>

          <div class="vr mx-2"></div>

          <!-- 시간 필터 -->
          <div class="filter-group me-3">
            <div class="d-flex align-items-center">
              <label class="me-2 text-secondary small fw-medium">시간:</label>
              <div class="filter-buttons">
                <button v-for="time in ['전체', '오전', '오후', '저녁']" :key="time" type="button" class="filter-btn"
                  :class="selectedTime === time ? 'active' : ''" @click="selectedTime = time">
                  {{ time }}
                </button>
              </div>
            </div>
          </div>

          <div class="vr mx-2"></div>

          <!-- 실력 필터 -->
          <div class="filter-group">
            <div class="d-flex align-items-center">
              <label class="me-2 text-secondary small fw-medium">실력:</label>
              <div class="filter-buttons">
                <button v-for="level in ['전체', '입문', '초급', '중급', '고급']" :key="level" type="button" class="filter-btn"
                  :class="selectedLevel === level ? 'active' : ''" @click="selectedLevel = level">
                  {{ level }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 약속 리스트 섹션 -->
    <div class="appointments-section py-6">
      <div class="container mx-auto px-4">
        <div class="section-header flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-4">운동 약속</h2>

        </div>

        <!-- 약속 카드 그리드 -->
        <div class="appointment-grid">
          <div class="appointment-row">
            <appointment-card v-for="appointment in appointments.slice(0, 4)" :key="appointment.id"
              :appointment="appointment" />
          </div>
          <div class="appointment-row">
            <appointment-card v-for="appointment in appointments.slice(4, 8)" :key="appointment.id"
              :appointment="appointment" />
          </div>
        </div>
      </div>
    </div>

    <!-- 추천 약속 섹션 -->
    <div class="recommended-section py-6 bg-gray-100 dark:bg-gray-800/50">
      <div class="container mx-auto px-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-4">추천 약속</h2>

        <div class="appointment-grid">
          <div class="appointment-row">
            <appointment-card v-for="appointment in recommendedAppointments" :key="appointment.id"
              :appointment="appointment" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  RefreshCwIcon,
  LayoutGridIcon,
  ListIcon
} from 'lucide-vue-next';
import AppointmentCard from './components/AppointmentCard.vue';
import HeroSection from './components/HeroSection.vue';
// 필터 상태
const selectedCategory = ref('전체');
const selectedLocation = ref('전체');
const selectedDate = ref('전체');
const selectedTime = ref('전체');
const selectedLevel = ref('전체');

// 약속 데이터 (API로 받아올 예정)
const appointments = ref([
  {
    id: 1,
    title: 'DM 클라이밍 크루',
    category: '클라이밍',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    createdAt: '1시간 전',
    time: '2024.09.22 17시 00분',
    location: '서울시 동작구',
    participants: {
      current: 14,
      max: 20
    },
    host: {
      name: 'Climbing Master',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  },
  {
    id: 2,
    title: '한강 러닝 크루',
    category: '러닝',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    createdAt: '3시간 전',
    time: '2024.09.23 06시 30분',
    location: '서울시 서초구',
    participants: {
      current: 8,
      max: 15
    },
    host: {
      name: 'Runner Kim',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  },
  {
    id: 3,
    title: '주말 축구 모임',
    category: '축구',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    createdAt: '어제',
    time: '2024.09.24 15시 00분',
    location: '서울시 강남구',
    participants: {
      current: 10,
      max: 22
    },
    host: {
      name: 'Soccer Pro',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg'
    }
  },
  {
    id: 4,
    title: '아침 요가 클래스',
    category: '요가',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    createdAt: '2일 전',
    time: '2024.09.25 07시 00분',
    location: '서울시 마포구',
    participants: {
      current: 6,
      max: 12
    },
    host: {
      name: 'Yoga Master',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  },
  {
    id: 5,
    title: '수영 레슨 그룹',
    category: '수영',
    image: 'https://images.unsplash.com/photo-1560090995-01632a28895b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    createdAt: '3일 전',
    time: '2024.09.26 19시 00분',
    location: '서울시 송파구',
    participants: {
      current: 5,
      max: 8
    },
    host: {
      name: 'Swim Coach',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    }
  },
  {
    id: 6,
    title: '테니스 초보 모임',
    category: '테니스',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    createdAt: '4일 전',
    time: '2024.09.27 10시 00분',
    location: '서울시 강동구',
    participants: {
      current: 3,
      max: 4
    },
    host: {
      name: 'Tennis Lover',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    }
  },
  {
    id: 7,
    title: '농구 3:3 대회',
    category: '농구',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    createdAt: '5일 전',
    time: '2024.09.28 14시 00분',
    location: '서울시 중구',
    participants: {
      current: 12,
      max: 18
    },
    host: {
      name: 'Basketball King',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  },
  {
    id: 8,
    title: '필라테스 원데이 클래스',
    category: '필라테스',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    createdAt: '1주일 전',
    time: '2024.09.29 11시 00분',
    location: '서울시 용산구',
    participants: {
      current: 7,
      max: 10
    },
    host: {
      name: 'Pilates Pro',
      avatar: 'https://randomuser.me/api/portraits/women/58.jpg'
    }
  }
]);

// 추천 약속 데이터
const recommendedAppointments = ref([
  {
    id: 9,
    title: '주말 등산 모임',
    category: '등산',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    createdAt: '2시간 전',
    time: '2024.10.01 08시 00분',
    location: '서울시 도봉구',
    participants: {
      current: 8,
      max: 12
    },
    host: {
      name: 'Mountain Lover',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg'
    }
  },
  {
    id: 10,
    title: '자전거 한강 라이딩',
    category: '자전거',
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    createdAt: '5시간 전',
    time: '2024.10.02 16시 00분',
    location: '서울시 영등포구',
    participants: {
      current: 6,
      max: 15
    },
    host: {
      name: 'Cycling Master',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    }
  },
  {
    id: 11,
    title: '배드민턴 친선 경기',
    category: '배드민턴',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    createdAt: '어제',
    time: '2024.10.03 19시 00분',
    location: '서울시 노원구',
    participants: {
      current: 4,
      max: 8
    },
    host: {
      name: 'Badminton Pro',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    }
  },
  {
    id: 12,
    title: '볼링 번개 모임',
    category: '볼링',
    image: 'https://images.unsplash.com/photo-1538511059256-0642a3a9fe71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    createdAt: '3일 전',
    time: '2024.10.04 20시 00분',
    location: '서울시 강서구',
    participants: {
      current: 5,
      max: 6
    },
    host: {
      name: 'Bowling King',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
    }
  }
]);
</script>

<style scoped>
/* 스크롤바 숨기기 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 필터 섹션 스타일 */
.filter-section {
  z-index: 1030;
}

.filter-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.filter-container::-webkit-scrollbar {
  display: none;
}

/* 필터 버튼 스타일 */
.filter-buttons {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
}

.filter-btn {
  border-radius: 20px;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  background-color: white;
  color: #6c757d;
  border: 1px solid #dee2e6;
  transition: all 0.15s ease;
}

.filter-btn:hover {
  background-color: #f8f9fa;
  border-color: #ced4da;
}

.filter-btn.active {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

/* 구분선 스타일 */
.vr {
  height: 24px;
  opacity: 0.2;
}

/* 뷰 토글 버튼 */
.view-btn {
  padding: 0.375rem;
  border-radius: 0.25rem;
  color: #6b7280;
  transition: all 0.15s;
}

.view-btn.active {
  background-color: white;
  color: #3b82f6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .view-btn.active {
  background-color: #1f2937;
  color: #60a5fa;
}

/* 약속 카드 그리드 레이아웃 */
.appointment-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.appointment-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  width: 100%;
}

.appointment-row>* {
  flex: 1;
  min-width: 0;
  /* 중요: 자식 요소가 부모 컨테이너를 넘치지 않도록 함 */
  width: calc(25% - 9px);
  /* 4개 카드 + 간격 고려 */
}

/* 모바일 반응형 */
@media (max-width: 640px) {
  .appointment-row {
    flex-wrap: wrap;
  }

  .appointment-row>* {
    width: calc(50% - 6px);
    flex: 0 0 calc(50% - 6px);
  }
}

/* 태블릿 반응형 */
@media (min-width: 641px) and (max-width: 1024px) {
  .appointment-row>* {
    width: calc(33.333% - 8px);
    flex: 0 0 calc(33.333% - 8px);
  }
}

/* 작은 데스크톱 반응형 */
@media (min-width: 1025px) and (max-width: 1280px) {
  .appointment-row>* {
    width: calc(25% - 9px);
    flex: 0 0 calc(25% - 9px);
  }
}
</style>