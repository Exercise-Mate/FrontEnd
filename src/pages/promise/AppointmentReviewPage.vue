<template>
    <div class="appointment-review-page">
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
  
      <!-- 헤더 섹션 -->
      <div class="header-section">
        <div class="header-image-container">
          <img :src="appointment.image" alt="약속 이미지" class="header-image">
          <div class="header-overlay"></div>
          <div class="header-content">
            <h1 class="header-title">약속한 사람들 평가</h1>
          </div>
        </div>
      </div>
  
      <!-- 약속 정보 섹션 -->
      <div class="appointment-info-section">
        <div class="container">
          <div class="appointment-info-card">
            <h2 class="appointment-name">약속명: {{ appointment.title }}</h2>
            <div class="appointment-details">
              <div class="detail-item">
                <i class="bi bi-calendar-event"></i>
                <span>{{ appointment.date }}</span>
              </div>
              <div class="detail-item">
                <i class="bi bi-geo-alt"></i>
                <span>{{ appointment.location }}</span>
              </div>
              <div class="detail-item">
                <i class="bi bi-people"></i>
                <span>참여자 {{ participants.length }}명</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 참여자 평가 섹션 -->
      <div class="participants-section">
        <div class="container">
          <div class="section-header">
            <h3 class="section-title">참여자 평가</h3>
            <p class="section-subtitle">함께한 참여자들에 대한 솔직한 평가를 남겨주세요.</p>
          </div>
  
          <!-- 참여자 목록 -->
          <div class="participants-list">
            <div v-for="(participant, index) in participants" :key="participant.id" class="participant-card">
              <div class="participant-header">
                <div class="participant-info">
                  <div class="participant-avatar">
                    <img :src="participant.avatar" :alt="participant.name">
                    <div v-if="participant.isHost" class="host-badge">주최자</div>
                  </div>
                  <div class="participant-details">
                    <h4 class="participant-name">{{ participant.name }} <span class="participant-badge">{{ participant.badge }}</span></h4>
                    <p class="participant-meta">
                      <i class="bi bi-clock"></i> 참여 시간: {{ participant.joinTime }}
                      <span class="separator">•</span>
                      <i class="bi bi-geo"></i> 참여 장소: {{ participant.joinLocation }}
                    </p>
                  </div>
                </div>
                <div class="participant-actions">
                  <button class="btn-toggle" @click="toggleReviewOptions(index)">
                    <i class="bi" :class="participant.showOptions ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                  </button>
                </div>
              </div>
  
              <!-- 참여자 소개 -->
              <div class="participant-bio" v-if="participant.bio">
                <p>{{ participant.bio }}</p>
              </div>
  
              <!-- 평가 옵션 -->
              <div class="review-options" v-if="participant.showOptions">
                <div class="review-options-header">
                  <h5>이 참여자를 어떻게 평가하시겠어요?</h5>
                  <p class="text-muted small">여러 항목을 선택할 수 있습니다</p>
                </div>
                
                <div class="review-options-grid">
                  <div 
                    v-for="option in reviewOptions" 
                    :key="option.id" 
                    class="review-option-item"
                    :class="{ 
                      'selected': participant.selectedOptions.includes(option.id),
                      'positive': option.type === 'positive',
                      'negative': option.type === 'negative'
                    }"
                    @click="toggleReviewOption(participant, option.id)"
                  >
                    <span>{{ option.text }}</span>
                  </div>
                </div>
                
                <!-- 추가 코멘트 -->
                <div class="review-comment">
                  <textarea 
                    class="form-control" 
                    rows="2" 
                    placeholder="추가 코멘트를 남겨주세요 (선택사항)" 
                    v-model="participant.comment"
                  ></textarea>
                </div>
                
                <!-- 제출 버튼 -->
                <div class="review-submit">
                  <button 
                    class="btn btn-custom-primary" 
                    :disabled="participant.selectedOptions.length === 0"
                    @click="submitReview(participant)"
                  >
                    평가 제출
                  </button>
                </div>
              </div>
              
              <!-- 제출 완료 메시지 -->
              <div class="review-submitted" v-if="participant.reviewSubmitted">
                <div class="review-submitted-icon">
                  <i class="bi bi-check-circle-fill"></i>
                </div>
                <div class="review-submitted-message">
                  <h5>평가가 제출되었습니다</h5>
                  <p>소중한 평가에 감사합니다!</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 모든 평가 완료 시 버튼 -->
          <div class="all-reviews-complete" v-if="allReviewsSubmitted">
            <button class="btn btn-lg btn-custom-primary" @click="finishReviews">
              모든 평가 완료
            </button>
          </div>
        </div>
      </div>
      
      <!-- 완료 모달 -->
      <div class="modal fade" id="reviewCompleteModal" tabindex="-1" aria-labelledby="reviewCompleteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 class="modal-title" id="reviewCompleteModalLabel">평가 완료</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center py-4">
              <div class="success-icon mb-3">
                <i class="bi bi-check-circle-fill text-success fs-1"></i>
              </div>
              <h4 class="fw-bold mb-2">모든 평가가 완료되었습니다!</h4>
              <p class="text-secondary mb-4">
                소중한 평가에 감사드립니다.<br>
                더 나은 약속 경험을 위해 노력하겠습니다.
              </p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <button type="button" class="btn btn-custom-primary px-4" @click="goToHome">
                홈으로 이동
              </button>
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
  const reviewCompleteModal = ref(null);
  
  // 약속 정보 (실제로는 API에서 가져올 것)
  const appointment = ref({
    id: 1,
    title: '오늘 클라이밍 한탕 뛰자',
    date: '2024년 04월 08일 (목) 19:00',
    location: '서울시 동작구 클라이밍 센터',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80'
  });
  
  // 참여자 데이터 (실제로는 API에서 가져올 것)
  const participants = ref([
    {
      id: 1,
      name: '리닝린님',
      badge: '🧗‍♀️',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      joinTime: '19:00',
      joinLocation: '서울시 동작구',
      bio: 'a.k.a 여자 김종주. 클라이밍 하는 그 남자지~~',
      isHost: true,
      showOptions: true,
      selectedOptions: [],
      comment: '',
      reviewSubmitted: false
    },
    {
      id: 2,
      name: '클라이밍왕님',
      badge: '🏆',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      joinTime: '19:05',
      joinLocation: '서울시 동작구',
      bio: '클라이밍 3년차, 함께 즐겁게 운동해요!',
      isHost: false,
      showOptions: false,
      selectedOptions: [],
      comment: '',
      reviewSubmitted: false
    },
    {
      id: 3,
      name: '초보등반가님',
      badge: '🔰',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      joinTime: '19:10',
      joinLocation: '서울시 동작구',
      bio: '클라이밍 처음 도전합니다. 잘 부탁드려요!',
      isHost: false,
      showOptions: false,
      selectedOptions: [],
      comment: '',
      reviewSubmitted: false
    }
  ]);
  
  // 평가 옵션
  const reviewOptions = [
    { id: 1, text: '다른 참가자들에게도 추천', type: 'positive' },
    { id: 2, text: '참여자 매너가 좋았어요', type: 'positive' },
    { id: 3, text: '시간 약속을 잘 지켰어요', type: 'positive' },
    { id: 4, text: '친절하고 배려가 좋았어요', type: 'positive' },
    { id: 5, text: '운동 실력이 좋았어요', type: 'positive' },
    { id: 6, text: '재미있게 해주셨어요', type: 'positive' },
    { id: 7, text: '약속시간에 늦게 도착했어요', type: 'negative' },
    { id: 8, text: '매너가 아쉬웠어요', type: 'negative' },
    { id: 9, text: '다음에는 함께 하고 싶지 않아요', type: 'negative' }
  ];
  
  // 모든 평가가 제출되었는지 확인
  const allReviewsSubmitted = computed(() => {
    return participants.value.every(participant => participant.reviewSubmitted);
  });
  
  // 평가 옵션 토글
  const toggleReviewOptions = (index) => {
    participants.value[index].showOptions = !participants.value[index].showOptions;
  };
  
  // 평가 옵션 선택/해제
  const toggleReviewOption = (participant, optionId) => {
    const index = participant.selectedOptions.indexOf(optionId);
    if (index === -1) {
      participant.selectedOptions.push(optionId);
    } else {
      participant.selectedOptions.splice(index, 1);
    }
  };
  
  // 평가 제출
  const submitReview = (participant) => {
    // 실제로는 API 호출하여 평가 데이터 저장
    console.log('제출된 평가:', {
      participantId: participant.id,
      selectedOptions: participant.selectedOptions,
      comment: participant.comment
    });
    
    // 제출 완료 상태로 변경
    participant.reviewSubmitted = true;
    participant.showOptions = false;
  };
  
  // 모든 평가 완료
  const finishReviews = () => {
    if (reviewCompleteModal.value) {
      reviewCompleteModal.value.show();
    }
  };
  
  // 홈으로 이동
  const goToHome = () => {
    router.push('/');
  };
  
  // 뒤로가기
  const goBack = () => {
    router.go(-1);
  };
  
  onMounted(() => {
    // Bootstrap 모달 초기화
    setTimeout(() => {
      const modalEl = document.getElementById('reviewCompleteModal');
      if (modalEl && typeof bootstrap !== 'undefined') {
        reviewCompleteModal.value = new bootstrap.Modal(modalEl);
      }
    }, 500);
  });
  </script>
  
  <style scoped>
  /* 전체 페이지 스타일 */
  .appointment-review-page {
    background-color: #f8f9fa;
    min-height: 100vh;
  }
  
  /* 헤더 섹션 스타일 */
  .header-section {
    position: relative;
    margin-bottom: 2rem;
  }
  
  .header-image-container {
    height: 240px;
    overflow: hidden;
    position: relative;
  }
  
  .header-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .header-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7));
  }
  
  .header-content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 2rem;
    color: white;
    z-index: 2;
  }
  
  .header-title {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  /* 약속 정보 섹션 스타일 */
  .appointment-info-section {
    margin-bottom: 2rem;
  }
  
  .appointment-info-card {
    background-color: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .appointment-name {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .appointment-details {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c757d;
  }
  
  .detail-item i {
    color: #37715D;
  }
  
  /* 참여자 섹션 스타일 */
  .participants-section {
    padding-bottom: 3rem;
  }
  
  .section-header {
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .section-subtitle {
    color: #6c757d;
    margin-bottom: 0;
  }
  
  /* 참여자 카드 스타일 */
  .participants-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .participant-card {
    background-color: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  
  .participant-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .participant-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #f1f3f5;
  }
  
  .participant-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .participant-avatar {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 3px solid white;
  }
  
  .participant-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .host-badge {
    position: absolute;
    bottom: -5px;
    right: -5px;
    background-color: #37715D;
    color: white;
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 1rem;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .participant-details {
    flex: 1;
  }
  
  .participant-name {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #333;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .participant-badge {
    font-size: 1.2rem;
    line-height: 1;
  }
  
  .participant-meta {
    font-size: 0.85rem;
    color: #6c757d;
    margin-bottom: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .separator {
    color: #ced4da;
  }
  
  .participant-actions {
    display: flex;
    align-items: center;
  }
  
  .btn-toggle {
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
  
  .btn-toggle:hover {
    color: #37715D;
  }
  
  /* 참여자 소개 스타일 */
  .participant-bio {
    padding: 0 1.5rem 1.5rem;
    color: #495057;
    font-style: italic;
    border-bottom: 1px solid #f1f3f5;
  }
  
  .participant-bio p {
    margin-bottom: 0;
  }
  
  /* 평가 옵션 스타일 */
  .review-options {
    padding: 1.5rem;
    background-color: #f8f9fa;
  }
  
  .review-options-header {
    margin-bottom: 1.25rem;
  }
  
  .review-options-header h5 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #333;
  }
  
  .review-options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .review-option-item {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    background-color: white;
    border: 1px solid #dee2e6;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  
  .review-option-item:hover {
    border-color: #37715D;
    background-color: #f1f8f6;
  }
  
  .review-option-item.selected.positive {
    background-color: #d4edda;
    border-color: #c3e6cb;
    color: #155724;
  }
  
  .review-option-item.selected.negative {
    background-color: #f8d7da;
    border-color: #f5c6cb;
    color: #721c24;
  }
  
  .review-comment {
    margin-bottom: 1.5rem;
  }
  
  .review-submit {
    display: flex;
    justify-content: center;
  }
  
  /* 제출 완료 메시지 스타일 */
  .review-submitted {
    padding: 1.5rem;
    background-color: #f1f8f6;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .review-submitted-icon {
    font-size: 2rem;
    color: #37715D;
  }
  
  .review-submitted-message h5 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #333;
  }
  
  .review-submitted-message p {
    margin-bottom: 0;
    color: #6c757d;
  }
  
  /* 모든 평가 완료 버튼 스타일 */
  .all-reviews-complete {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
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
  
  .btn-custom-primary:disabled {
    background-color: #6c757d !important;
    border-color: #6c757d !important;
    opacity: 0.65;
  }
  
  /* 반응형 스타일 */
  @media (max-width: 768px) {
    .header-title {
      font-size: 1.8rem;
    }
    
    .appointment-name {
      font-size: 1.3rem;
    }
    
    .appointment-details {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .participant-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .participant-info {
      width: 100%;
    }
    
    .participant-actions {
      align-self: flex-end;
    }
    
    .review-options-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
  
  