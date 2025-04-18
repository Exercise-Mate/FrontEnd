<template>
    <div class="club-join-page">
      <div class="container py-4">
        <!-- 로딩 상태 표시 -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-custom-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">클럽 정보를 불러오는 중입니다...</p>
        </div>
  
        <div v-else>
  
          <!-- 클럽 정보 섹션 -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <div class="row">
                <div class="col-md-8">
                  <!-- 클럽명 -->
                  <h3 class="fw-bold mb-3">{{ clubInfo.name }}</h3>
                  
                  <!-- 클럽 소개 -->
                  <div class="club-description mb-4">
                    <p v-for="(line, index) in clubDescriptionLines" :key="index" class="mb-1">
                      {{ line }}
                    </p>
                  </div>
                </div>
                <div class="col-md-4">
                  <!-- 클럽 이미지 -->
                  <div class="club-image-container">
                    <img 
                      :src="clubInfo.imgUrl || '/placeholder.jpg'" 
                      alt="클럽 이미지" 
                      class="img-fluid rounded"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- 가입 폼 섹션 -->
          <form @submit.prevent="submitJoinRequest">
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-body p-4">
                <h5 class="fw-bold mb-3 d-flex align-items-center">
                  <i class="bi bi-person-plus custom-primary me-2"></i>
                  가입 정보 입력
                </h5>
  
                <!-- 운동 실력 선택 -->
                <div class="mb-4">
                  <label class="form-label fw-medium">운동 실력<span class="text-danger ms-1">*</span></label>
                  
                  <div v-if="isSkillLevelInvalid" class="alert alert-warning mb-3">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    이 클럽은 {{ clubInfo.sportAbilityMin || '입문' }}부터 {{ clubInfo.sportAbilityMax || '상급' }}까지의 실력을 가진 회원을 모집하고 있습니다.
                  </div>
                  
                  <div class="skill-level-buttons">
                    <div class="btn-group w-100" role="group">
                      <input 
                        type="radio" 
                        class="btn-check" 
                        id="skill1" 
                        value="입문" 
                        v-model="joinData.sportAbility"
                        :disabled="!isSkillLevelAllowed('입문')"
                      >
                      <label class="btn btn-outline-custom-primary" for="skill1">입문</label>
            
                      <input 
                        type="radio" 
                        class="btn-check" 
                        id="skill2" 
                        value="초보" 
                        v-model="joinData.sportAbility"
                        :disabled="!isSkillLevelAllowed('초보')"
                      >
                      <label class="btn btn-outline-custom-primary" for="skill2">초보</label>
            
                      <input 
                        type="radio" 
                        class="btn-check" 
                        id="skill3" 
                        value="중급" 
                        v-model="joinData.sportAbility"
                        :disabled="!isSkillLevelAllowed('중급')"
                      >
                      <label class="btn btn-outline-custom-primary" for="skill3">중급</label>
            
                      <input 
                        type="radio" 
                        class="btn-check" 
                        id="skill4" 
                        value="상급" 
                        v-model="joinData.sportAbility"
                        :disabled="!isSkillLevelAllowed('상급')"
                      >
                      <label class="btn btn-outline-custom-primary" for="skill4">상급</label>
                    </div>
                  </div>
                </div>
  
                <!-- 가입 질문 응답 -->
                <div v-if="clubInfo.questions && clubInfo.questions.length > 0">
                  <h5 class="fw-medium mb-3">가입 질문</h5>
                  
                  <div v-for="(question, index) in clubInfo.questions" :key="index" class="mb-4">
                    <label :for="`answer${index}`" class="form-label">
                      질문 {{ index + 1 }}. {{ question.text }}
                      <span class="text-danger ms-1">*</span>
                    </label>
                    <textarea 
                      :id="`answer${index}`" 
                      class="form-control" 
                      rows="3" 
                      v-model="joinData.answers[index]"
                      placeholder="답변을 입력해주세요"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- 제출 버튼 -->
            <div class="d-flex justify-content-between mt-4">
              <button type="button" class="btn btn-outline-secondary px-4 py-2" @click="goBack">
                <i class="bi bi-arrow-left me-1"></i> 이전으로
              </button>
              <button 
                type="submit" 
                class="btn btn-custom-primary px-5 py-2 fw-bold"
                :disabled="isSubmitDisabled"
              >
                클럽 가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- 가입 완료 모달 -->
      <div class="modal fade" id="joinCompleteModal" tabindex="-1" aria-labelledby="joinCompleteModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 class="modal-title" id="joinCompleteModalLabel">가입 신청 완료</h5>
              <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center py-4">
              <div class="success-icon mb-3">
                <i class="bi bi-check-circle-fill text-success fs-1"></i>
              </div>
              <h4 class="fw-bold mb-2">클럽 가입 신청이 완료되었습니다!</h4>
              <p class="text-secondary mb-4">
                {{ clubInfo.name }} 클럽의 관리자 승인 후 가입이 확정됩니다.<br>
                승인 결과는 알림을 통해 안내드립니다.
              </p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <button type="button" class="btn btn-custom-primary px-4" @click="goToClubDetail">
                클럽 페이지 바로가기
              </button>
              <button type="button" class="btn btn-outline-custom-primary px-4" @click="goToHome">
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import * as bootstrap from 'bootstrap';
  import { Modal } from 'bootstrap';
  
  const router = useRouter();
  const route = useRoute();
  const joinCompleteModal = ref(null);
  const isSubmitting = ref(false);
  const isLoading = ref(true);
  
  // 클럽 정보 초기화
  const clubInfo = ref({
    id: null,
    name: '',
    description: '',
    imgUrl: '',
    sportAbilityMin: '',
    sportAbilityMax: '',
    questions: []
  });
  
  // 클럽 설명을 줄바꿈으로 분리
  const clubDescriptionLines = computed(() => {
    return clubInfo.value.description ? clubInfo.value.description.split('\n') : [];
  });
  
  // 가입 신청 데이터
  const joinData = ref({
    clubId: null,
    sportAbility: '',
    answers: []
  });
  
  // 운동 실력 유효성 검사
  const isSkillLevelInvalid = computed(() => {
    if (!joinData.value.sportAbility) return false;
    
    return !isSkillLevelAllowed(joinData.value.sportAbility);
  });
  
  // 제출 버튼 비활성화 조건
  const isSubmitDisabled = computed(() => {
    // 운동 실력 선택 여부
    if (!joinData.value.sportAbility) return true;
    
    // 운동 실력이 클럽 요구 범위 내인지 확인
    if (isSkillLevelInvalid.value) return true;
    
    // 모든 질문에 답변했는지 확인
    if (clubInfo.value.questions && clubInfo.value.questions.length > 0) {
      for (let i = 0; i < clubInfo.value.questions.length; i++) {
        if (!joinData.value.answers[i] || joinData.value.answers[i].trim() === '') {
          return true;
        }
      }
    }
    
    return isSubmitting.value;
  });
  
  // 운동 실력이 클럽 요구 범위 내인지 확인하는 함수
  function isSkillLevelAllowed(level) {
    // 클럽에서 실력 제한을 두지 않은 경우
    if (!clubInfo.value.sportAbilityMin && !clubInfo.value.sportAbilityMax) {
      return true;
    }
    
    const skillLevels = ['입문', '초보', '중급', '상급'];
    const levelIndex = skillLevels.indexOf(level);
    const minIndex = skillLevels.indexOf(clubInfo.value.sportAbilityMin || '입문');
    const maxIndex = skillLevels.indexOf(clubInfo.value.sportAbilityMax || '상급');
    
    return levelIndex >= minIndex && levelIndex <= maxIndex;
  }
  
  // 클럽 정보 가져오기
  const fetchClubInfo = async () => {
    isLoading.value = true;
    
    try {
      // API 호출을 시뮬레이션 (실제 구현 시에는 아래 주석을 해제하고 사용)
      // const response = await fetch(`/api/clubs/${route.params.id}`);
      // const data = await response.json();
      
      // API 응답 시뮬레이션 (1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // API에서 받아온 데이터 (시뮬레이션)
      const apiResponse = {
        id: 1,
        name: '서울 클라이밍 크루',
        description: '우리는 클라이밍을 좋아하는 20~30대 모임입니다.\n우리는 클라이밍을 좋아하는 20~30대 모임입니다.\n우리는 클라이밍을 좋아하는 20~30대 모임입니다.',
        imgUrl: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80', // 클라이밍 이미지
        sportAbilityMin: '초보',
        sportAbilityMax: '상급',
        questions: [
          { id: 1, text: '저보다 잘하세요?' },
          { id: 2, text: '정말요?' },
          { id: 3, text: '진짜요?' }
        ]
      };
      
      // 받아온 데이터로 클럽 정보 업데이트
      clubInfo.value = apiResponse;
      
      // 클럽 ID 설정
      joinData.value.clubId = clubInfo.value.id;
      
      // 질문 수에 맞게 답변 배열 초기화
      if (clubInfo.value.questions && clubInfo.value.questions.length > 0) {
        joinData.value.answers = Array(clubInfo.value.questions.length).fill('');
      }
      
      console.log('클럽 정보를 성공적으로 가져왔습니다:', clubInfo.value);
    } catch (error) {
      console.error('클럽 정보를 가져오는 중 오류가 발생했습니다:', error);
      alert('클럽 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      isLoading.value = false;
    }
  };
  
  // 가입 신청 제출
  const submitJoinRequest = async () => {
    if (isSubmitting.value || isSubmitDisabled.value) return;
    
    isSubmitting.value = true;
    
    try {
      // API 요청 데이터 구성
      const requestData = {
        clubId: joinData.value.clubId,
        sportAbility: joinData.value.sportAbility,
        answers: joinData.value.answers.map((text, index) => ({
          questionId: clubInfo.value.questions[index].id,
          text: text
        }))
      };
      
      // API 호출을 시뮬레이션 (실제 구현 시에는 아래 주석을 해제하고 사용)
      // const response = await fetch('/api/club-join-requests', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('가입 신청에 실패했습니다.');
      // }
      
      // API 응답 시뮬레이션 (1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('가입 신청 데이터가 성공적으로 전송되었습니다:', requestData);
      
      // 성공 모달 표시
      if (joinCompleteModal.value) {
        joinCompleteModal.value.show();
      }
    } catch (error) {
      console.error('가입 신청 중 오류가 발생했습니다:', error);
      alert('가입 신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      isSubmitting.value = false;
    }
  };
  
  // 모달 닫기
  const closeModal = () => {
    if (joinCompleteModal.value) {
      joinCompleteModal.value.hide();
    }
  };
  
  // 클럽 상세 페이지로 이동
  const goToClubDetail = () => {
    closeModal();
    router.push(`/clubs/${clubInfo.value.id}`);
  };
  
  // 홈으로 이동
  const goToHome = () => {
    closeModal();
    router.push('/');
  };
  
  // 뒤로가기
  const goBack = () => {
    router.go(-1);
  };
  
  onMounted(() => {
    // 클럽 정보 가져오기
    fetchClubInfo();
    
    // Bootstrap 모달 초기화
    const modalEl = document.getElementById('joinCompleteModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      joinCompleteModal.value = new bootstrap.Modal(modalEl);
    }
  });
  </script>
  
  <style scoped>
  /* 페이지 스타일 */
  .club-join-page {
    min-height: 100vh;
    background-color: #f8f9fa;
  }
  
  /* 클럽 이미지 스타일 */
  .club-image-container {
    width: 100%;
    height: 100%;
    max-height: 300px;
    overflow: hidden;
    border-radius: 0.5rem;
  }
  
  .club-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* 폼 스타일 */
  .form-control,
  .form-select {
    padding: 0.75rem;
    border-radius: 0.5rem;
    border-color: #dee2e6;
  }
  
  .form-control:focus,
  .form-select:focus {
    border-color: #37715D;
    box-shadow: 0 0 0 0.25rem rgba(55, 113, 93, 0.25);
  }
  
  /* 커스텀 색상 클래스 */
  .text-custom-primary {
    color: #37715D !important;
  }
  
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
  
  /* 스킬 레벨 버튼 스타일 */
  .btn-check:checked+.btn-outline-custom-primary {
    background-color: #37715D !important;
    color: white !important;
  }
  
  .btn-check:disabled+.btn-outline-custom-primary {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    .skill-level-buttons .btn-group {
      flex-wrap: wrap;
    }
  
    .skill-level-buttons .btn {
      flex: 1 0 30%;
      margin-bottom: 5px;
    }
    
    .club-image-container {
      margin-top: 1rem;
      max-height: 200px;
    }
  }
  </style>