<template>
  <div class="appointment-applicants-page">
    <!-- 상단 네비게이션 -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <i class="bi bi-calendar-check custom-primary me-2 fs-4"></i>
          <span class="fw-bold">운동약속</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="goBack">
                <i class="bi bi-arrow-left me-1"></i> 뒤로가기
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 헤더 섹션 - 개선된 디자인 -->
    <div class="header-section">
      <div class="header-image-container">
        <img :src="appointment.image" alt="약속 이미지" class="header-image">
      </div>
      <div class="header-content-wrapper">
        <div class="container">
          <div class="header-content">
            <div class="appointment-info">
              <div class="category-badge">{{ appointment.category }}</div>
              <h1 class="title">{{ appointment.title }}</h1>
              <div class="details">
                <div class="detail-item">
                  <i class="bi bi-calendar3"></i>
                  <span>{{ appointment.time }}</span>
                </div>
                <div class="detail-item">
                  <i class="bi bi-geo-alt"></i>
                  <span>{{ appointment.location }}</span>
                </div>
                <div class="detail-item">
                  <i class="bi bi-people"></i>
                  <span>신청자 {{ applicants.length }}명</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 신청자 목록 섹션 -->
    <div class="applicants-section">
      <div class="container">
        <div class="section-header">
          <div class="d-flex justify-content-between align-items-center">
            <h2 class="section-title">약속 신청자 목록</h2>
            <div class="d-flex gap-2">
              <div class="dropdown">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="sortDropdown"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-sort-down me-1"></i> 정렬
                </button>
                <ul class="dropdown-menu" aria-labelledby="sortDropdown">
                  <li><a class="dropdown-item" href="#" @click.prevent="sortApplicants('newest')">최신순</a></li>
                  <li><a class="dropdown-item" href="#" @click.prevent="sortApplicants('oldest')">오래된순</a></li>
                  <li><a class="dropdown-item" href="#" @click.prevent="sortApplicants('name')">이름순</a></li>
                </ul>
              </div>
              <div class="dropdown">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="filterDropdown"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-funnel me-1"></i> 필터
                </button>
                <ul class="dropdown-menu" aria-labelledby="filterDropdown">
                  <li><a class="dropdown-item" href="#" @click.prevent="filterApplicants('all')">전체</a></li>
                  <li><a class="dropdown-item" href="#" @click.prevent="filterApplicants('pending')">대기중</a></li>
                  <li><a class="dropdown-item" href="#" @click.prevent="filterApplicants('approved')">승인됨</a></li>
                  <li><a class="dropdown-item" href="#" @click.prevent="filterApplicants('rejected')">거절됨</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="filter-chips mt-3">
            <span class="filter-chip" :class="{ active: currentFilter === 'all' }" @click="filterApplicants('all')">
              전체 <span class="count">{{ applicants.length }}</span>
            </span>
            <span class="filter-chip" :class="{ active: currentFilter === 'pending' }"
              @click="filterApplicants('pending')">
              대기중 <span class="count">{{ getPendingCount() }}</span>
            </span>
            <span class="filter-chip" :class="{ active: currentFilter === 'approved' }"
              @click="filterApplicants('approved')">
              승인됨 <span class="count">{{ getApprovedCount() }}</span>
            </span>
            <span class="filter-chip" :class="{ active: currentFilter === 'rejected' }"
              @click="filterApplicants('rejected')">
              거절됨 <span class="count">{{ getRejectedCount() }}</span>
            </span>
          </div>
        </div>

        <!-- 신청자 카드 목록 -->
        <div class="applicant-list">
          <div v-for="(applicant, index) in filteredApplicants" :key="applicant.id" class="applicant-card">
            <div class="card">
              <div class="card-header" @click="toggleApplicant(applicant.id)">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <div class="applicant-avatar">
                      <img :src="applicant.avatar" :alt="applicant.name">
                    </div>
                    <div class="applicant-info">
                      <h5 class="applicant-name">{{ applicant.name }}</h5>
                      <p class="applicant-date">신청일: {{ applicant.appliedAt }}</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center">
                    <div :class="getStatusBadgeClass(applicant.status)" class="status-badge">
                      {{ getStatusText(applicant.status) }}
                    </div>
                    <button class="toggle-btn" type="button">
                      <i class="bi" :class="applicant.expanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 확장된 내용 (질문 답변) -->
              <div class="card-body" v-if="applicant.expanded">
                <div class="applicant-details">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="detail-item">
                        <i class="bi bi-envelope"></i>
                        <span>{{ applicant.email }}</span>
                      </div>
                      <div class="detail-item">
                        <i class="bi bi-telephone"></i>
                        <span>{{ applicant.phone }}</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="detail-item">
                        <i class="bi bi-person-badge"></i>
                        <span>{{ applicant.participationType }}</span>
                      </div>
                      <div class="detail-item">
                        <i class="bi bi-calendar-check"></i>
                        <span>{{ applicant.appliedAt }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 질문 답변 섹션 -->
                <div class="answers-section">
                  <h6 class="answers-title">질문 답변</h6>
                  <div v-for="(answer, answerIndex) in applicant.answers" :key="answerIndex" class="answer-item">
                    <p class="question">{{ answer.question }}</p>
                    <p class="answer">{{ answer.answer }}</p>
                  </div>
                </div>

                <!-- 액션 버튼 -->
                <div class="action-buttons">
                  <button class="btn-message" @click="contactApplicant(applicant)">
                    <i class="bi bi-chat-dots"></i> 메시지
                  </button>
                  <button class="btn-reject" v-if="applicant.status !== 'rejected'"
                    @click="updateStatus(applicant.id, 'rejected')">
                    <i class="bi bi-x-circle"></i> 거절
                  </button>
                  <button class="btn-approve" v-if="applicant.status !== 'approved'"
                    @click="updateStatus(applicant.id, 'approved')">
                    <i class="bi bi-check-circle"></i> 승인
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 신청자가 없는 경우 -->
          <div v-if="filteredApplicants.length === 0" class="empty-state">
            <i class="bi bi-people"></i>
            <h5>신청자가 없습니다</h5>
            <p>아직 이 약속에 신청한 사람이 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 약속 정보 (실제로는 API에서 가져올 것)
const appointment = ref({
  id: 1,
  title: '오늘 클라이밍 같이 하실 분!',
  category: '클라이밍',
  image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
  time: '2024년 04월 08일 (목) 19:00',
  location: '서울시 동작구',
  participants: {
    current: 3,
    max: 8
  }
});

// 신청자 데이터 (실제로는 API에서 가져올 것)
const applicants = ref([
  {
    id: 1,
    name: '김지민',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    email: 'jimin@example.com',
    phone: '010-1234-5678',
    participationType: '개인 참가',
    appliedAt: '2024-04-05 14:23',
    status: 'pending', // pending, approved, rejected
    expanded: false,
    answers: [
      {
        question: '소속 및 담당자님은?',
        answer: '개인 참가자입니다.'
      },
      {
        question: '왜 이 약속에 참가하시나요?',
        answer: '클라이밍을 배우고 싶어서 참가 신청합니다. 초보자인데 같이 배우면서 즐겁게 운동하고 싶습니다.'
      },
      {
        question: '참여 목적!',
        answer: '새로운 취미를 찾고 있어요. 클라이밍이 요즘 인기가 많다고 해서 한번 도전해보고 싶습니다.'
      }
    ]
  },
  {
    id: 2,
    name: '이서연',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    email: 'seoyeon@example.com',
    phone: '010-2345-6789',
    participationType: '개인 참가',
    appliedAt: '2024-04-05 16:45',
    status: 'approved',
    expanded: false,
    answers: [
      {
        question: '소속 및 담당자님은?',
        answer: '개인 참가자입니다.'
      },
      {
        question: '왜 이 약속에 참가하시나요?',
        answer: '클라이밍을 6개월 정도 했는데 함께 할 사람을 찾고 있었어요. 같이 즐겁게 운동하고 싶습니다.'
      },
      {
        question: '참여 목적!',
        answer: '클라이밍 실력을 향상시키고 같은 취미를 가진 사람들과 교류하고 싶습니다.'
      }
    ]
  },
  {
    id: 3,
    name: '박준호',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    email: 'junho@example.com',
    phone: '010-3456-7890',
    participationType: '개인 참가',
    appliedAt: '2024-04-06 09:12',
    status: 'rejected',
    expanded: false,
    answers: [
      {
        question: '소속 및 담당자님은?',
        answer: '개인 참가자입니다.'
      },
      {
        question: '왜 이 약속에 참가하시나요?',
        answer: '클라이밍을 처음 접해보려고 합니다. 기초부터 배우고 싶어요.'
      },
      {
        question: '참여 목적!',
        answer: '운동 부족을 느껴서 새로운 운동을 시작하려고 합니다. 클라이밍이 전신 운동에 좋다고 들었어요.'
      }
    ]
  }
]);

// 필터 및 정렬 상태
const currentFilter = ref('all');
const currentSort = ref('newest');

// 필터링된 신청자 목록
const filteredApplicants = computed(() => {
  let result = [...applicants.value];

  // 필터 적용
  if (currentFilter.value !== 'all') {
    result = result.filter(applicant => applicant.status === currentFilter.value);
  }

  // 정렬 적용
  if (currentSort.value === 'newest') {
    result.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  } else if (currentSort.value === 'oldest') {
    result.sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt));
  } else if (currentSort.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
});

