<template>
    <div class="club-appointments-section container mb-5">
      <div class="section-header d-flex justify-content-between align-items-center mb-3">
        <h2 class="section-title fw-bold">클럽 약속</h2>
        <button class="btn btn-custom-primary btn-sm" @click="createAppointment" v-if="isClubMember">
          <i class="bi bi-plus-lg me-1"></i> 약속 만들기
        </button>
      </div>
      <p class="section-description mb-4">클럽 멤버들과 함께하는 다양한 약속에 참여해보세요!</p>
  
      <!-- 탭 네비게이션 -->
      <ul class="nav nav-tabs mb-4" id="appointmentTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="active-tab" data-bs-toggle="tab" data-bs-target="#active-appointments" 
            type="button" role="tab" aria-controls="active-appointments" aria-selected="true" @click="activeTabClicked">
            모집 중 <span class="badge bg-custom-primary ms-2">{{ activeAppointments.length }}</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="past-tab" data-bs-toggle="tab" data-bs-target="#past-appointments" 
            type="button" role="tab" aria-controls="past-appointments" aria-selected="false" @click="pastTabClicked">
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
            <div class="position-relative appointments-wrapper">
              <!-- 좌우 스크롤 버튼 -->
              <button class="navigation-btn navigation-btn-left" @click="prevActivePage" v-show="activeCurrentPage > 1">
                <i class="bi bi-chevron-left"></i>
              </button>
              
              <div class="appointments-container">
                <div class="row">
                  <div v-for="appointment in currentActiveAppointments" :key="appointment.id" class="col-md-4 mb-4">
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
              </div>
              
              <button class="navigation-btn navigation-btn-right" @click="nextActivePage" v-show="activeCurrentPage < Math.ceil(activeAppointments.length / 3)">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
  
            <div class="pagination-dots text-center mt-3" v-if="activeAppointments.length > 0">
              <span v-for="page in Math.ceil(activeAppointments.length / 3)" :key="'active-' + page" 
                    class="pagination-dot" 
                    :class="{ 'active': page === activeCurrentPage }"
                    @click="goToActivePage(page)"></span>
            </div>
  
            <div class="text-center mt-4" v-if="activeAppointmentsTotal > activeAppointments.length">
              <button class="btn btn-view-more" @click="viewAllActiveAppointments">
                <span>모든 약속 보기</span>
                <i class="bi bi-arrow-right-circle ms-2"></i>
              </button>
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
            <div class="position-relative appointments-wrapper">
              <!-- 좌우 스크롤 버튼 -->
              <button class="navigation-btn navigation-btn-left" @click="prevPastPage" v-show="pastCurrentPage > 1">
                <i class="bi bi-chevron-left"></i>
              </button>
              
              <div class="appointments-container">
                <div class="row">
                  <div v-for="appointment in currentPastAppointments" :key="appointment.id" class="col-md-4 mb-4">
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
              </div>
              
              <button class="navigation-btn navigation-btn-right" @click="nextPastPage" v-show="pastCurrentPage < Math.ceil(pastAppointments.length / 3)">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
  
            <div class="pagination-dots text-center mt-3" v-if="pastAppointments.length > 0">
              <span v-for="page in Math.ceil(pastAppointments.length / 3)" :key="'past-' + page" 
                    class="pagination-dot" 
                    :class="{ 'active': page === pastCurrentPage }"
                    @click="goToPastPage(page)"></span>
            </div>
  
            <div class="text-center mt-4" v-if="pastAppointmentsTotal > pastAppointments.length">
              <button class="btn btn-view-more" @click="viewAllPastAppointments">
                <span>모든 약속 보기</span>
                <i class="bi bi-arrow-right-circle ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { defineProps, defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'ClubAppointmentsSection',
    props: {
      clubId: {
        type: [String, Number],
        required: true
      }
    },
    setup(props) {
      const router = useRouter();
      const isLoadingActive = ref(true);
      const isLoadingPast = ref(true);
      const activeAppointments = ref([]);
      const pastAppointments = ref([]);
      const activeAppointmentsTotal = ref(0); // 전체 모집 중인 약속 수
      const pastAppointmentsTotal = ref(0); // 전체 종료된 약속 수
      const isClubMember = ref(true); // 실제로는 API에서 확인해야 함
      const currentUserId = ref(1); // 실제로는 로그인한 사용자 ID를 가져와야 함
      const appliedAppointments = ref([2]); // 사용자가 신청한 약속 ID 목록
      const pastTabLoaded = ref(false);
  
      // 페이지네이션 관련 상태 (모집 중인 약속)
      const activeCurrentPage = ref(1);
      const itemsPerPage = 3; // 한 페이지에 3개씩 표시
  
      // 페이지네이션 관련 상태 (종료된 약속)
      const pastCurrentPage = ref(1);
  
      // 현재 페이지에 표시할 모집 중인 약속 목록
      const currentActiveAppointments = computed(() => {
        const startIndex = (activeCurrentPage.value - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return activeAppointments.value.slice(startIndex, endIndex);
      });
  
      // 현재 페이지에 표시할 종료된 약속 목록
      const currentPastAppointments = computed(() => {
        const startIndex = (pastCurrentPage.value - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return pastAppointments.value.slice(startIndex, endIndex);
      });
  
      // 특정 활성 페이지로 이동
      const goToActivePage = (page) => {
        activeCurrentPage.value = page;
      };
  
      // 특정 종료된 페이지로 이동
      const goToPastPage = (page) => {
        pastCurrentPage.value = page;
      };
  
      // 이전 페이지로 이동 (모집 중인 약속)
      const prevActivePage = () => {
        if (activeCurrentPage.value > 1) {
          activeCurrentPage.value--;
        }
      };
  
      // 다음 페이지로 이동 (모집 중인 약속)
      const nextActivePage = () => {
        if (activeCurrentPage.value < Math.ceil(activeAppointments.value.length / itemsPerPage)) {
          activeCurrentPage.value++;
        }
      };
  
      // 이전 페이지로 이동 (종료된 약속)
      const prevPastPage = () => {
        if (pastCurrentPage.value > 1) {
          pastCurrentPage.value--;
        }
      };
  
      // 다음 페이지로 이동 (종료된 약속)
      const nextPastPage = () => {
        if (pastCurrentPage.value < Math.ceil(pastAppointments.value.length / itemsPerPage)) {
          pastCurrentPage.value++;
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
  
      // 모집 중인 약속 목록 가져오기
      const fetchActiveAppointments = async () => {
        isLoadingActive.value = true;
        
        try {
          // API 호출을 시뮬레이션 (실제 구현 시에는 아래 주석을 해제하고 사용)
          // const response = await fetch(`/api/clubs/${props.clubId}/appointments/active?limit=9`);
          // const data = await response.json();
          
          // API 응답 시뮬레이션 (1초 지연)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // API에서 받아온 데이터 (시뮬레이션) - 9개의 약속
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
            }
          ];
          
          activeAppointments.value = appointmentsData;
          activeAppointmentsTotal.value = 15; // 전체 모집 중인 약속 수 (시뮬레이션)
          
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
          // const response = await fetch(`/api/clubs/${props.clubId}/appointments/past?limit=9`);
          // const data = await response.json();
          
          // API 응답 시뮬레이션 (1초 지연)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // API에서 받아온 데이터 (시뮬레이션) - 9개의 약속
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
            }
          ];
          
          pastAppointments.value = appointmentsData;
          pastAppointmentsTotal.value = 18; // 전체 종료된 약속 수 (시뮬레이션)
          pastTabLoaded.value = true;
          
          console.log('종료된 약속 목록을 성공적으로 가져왔습니다:', pastAppointments.value);
        } catch (error) {
          console.error('종료된 약속 목록을 가져오는 중 오류가 발생했습니다:', error);
          alert('약속 목록을 불러오는데 실패했습니다. 다시 시도해주세요.');
        } finally {
          isLoadingPast.value = false;
        }
      };
  
      // 약속 생성 페이지로 이동
      const createAppointment = () => {
        router.push(`/club/${props.clubId}/appointment/create`);
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
  
      // 모든 모집 중인 약속 페이지로 이동
      const viewAllActiveAppointments = () => {
        router.push(`/club/appointment/${props.clubId}`);
      };
  
      // 모든 종료된 약속 페이지로 이동
      const viewAllPastAppointments = () => {
        router.push(`/club/${props.clubId}/appointments/past`);
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
  
      // 활성 탭 클릭 시
      const activeTabClicked = () => {
        if (isLoadingActive.value && activeAppointments.value.length === 0) {
          fetchActiveAppointments();
        }
      };
  
      // 종료됨 탭 클릭 시
      const pastTabClicked = () => {
        if (!pastTabLoaded.value) {
          fetchPastAppointments();
        }
      };
  
      onMounted(() => {
        // 모집 중인 약속 목록 가져오기
        fetchActiveAppointments();
      });
  
      return {
        isLoadingActive,
        isLoadingPast,
        activeAppointments,
        pastAppointments,
        activeAppointmentsTotal,
        pastAppointmentsTotal,
        isClubMember,
        currentUserId,
        appliedAppointments,
        pastTabLoaded,
        activeCurrentPage,
        pastCurrentPage,
        currentActiveAppointments,
        currentPastAppointments,
        goToActivePage,
        goToPastPage,
        prevActivePage,
        nextActivePage,
        prevPastPage,
        nextPastPage,
        isCreator,
        hasApplied,
        createAppointment,
        viewAppointment,
        viewApplicants,
        editAppointment,
        viewParticipants,
        reviewParticipants,
        viewAllActiveAppointments,
        viewAllPastAppointments,
        applyAppointment,
        cancelApplication,
        activeTabClicked,
        pastTabClicked
      };
    }
  });
  </script>
  
  <style scoped>
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
  
  /* 약속 컨테이너 */
  .appointments-wrapper {
    position: relative;
    padding: 0 50px;
    margin-bottom: 20px;
  }
  
  .appointments-container {
    padding: 0.5rem 0;
    position: relative;
    overflow: hidden;
  }
  
  /* 네비게이션 버튼 스타일 */
  .navigation-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: white;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s;
  }
  
  .navigation-btn:hover {
    background-color: #f8f9fa;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .navigation-btn i {
    font-size: 1.2rem;
    color: #495057;
  }
  
  .navigation-btn-left {
    left: 0;
  }
  
  .navigation-btn-right {
    right: 0;
  }
  
  /* 더보기 버튼 스타일 */
  .btn-view-more {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.5rem;
    border-radius: 2rem;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s;
    margin-top: 1rem;
  }
  
  .btn-view-more:hover {
    background-color: #e9ecef;
    color: #212529;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .btn-view-more i {
    font-size: 1.1rem;
  }
  
  /* 페이지네이션 점 스타일 */
  .pagination-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 1rem;
  }
  
  .pagination-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #dee2e6;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .pagination-dot.active {
    background-color: #37715D;
    transform: scale(1.2);
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
    .appointments-wrapper {
      padding: 0 40px;
    }
    
    .navigation-btn {
      width: 35px;
      height: 35px;
    }
    
    .appointment-actions {
      flex-direction: column;
    }
    
    .appointment-actions button {
      width: 100%;
    }
  }
  </style>