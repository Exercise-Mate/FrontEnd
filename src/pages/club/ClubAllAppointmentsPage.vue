<template>
    <div class="club-all-appointments-page">
      <!-- 상단 네비게이션 -->
      <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center" href="#">
            <i class="bi bi-calendar-event custom-primary me-2 fs-4"></i>
            <span class="fw-bold">클럽 약속</span>
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
  
      <div class="container py-4">
        <!-- 클럽 정보 헤더 -->
        <div class="club-header mb-4" v-if="clubInfo">
          <div class="d-flex align-items-center">
            <div class="club-avatar me-3">
              <img :src="clubInfo.imgUrl" :alt="clubInfo.name" class="club-image">
            </div>
            <div>
              <h1 class="club-name mb-1">{{ clubInfo.name }}</h1>
              <p class="club-description mb-0 text-muted">{{ clubInfo.description }}</p>
            </div>
          </div>
        </div>
  
        <!-- 약속 섹션 -->
        <div class="appointments-section">
          <div class="section-header d-flex justify-content-between align-items-center mb-3">
            <h2 class="section-title fw-bold">클럽 약속</h2>
            <button class="btn btn-custom-primary" @click="createAppointment" v-if="isClubMember">
              <i class="bi bi-plus-lg me-1"></i> 약속 만들기
            </button>
          </div>
          <p class="section-description mb-4">클럽 멤버들과 함께하는 다양한 약속에 참여해보세요!</p>
  
          <!-- 탭 네비게이션 -->
          <ul class="nav nav-tabs mb-4" id="appointmentTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="active-tab" data-bs-toggle="tab" data-bs-target="#active-appointments" 
                type="button" role="tab" aria-controls="active-appointments" aria-selected="true">
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
  
          <!-- 탭 콘텐츠 -->
          <div class="tab-content" id="appointmentTabsContent">
            <!-- 모집 중인 약속 탭 -->
            <div class="tab-pane fade show active" id="active-appointments" role="tabpanel" aria-labelledby="active-tab">
              <div v-if="isLoadingActive" class="text-center py-5">
                <div class="spinner-border text-custom-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">약속을 불러오는 중...</p>
              </div>
              <div v-else>
                <div class="row">
                  <div v-for="appointment in paginatedActiveAppointments" :key="appointment.id" class="col-md-4 mb-4">
                    <div class="appointment-card">
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
                            <span>{{ appointment.participants.current }}/{{ appointment.participants.max }}명</span>
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
                          <button class="btn btn-outline-secondary btn-sm" @click="viewAppointment(appointment.id)">
                            <i class="bi bi-eye"></i> 상세보기
                          </button>
                          <button v-if="isCreator(appointment.creatorId)" class="btn btn-outline-custom-primary btn-sm"
                            @click="viewApplicants(appointment.id)">
                            <i class="bi bi-people"></i> 신청자 ({{ appointment.applicants }})
                          </button>
                          <button v-if="isCreator(appointment.creatorId)" class="btn btn-custom-primary btn-sm"
                            @click="editAppointment(appointment.id)">
                            <i class="bi bi-pencil"></i> 수정
                          </button>
                          <button v-if="!isCreator(appointment.creatorId) && !hasApplied(appointment.id)"
                            class="btn btn-custom-primary btn-sm" @click="applyAppointment(appointment.id)">
                            <i class="bi bi-check-circle"></i> 참여하기
                          </button>
                          <button v-if="!isCreator(appointment.creatorId) && hasApplied(appointment.id)"
                            class="btn btn-outline-danger btn-sm" @click="cancelApplication(appointment.id)">
                            <i class="bi bi-x-circle"></i> 취소하기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="activeAppointments.length === 0" class="empty-state">
                  <div class="empty-icon">
                    <i class="bi bi-calendar-x"></i>
                  </div>
                  <h3 class="empty-title">모집 중인 약속이 없습니다</h3>
                  <p class="empty-description">새로운 약속을 만들어보세요!</p>
                  <button v-if="isClubMember" class="btn btn-custom-primary" @click="createAppointment">
                    <i class="bi bi-plus-lg me-2"></i> 약속 만들기
                  </button>
                </div>
  
                <!-- 페이지네이션 -->
                <div class="pagination-container d-flex justify-content-center mt-4" v-if="activeAppointments.length > 0">
                  <nav aria-label="Page navigation">
                    <ul class="pagination">
                      <li class="page-item" :class="{ 'disabled': activeCurrentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="goToActivePage(activeCurrentPage - 1)">
                          <i class="bi bi-chevron-left"></i>
                        </a>
                      </li>
                      
                      <li v-for="page in activePageNumbers" :key="'active-' + page" 
                          class="page-item" 
                          :class="{ 'active': page === activeCurrentPage }">
                        <a class="page-link" href="#" @click.prevent="goToActivePage(page)">{{ page }}</a>
                      </li>
                      
                      <li class="page-item" :class="{ 'disabled': activeCurrentPage === activeTotalPages }">
                        <a class="page-link" href="#" @click.prevent="goToActivePage(activeCurrentPage + 1)">
                          <i class="bi bi-chevron-right"></i>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
  
            <!-- 종료된 약속 탭 -->
            <div class="tab-pane fade" id="past-appointments" role="tabpanel" aria-labelledby="past-tab">
              <div v-if="isLoadingPast" class="text-center py-5">
                <div class="spinner-border text-custom-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">약속을 불러오는 중...</p>
              </div>
              <div v-else>
                <div class="row">
                  <div v-for="appointment in paginatedPastAppointments" :key="appointment.id" class="col-md-4 mb-4">
                    <div class="appointment-card past">
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
                            <span>{{ appointment.participants.current }}/{{ appointment.participants.max }}명 참여</span>
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
                          <button class="btn btn-outline-secondary btn-sm" @click="viewAppointment(appointment.id)">
                            <i class="bi bi-eye"></i> 상세보기
                          </button>
                          <button v-if="isCreator(appointment.creatorId)" class="btn btn-outline-custom-primary btn-sm"
                            @click="viewParticipants(appointment.id)"
                            :disabled="appointment.participants.current === 0">
                            <i class="bi bi-people"></i> 참여자 ({{ appointment.participants.current }})
                          </button>
                          <button v-if="isCreator(appointment.creatorId)" class="btn btn-custom-primary btn-sm"
                            @click="reviewParticipants(appointment.id)"
                            :disabled="appointment.reviewed || appointment.participants.current === 0">
                            <i class="bi bi-star"></i> {{ appointment.reviewed ? '평가 완료' : '참여자 평가' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="pastAppointments.length === 0" class="empty-state">
                  <div class="empty-icon">
                    <i class="bi bi-calendar-check"></i>
                  </div>
                  <h3 class="empty-title">종료된 약속이 없습니다</h3>
                  <p class="empty-description">아직 종료된 약속이 없습니다.</p>
                </div>
  
                <!-- 페이지네이션 -->
                <div class="pagination-container d-flex justify-content-center mt-4" v-if="pastAppointments.length > 0">
                  <nav aria-label="Page navigation">
                    <ul class="pagination">
                      <li class="page-item" :class="{ 'disabled': pastCurrentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="goToPastPage(pastCurrentPage - 1)">
                          <i class="bi bi-chevron-left"></i>
                        </a>
                      </li>
                      
                      <li v-for="page in pastPageNumbers" :key="'past-' + page" 
                          class="page-item" 
                          :class="{ 'active': page === pastCurrentPage }">
                        <a class="page-link" href="#" @click.prevent="goToPastPage(page)">{{ page }}</a>
                      </li>
                      
                      <li class="page-item" :class="{ 'disabled': pastCurrentPage === pastTotalPages }">
                        <a class="page-link" href="#" @click.prevent="goToPastPage(pastCurrentPage + 1)">
                          <i class="bi bi-chevron-right"></i>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import * as bootstrap from 'bootstrap';
  
  const router = useRouter();
  const route = useRoute();
  const clubId = computed(() => route.params.id);
  
  // 클럽 정보
  const clubInfo = ref(null);
  const isLoadingClub = ref(true);
  
  // 약속 관련 상태
  const isLoadingActive = ref(true);
  const isLoadingPast = ref(true);
  const activeAppointments = ref([]);
  const pastAppointments = ref([]);
  const isClubMember = ref(true); // 실제로는 API에서 확인해야 함
  const currentUserId = ref(1); // 실제로는 로그인한 사용자 ID를 가져와야 함
  const appliedAppointments = ref([2]); // 사용자가 신청한 약속 ID 목록
  
  // 페이지네이션 관련 상태 (모집 중인 약속)
  const activeCurrentPage = ref(1);
  const activeItemsPerPage = 6; // 한 페이지에 6개씩 표시
  
  // 페이지네이션 관련 상태 (종료된 약속)
  const pastCurrentPage = ref(1);
  const pastItemsPerPage = 6; // 한 페이지에 6개씩 표시
  
  // 클럽 정보 가져오기
  const fetchClubInfo = async () => {
    isLoadingClub.value = true;
    
    try {
      // API 호출을 시뮬레이션 (실제 구현 시에는 아래 주석을 해제하고 사용)
      // const response = await fetch(`/api/clubs/${clubId.value}`);
      // const data = await response.json();
      
      // API 응답 시뮬레이션 (0.5초 지연)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 더미 데이터
      clubInfo.value = {
        id: clubId.value,
        name: '서울 러닝 클럽',
        description: '서울에서 함께 달리는 러닝 클럽입니다. 초보자부터 마라토너까지 모두 환영합니다!',
        imgUrl: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        members: 120,
        owner: '러너_김',
        sportType: '러닝'
      };
      
      console.log('클럽 정보를 성공적으로 가져왔습니다:', clubInfo.value);
    } catch (error) {
      console.error('클럽 정보를 가져오는 중 오류가 발생했습니다:', error);
      alert('클럽 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      isLoadingClub.value = false;
    }
  };
  
  // 모집 중인 약속 목록 가져오기
  const fetchActiveAppointments = async () => {
    isLoadingActive.value = true;
    
    try {
      // API 호출을 시뮬레이션 (실제 구현 시에는 아래 주석을 해제하고 사용)
      // const response = await fetch(`/api/clubs/${clubId.value}/appointments/active`);
      // const data = await response.json();
      
      // API 응답 시뮬레이션 (1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // API에서 받아온 데이터 (시뮬레이션) - 15개의 약속
      const appointmentsData = [
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
          creatorId: 1 // 현재 사용자가 생성한 약속
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
          creatorId: 2 // 다른 사용자가 생성한 약속
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
          creatorId: 3 // 다른 사용자가 생성한 약속
        },
        {
          id: 4,
          title: '볼더링 초보자 모임',
          category: '볼더링',
          date: '2024년 04월 22일 (월) 19:00',
          location: '서울시 강남구 볼더링 센터',
          image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1705&q=80',
          participants: {
            current: 3,
            max: 6
          },
          views: 45,
          comments: 2,
          bookmarks: 3,
          applicants: 4,
          creatorId: 2 // 다른 사용자가 생성한 약속
        },
        {
          id: 5,
          title: '주말 축구 한 판',
          category: '축구',
          date: '2024년 04월 27일 (토) 15:00',
          location: '서울시 송파구 잠실종합운동장',
          image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 8,
            max: 12
          },
          views: 85,
          comments: 6,
          bookmarks: 9,
          applicants: 10,
          creatorId: 3 // 다른 사용자가 생성한 약속
        },
        {
          id: 6,
          title: '테니스 레슨 모임',
          category: '테니스',
          date: '2024년 04월 25일 (목) 19:00',
          location: '서울시 서초구 테니스장',
          image: 'https://images.unsplash.com/photo-1622279457486-28f24ae637a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 4,
            max: 6
          },
          views: 60,
          comments: 4,
          bookmarks: 7,
          applicants: 5,
          creatorId: 1 // 현재 사용자가 생성한 약속
        },
        {
          id: 7,
          title: '수영 함께해요',
          category: '수영',
          date: '2024년 04월 30일 (화) 20:00',
          location: '서울시 송파구 수영장',
          image: 'https://images.unsplash.com/photo-1560090995-01632a28895b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 3,
            max: 8
          },
          views: 40,
          comments: 2,
          bookmarks: 4,
          applicants: 3,
          creatorId: 2 // 다른 사용자가 생성한 약속
        },
        {
          id: 8,
          title: '배드민턴 치실 분',
          category: '배드민턴',
          date: '2024년 05월 02일 (목) 19:00',
          location: '서울시 강남구 체육관',
          image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 2,
            max: 4
          },
          views: 35,
          comments: 1,
          bookmarks: 3,
          applicants: 2,
          creatorId: 3 // 다른 사용자가 생성한 약속
        },
        {
          id: 9,
          title: '요가 초보 모임',
          category: '요가',
          date: '2024년 05월 05일 (일) 10:00',
          location: '서울시 마포구 요가 스튜디오',
          image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 4,
            max: 10
          },
          views: 30,
          comments: 2,
          bookmarks: 5,
          applicants: 4,
          creatorId: 1 // 현재 사용자가 생성한 약속
        },
        {
          id: 10,
          title: '주말 등산 모임',
          category: '등산',
          date: '2024년 05월 07일 (화) 08:00',
          location: '서울시 도봉구 북한산',
          image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 6,
            max: 12
          },
          views: 55,
          comments: 4,
          bookmarks: 8,
          applicants: 7,
          creatorId: 2 // 다른 사용자가 생성한 약속
        },
        {
          id: 11,
          title: '자전거 한강 라이딩',
          category: '자전거',
          date: '2024년 05월 10일 (금) 17:00',
          location: '서울시 여의도 한강공원',
          image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 5,
            max: 15
          },
          views: 48,
          comments: 3,
          bookmarks: 6,
          applicants: 6,
          creatorId: 3 // 다른 사용자가 생성한 약속
        },
        {
          id: 12,
          title: '골프 레슨 모임',
          category: '골프',
          date: '2024년 05월 12일 (일) 14:00',
          location: '서울시 강남구 골프 연습장',
          image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 3,
            max: 6
          },
          views: 42,
          comments: 2,
          bookmarks: 5,
          applicants: 4,
          creatorId: 1 // 현재 사용자가 생성한 약속
        },
        {
          id: 13,
          title: '필라테스 함께해요',
          category: '필라테스',
          date: '2024년 05월 15일 (수) 19:00',
          location: '서울시 강남구 필라테스 스튜디오',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 4,
            max: 8
          },
          views: 38,
          comments: 2,
          bookmarks: 4,
          applicants: 5,
          creatorId: 2 // 다른 사용자가 생성한 약속
        },
        {
          id: 14,
          title: '농구 한 판 어때요?',
          category: '농구',
          date: '2024년 05월 18일 (토) 16:00',
          location: '서울시 송파구 농구장',
          image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 6,
            max: 10
          },
          views: 45,
          comments: 3,
          bookmarks: 7,
          applicants: 8,
          creatorId: 3 // 다른 사용자가 생성한 약속
        },
        {
          id: 15,
          title: '볼링 한 게임 어때요?',
          category: '볼링',
          date: '2024년 05월 20일 (월) 20:00',
          location: '서울시 강남구 볼링장',
          image: 'https://images.unsplash.com/photo-1538511059256-0642a3a9fe71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 2,
            max: 6
          },
          views: 32,
          comments: 1,
          bookmarks: 3,
          applicants: 3,
          creatorId: 1 // 현재 사용자가 생성한 약속
        }
      ];
      
      activeAppointments.value = appointmentsData;
      
      console.log('모집 중인 약속 목록을 성공적으로 가져왔습니다:', activeAppointments.value);
    } catch (error) {
      console.error('모집 중인 약속 목록을 가져오는 중 오류가 발생했습니다:', error);
      alert('약속 목록을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      isLoadingActive.value = false;
    }
  };
  
  // 종료된 약속 목록 가져오기
  const fetchPastAppointments = async () => {
    isLoadingPast.value = true;
    
    try {
      // API 호출을 시뮬레이션 (실제 구현 시에는 아래 주석을 해제하고 사용)
      // const response = await fetch(`/api/clubs/${clubId.value}/appointments/past`);
      // const data = await response.json();
      
      // API 응답 시뮬레이션 (1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // API에서 받아온 데이터 (시뮬레이션) - 18개의 약속
      const appointmentsData = [
        {
          id: 101,
          title: '축구 한 판 어때요?',
          category: '축구',
          date: '2024년 03월 25일 (토) 15:00',
          location: '서울시 송파구 잠실종합운동장',
          image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 10,
            max: 12
          },
          views: 150,
          comments: 12,
          bookmarks: 18,
          reviewed: true,
          creatorId: 1 // 현재 사용자가 생성한 약속
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
          creatorId: 1 // 현재 사용자가 생성한 약속
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
          creatorId: 2 // 다른 사용자가 생성한 약속
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
          creatorId: 2 // 다른 사용자가 생성한 약속
        },
        {
          id: 105,
          title: '볼더링 마스터즈',
          category: '볼더링',
          date: '2024년 02월 20일 (화) 20:00',
          location: '서울시 강남구 볼더링 센터',
          image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1705&q=80',
          participants: {
            current: 5,
            max: 6
          },
          views: 75,
          comments: 4,
          bookmarks: 6,
          reviewed: true,
          creatorId: 1 // 현재 사용자가 생성한 약속
        },
        {
          id: 106,
          title: '주말 축구 모임',
          category: '축구',
          date: '2024년 02월 17일 (토) 14:00',
          location: '서울시 송파구 잠실종합운동장',
          image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 9,
            max: 12
          },
          views: 110,
          comments: 8,
          bookmarks: 12,
          reviewed: false,
          creatorId: 3 // 다른 사용자가 생성한 약속
        },
        {
          id: 107,
          title: '수영 초보 모임',
          category: '수영',
          date: '2024년 02월 10일 (토) 10:00',
          location: '서울시 송파구 수영장',
          image: 'https://images.unsplash.com/photo-1560090995-01632a28895b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 5,
            max: 8
          },
          views: 80,
          comments: 3,
          bookmarks: 5,
          reviewed: true,
          creatorId: 2 // 다른 사용자가 생성한 약속
        },
        {
          id: 108,
          title: '배드민턴 동호회',
          category: '배드민턴',
          date: '2024년 02월 05일 (월) 19:00',
          location: '서울시 강남구 체육관',
          image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 4,
            max: 4
          },
          views: 70,
          comments: 5,
          bookmarks: 7,
          reviewed: true,
          creatorId: 1 // 현재 사용자가 생성한 약속
        },
        {
          id: 109,
          title: '요가 명상 모임',
          category: '요가',
          date: '2024년 02월 01일 (목) 08:00',
          location: '서울시 마포구 요가 스튜디오',
          image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 7,
            max: 10
          },
          views: 65,
          comments: 4,
          bookmarks: 8,
          reviewed: true,
          creatorId: 3 // 다른 사용자가 생성한 약속
        },
        {
          id: 110,
          title: '등산 모임',
          category: '등산',
          date: '2024년 01월 28일 (일) 08:00',
          location: '서울시 도봉구 북한산',
          image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 8,
            max: 12
          },
          views: 95,
          comments: 7,
          bookmarks: 10,
          reviewed: true,
          creatorId: 2 // 다른 사용자가 생성한 약속
        },
        {
          id: 111,
          title: '자전거 한강 라이딩',
          category: '자전거',
          date: '2024년 01월 20일 (토) 15:00',
          location: '서울시 여의도 한강공원',
          image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 6,
            max: 15
          },
          views: 85,
          comments: 5,
          bookmarks: 9,
          reviewed: false,
          creatorId: 1 // 현재 사용자가 생성한 약속
        },
        {
          id: 112,
          title: '골프 레슨 모임',
          category: '골프',
          date: '2024년 01월 15일 (월) 14:00',
          location: '서울시 강남구 골프 연습장',
          image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 4,
            max: 6
          },
          views: 70,
          comments: 3,
          bookmarks: 6,
          reviewed: true,
          creatorId: 3 // 다른 사용자가 생성한 약속
        },
        {
          id: 113,
          title: '필라테스 함께해요',
          category: '필라테스',
          date: '2024년 01월 10일 (수) 19:00',
          location: '서울시 강남구 필라테스 스튜디오',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 5,
            max: 8
          },
          views: 65,
          comments: 4,
          bookmarks: 7,
          reviewed: false,
          creatorId: 2 // 다른 사용자가 생성한 약속
        },
        {
          id: 114,
          title: '농구 한 판 어때요?',
          category: '농구',
          date: '2024년 01월 05일 (금) 18:00',
          location: '서울시 송파구 농구장',
          image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 8,
            max: 10
          },
          views: 90,
          comments: 6,
          bookmarks: 11,
          reviewed: true,
          creatorId: 1 // 현재 사용자가 생성한 약속
        },
        {
          id: 115,
          title: '볼링 한 게임 어때요?',
          category: '볼링',
          date: '2024년 01월 02일 (화) 20:00',
          location: '서울시 강남구 볼링장',
          image: 'https://images.unsplash.com/photo-1538511059256-0642a3a9fe71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 4,
            max: 6
          },
          views: 75,
          comments: 4,
          bookmarks: 8,
          reviewed: true,
          creatorId: 3 // 다른 사용자가 생성한 약속
        },
        {
          id: 116,
          title: '스키 모임',
          category: '스키',
          date: '2023년 12월 25일 (월) 10:00',
          location: '경기도 남양주시 스키장',
          image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 7,
            max: 10
          },
          views: 85,
          comments: 5,
          bookmarks: 9,
          reviewed: true,
          creatorId: 2 // 다른 사용자가 생성한 약속
        },
        {
          id: 117,
          title: '보드게임 모임',
          category: '보드게임',
          date: '2023년 12월 20일 (수) 19:00',
          location: '서울시 마포구 보드게임 카페',
          image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 6,
            max: 8
          },
          views: 70,
          comments: 4,
          bookmarks: 7,
          reviewed: false,
          creatorId: 1 // 현재 사용자가 생성한 약속
        },
        {
          id: 118,
          title: '당구 한 게임 어때요?',
          category: '당구',
          date: '2023년 12월 15일 (금) 20:00',
          location: '서울시 강남구 당구장',
          image: 'https://images.unsplash.com/photo-1611250503393-9424f314d265?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
          participants: {
            current: 3,
            max: 4
          },
          views: 60,
          comments: 3,
          bookmarks: 5,
          reviewed: true,
          creatorId: 3 // 다른 사용자가 생성한 약속
        }
      ];
      
      pastAppointments.value = appointmentsData;
      
      console.log('종료된 약속 목록을 성공적으로 가져왔습니다:', pastAppointments.value);
    } catch (error) {
      console.error('종료된 약속 목록을 가져오는 중 오류가 발생했습니다:', error);
      alert('약속 목록을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      isLoadingPast.value = false;
    }
  };
  
  // 현재 페이지에 표시할 모집 중인 약속 목록
  const paginatedActiveAppointments = computed(() => {
    const startIndex = (activeCurrentPage.value - 1) * activeItemsPerPage;
    const endIndex = startIndex + activeItemsPerPage;
    return activeAppointments.value.slice(startIndex, endIndex);
  });
  
  // 현재 페이지에 표시할 종료된 약속 목록
  const paginatedPastAppointments = computed(() => {
    const startIndex = (pastCurrentPage.value - 1) * pastItemsPerPage;
    const endIndex = startIndex + pastItemsPerPage;
    return pastAppointments.value.slice(startIndex, endIndex);
  });
  
  // 모집 중인 약속 총 페이지 수
  const activeTotalPages = computed(() => {
    return Math.ceil(activeAppointments.value.length / activeItemsPerPage);
  });
  
  // 종료된 약속 총 페이지 수
  const pastTotalPages = computed(() => {
    return Math.ceil(pastAppointments.value.length / pastItemsPerPage);
  });
  
  // 모집 중인 약속 페이지 번호 배열
  const activePageNumbers = computed(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (activeTotalPages.value <= maxVisiblePages) {
      // 총 페이지 수가 최대 표시 페이지 수보다 작거나 같으면 모든 페이지 번호 표시
      for (let i = 1; i <= activeTotalPages.value; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 주변의 페이지 번호만 표시
      let startPage = Math.max(1, activeCurrentPage.value - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;
      
      if (endPage > activeTotalPages.value) {
        endPage = activeTotalPages.value;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  });
  
  // 종료된 약속 페이지 번호 배열
  const pastPageNumbers = computed(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (pastTotalPages.value <= maxVisiblePages) {
      // 총 페이지 수가 최대 표시 페이지 수보다 작거나 같으면 모든 페이지 번호 표시
      for (let i = 1; i <= pastTotalPages.value; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 주변의 페이지 번호만 표시
      let startPage = Math.max(1, pastCurrentPage.value - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;
      
      if (endPage > pastTotalPages.value) {
        endPage = pastTotalPages.value;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  });
  
  // 특정 활성 페이지로 이동
  const goToActivePage = (page) => {
    if (page >= 1 && page <= activeTotalPages.value) {
      activeCurrentPage.value = page;
      window.scrollTo(0, 0);
    }
  };
  
  // 특정 종료된 페이지로 이동
  const goToPastPage = (page) => {
    if (page >= 1 && page <= pastTotalPages.value) {
      pastCurrentPage.value = page;
      window.scrollTo(0, 0);
    }
  };
  
  // 약속 생성자인지 확인
  const isCreator = (creatorId) => {
    return currentUserId.value === creatorId;
  };
  
  // 약속에 신청했는지 확인
  const hasApplied = (appointmentId) => {
    return appliedAppointments.value.includes(appointmentId);
  };
  
  // 약속 생성 페이지로 이동
  const createAppointment = () => {
    router.push(`/club/${clubId.value}/appointment/create`);
  };
  
  // 약속 상세 페이지로 이동
  const viewAppointment = (id) => {
    router.push(`/appointment/${id}`);
  };
  
  // 신청자 목록 페이지로 이동
  const viewApplicants = (id) => {
    router.push(`/appointment/${id}/applicants`);
  };
  
  // 약속 수정 페이지로 이동
  const editAppointment = (id) => {
    router.push(`/appointment/${id}/edit`);
  };
  
  // 참여자 목록 페이지로 이동
  const viewParticipants = (id) => {
    router.push(`/appointment/${id}/participants`);
  };
  
  // 참여자 평가 페이지로 이동
  const reviewParticipants = (id) => {
    router.push(`/appointment/${id}/review`);
  };
  
  // 약속 참여 신청
  const applyAppointment = async (id) => {
    try {
      // API 호출을 시뮬레이션 (실제 구현 시에는 아래 주석을 해제하고 사용)
      // const response = await fetch(`/api/appointments/${id}/apply`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const data = await response.json();
      
      // API 응답 시뮬레이션 (0.5초 지연)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 신청 성공 시뮬레이션
      appliedAppointments.value.push(id);
      
      // 참여자 수 증가
      const appointment = activeAppointments.value.find(a => a.id === id);
      if (appointment) {
        appointment.participants.current++;
        appointment.applicants++;
      }
      
      alert('약속 참여 신청이 완료되었습니다.');
      console.log('약속 참여 신청 성공:', id);
    } catch (error) {
      console.error('약속 참여 신청 중 오류가 발생했습니다:', error);
      alert('약속 참여 신청에 실패했습니다. 다시 시도해주세요.');
    }
  };
  
  // 약속 참여 취소
  const cancelApplication = async (id) => {
    try {
      // API 호출을 시뮬레이션 (실제 구현 시에는 아래 주석을 해제하고 사용)
      // const response = await fetch(`/api/appointments/${id}/cancel`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const data = await response.json();
      
      // API 응답 시뮬레이션 (0.5초 지연)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 신청 취소 성공 시뮬레이션
      appliedAppointments.value = appliedAppointments.value.filter(appId => appId !== id);
      
      // 참여자 수 감소
      const appointment = activeAppointments.value.find(a => a.id === id);
      if (appointment) {
        appointment.participants.current--;
        appointment.applicants--;
      }
      
      alert('약속 참여 신청이 취소되었습니다.');
      console.log('약속 참여 취소 성공:', id);
    } catch (error) {
      console.error('약속 참여 취소 중 오류가 발생했습니다:', error);
      alert('약속 참여 취소에 실패했습니다. 다시 시도해주세요.');
    }
  };
  
  // 뒤로가기
  const goBack = () => {
    router.go(-1);
  };
  
  onMounted(() => {
    // 클럽 정보 가져오기
    fetchClubInfo();
    
    // 모집 중인 약속 목록 가져오기
    fetchActiveAppointments();
    
    // 종료된 약속 목록 가져오기
    fetchPastAppointments();
    
    // 탭 초기화
    const tabEl = document.querySelector('#appointmentTabs button[data-bs-target="#active-appointments"]');
    if (tabEl && typeof bootstrap !== 'undefined') {
      new bootstrap.Tab(tabEl).show();
    }
  });
  </script>
  
  <style scoped>
  /* 클럽 헤더 스타일 */
  .club-header {
    padding: 1.5rem 0;
    border-bottom: 1px solid #dee2e6;
  }
  
  .club-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #e9ecef;
  }
  
  .club-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .club-name {
    font-size: 1.75rem;
    font-weight: 700;
    color: #333;
  }
  
  .club-description {
    font-size: 1rem;
  }
  
  /* 섹션 스타일 */
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
  
  .section-description {
    color: #6c757d;
  }
  
  /* 탭 네비게이션 스타일 */
  .nav-tabs {
    border-bottom: 1px solid #dee2e6;
  }
  
  .nav-tabs .nav-link {
    color: #6c757d;
    border: none;
    padding: 0.75rem 1.5rem;
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
  
  /* 페이지네이션 스타일 */
  .pagination .page-link {
    color: #495057;
    border-color: #dee2e6;
  }
  
  .pagination .page-item.active .page-link {
    background-color: #37715D;
    border-color: #37715D;
    color: white;
  }
  
  .pagination .page-item.disabled .page-link {
    color: #adb5bd;
  }
  
  /* 약속 카드 스타일 */
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
    flex-wrap: wrap;
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
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    .appointment-actions {
      flex-direction: column;
    }
    
    .appointment-actions button {
      width: 100%;
      margin-bottom: 0.5rem;
    }
    
    .club-name {
      font-size: 1.5rem;
    }
    
    .club-avatar {
      width: 50px;
      height: 50px;
    }
  }
  </style>