// 신청자 상태에 따른 배지 클래스
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'approved':
      return 'status-approved';
    case 'rejected':
      return 'status-rejected';
    default:
      return 'status-pending';
  }
};

// 신청자 상태 텍스트
const getStatusText = (status) => {
  switch (status) {
    case 'approved':
      return '승인됨';
    case 'rejected':
      return '거절됨';
    default:
      return '대기중';
  }
};

// 신청자 정보 토글
const toggleApplicant = (id) => {
  const index = applicants.value.findIndex(a => a.id === id);
  if (index !== -1) {
    applicants.value[index].expanded = !applicants.value[index].expanded;
  }
};

// 신청자 상태 업데이트
const updateStatus = (id, status) => {
  const index = applicants.value.findIndex(a => a.id === id);
  if (index !== -1) {
    applicants.value[index].status = status;

    // 실제로는 API 호출하여 상태 업데이트
    console.log(`신청자 ID ${id}의 상태를 ${status}로 업데이트`);
  }
};

// 신청자에게 메시지 보내기
const contactApplicant = (applicant) => {
  // 실제로는 메시지 모달 또는 채팅 페이지로 이동
  console.log(`${applicant.name}에게 메시지 보내기`);
  alert(`${applicant.name}님에게 메시지를 보냅니다.`);
};

// 신청자 필터링
const filterApplicants = (filter) => {
  currentFilter.value = filter;
};

// 신청자 정렬
const sortApplicants = (sort) => {
  currentSort.value = sort;
};

// 상태별 카운트 함수
const getPendingCount = () => {
  return applicants.value.filter(a => a.status === 'pending').length;
};

const getApprovedCount = () => {
  return applicants.value.filter(a => a.status === 'approved').length;
};

const getRejectedCount = () => {
  return applicants.value.filter(a => a.status === 'rejected').length;
};

// 뒤로가기
const goBack = () => {
  router.go(-1);
};

onMounted(() => {
  // 실제로는 API에서 약속 정보와 신청자 목록을 가져옴
  console.log('약속 신청자 페이지 마운트됨');
});
</script>

<style scoped>
/* 전체 페이지 스타일 */
.appointment-applicants-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 헤더 섹션 스타일 - 개선됨 */
.header-section {
  position: relative;
  margin-bottom: 2rem;
}

.header-image-container {
  height: 240px;
  overflow: hidden;
  position: relative;
}

.header-image-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
}

.header-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-content-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem 0;
  z-index: 2;
}

.header-content {
  color: white;
}

.appointment-info {
  position: relative;
}

.category-badge {
  display: inline-block;
  background-color: #37715D;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.detail-item i {
  font-size: 1.2rem;
}

/* 섹션 헤더 스타일 */
.section-header {
  margin-bottom: 1.5rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0;
  color: #333;
}

.filter-chips {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f1f3f5;
  border-radius: 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  background-color: #e9ecef;
}

.filter-chip.active {
  background-color: #37715D;
  color: white;
}

.filter-chip .count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  margin-left: 0.5rem;
  font-size: 0.8rem;
}

/* 신청자 카드 스타일 - 개선됨 */
.applicants-section {
  padding-bottom: 2rem;
}

.applicant-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.applicant-card {
  transition: all 0.3s ease;
}

.applicant-card:hover {
  transform: translateY(-3px);
}

.applicant-card .card {
  border: none;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  background-color: white;
}

.applicant-card .card-header {
  background-color: white;
  border-bottom: 1px solid #f1f3f5;
  padding: 1.25rem;
  cursor: pointer;
}

.applicant-avatar {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 3px solid white;
}

.applicant-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.applicant-info {
  flex: 1;
}

.applicant-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #333;
}

.applicant-date {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0;
}

/* 상태 배지 스타일 - 크기 증가 */
.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.9rem;
  margin-right: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-approved {
  background-color: #28a745;
  color: white;
}

.status-rejected {
  background-color: #dc3545;
  color: white;
}

.status-pending {
  background-color: #6c757d;
  color: white;
}

.toggle-btn {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 1.2rem;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  color: #37715D;
}

/* 카드 바디 스타일 */
.card-body {
  padding: 1.5rem;
  border-top: 1px solid #f1f3f5;
  background-color: #f8f9fa;
}

.applicant-details {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.applicant-details .detail-item {
  margin-bottom: 0.75rem;
  color: #495057;
}

.applicant-details i {
  color: #37715D;
  margin-right: 0.5rem;
  font-size: 1rem;
}

/* 질문 답변 섹션 */
.answers-section {
  margin-bottom: 1.5rem;
}

.answers-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.answer-item {
  background-color: white;
  padding: 1.25rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.question {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #37715D;
}

.answer {
  margin-bottom: 0;
  color: #495057;
  line-height: 1.5;
}

/* 액션 버튼 스타일 */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.action-buttons button {
  padding: 0.6rem 1.25rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-message {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #ced4da;
}

.btn-message:hover {
  background-color: #e9ecef;
}

.btn-reject {
  background-color: #fff5f5;
  color: #e03131;
  border: 1px solid #ffc9c9;
}

.btn-reject:hover {
  background-color: #ffe3e3;
}

.btn-approve {
  background-color: #37715D;
  color: white;
}

.btn-approve:hover {
  background-color: #2c5a4a;
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  color: #ced4da;
  margin-bottom: 1rem;
}

.empty-state h5 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 0;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .header-content-wrapper {
    position: relative;
    background-color: #37715D;
    padding: 1.5rem 0;
  }

  .title {
    font-size: 1.5rem;
  }

  .details {
    flex-direction: column;
    gap: 0.75rem;
  }

  .applicant-avatar {
    width: 50px;
    height: 50px;
  }

  .status-badge {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .action-buttons button {
    flex: 1;
    justify-content: center;
  }
}
</style>
