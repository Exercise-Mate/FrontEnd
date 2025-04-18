<template>
    <div class="appointment-create-page">
      <div class="container py-4">
        <!-- 헤더 섹션 -->
        <div class="header-section mb-4">
          <p class="text-secondary mb-0">새로운 클럽을 만들어 함께할 친구들을 모아보세요!</p>
        </div>
  
        <!-- 생성 폼 섹션 -->
        <div class="create-form-section">
          <form @submit.prevent="submitForm">
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-body p-4">
                <h5 class="fw-bold mb-3 d-flex align-items-center">
                  <i class="bi bi-card-text custom-primary me-2"></i>
                  필수 입력 사항
                </h5>
  
                <!-- 클럽명 -->
                <div class="mb-4">
                  <label for="name" class="form-label fw-medium">클럽명<span
                      class="text-danger ms-1">*</span></label>
                  <input type="text" id="name" class="form-control form-control-lg"
                    placeholder="클럽명을 입력해주세요" v-model="formData.name" required>
                </div>
  
                <!-- 운동 종목 -->
                <SportSelector 
                  v-model="formData.sportType" 
                  label="운동 종목" 
                  :required="true"
                  modalId="sportModal"
                />
  
                <!-- 주 활동 지역 -->
                <LocationSelector 
                  v-model="formData.mainArea" 
                  label="주 활동 지역" 
                  :required="true"
                  :multiple="false"
                  modalId="locationModal"
                />
  
                <!-- 최대 가입 인원 -->
                <div class="mb-4">
                  <label for="maxMembersLimit" class="form-label fw-medium">최대 가입 인원<span class="text-danger ms-1">*</span></label>
                  <div class="d-flex align-items-center">
                    <input 
                      type="number" 
                      id="maxMembersLimit" 
                      class="form-control form-control-lg" 
                      v-model="formData.maxMembersLimit" 
                      min="1" 
                      max="300"
                      required
                    >
                    <span class="ms-2">명</span>
                  </div>
                  <div class="form-text">최대 300명까지 설정 가능합니다.</div>
                </div>
  
                <!-- 운동 실력 -->
                <div class="mb-4">
                  <label class="form-label fw-medium">운동 실력<span class="text-danger ms-1">*</span></label>
                  
                  <div class="mb-3">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="anySkillLevel" 
                        v-model="isAnySkillLevel"
                        @change="handleSkillLevelTypeChange"
                      >
                      <label class="form-check-label" for="anySkillLevel">
                        누구나 (실력 무관)
                      </label>
                    </div>
                  </div>
                  
                  <div v-if="!isAnySkillLevel" class="skill-range-container">
                    <div class="row g-2">
                      <div class="col-6">
                        <label for="sportAbilityMin" class="form-label">최소 실력</label>
                        <select 
                          id="sportAbilityMin" 
                          class="form-select" 
                          v-model="formData.sportAbilityMin"
                          @change="validateSkillRange"
                        >
                          <option value="입문">입문</option>
                          <option value="초보">초보</option>
                          <option value="중급">중급</option>
                          <option value="상급">상급</option>
                        </select>
                      </div>
                      <div class="col-6">
                        <label for="sportAbilityMax" class="form-label">최대 실력</label>
                        <select 
                          id="sportAbilityMax" 
                          class="form-select" 
                          v-model="formData.sportAbilityMax"
                          @change="validateSkillRange"
                        >
                          <option value="입문">입문</option>
                          <option value="초보">초보</option>
                          <option value="중급">중급</option>
                          <option value="상급">상급</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 클럽 소개 -->
                <div class="mb-4">
                  <label for="description" class="form-label fw-medium">클럽 소개<span
                      class="text-danger ms-1">*</span></label>
                  <textarea id="description" class="form-control form-control-lg" rows="5"
                    placeholder="우리 클럽에 대한 설명을 작성해주세요" v-model="formData.description"
                    required></textarea>
                </div>
              </div>
            </div>
  
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-body p-4">
                <h5 class="fw-bold mb-3 d-flex align-items-center">
                  <i class="bi bi-card-text custom-primary me-2"></i>
                  추가 입력 사항
                </h5>
                
                <!-- 사진 첨부 -->
                <div class="mb-4">
                  <label for="image" class="form-label fw-medium">사진 첨부 (선택)</label>
                  <div class="image-upload-container">
                    <div v-if="previewImage" class="preview-container mb-2">
                      <img :src="previewImage" alt="미리보기" class="img-preview">
                      <button type="button" class="btn-remove-image" @click="removeImage">
                        <i class="bi bi-x-circle-fill"></i>
                      </button>
                    </div>
                    <div class="input-group">
                      <input type="file" id="image" class="form-control form-control-lg"
                        accept="image/*" @change="handleImageUpload">
                      <label class="input-group-text" for="image">
                        <i class="bi bi-upload me-1"></i> 업로드
                      </label>
                    </div>
                    <div class="form-text">JPG, PNG 파일만 가능합니다. 최대 5MB.</div>
                  </div>
                </div>
  
                <!-- 성별 -->
                <div class="mb-4">
                  <label class="form-label fw-medium">성별<span class="text-danger ms-1">*</span></label>
                  <div class="gender-buttons">
                    <div class="btn-group w-100" role="group">
                      <input 
                        type="radio" 
                        class="btn-check" 
                        id="gender1" 
                        value="남자만" 
                        v-model="formData.genderLimit">
                      <label class="btn btn-outline-custom-primary" for="gender1">남자만</label>
                      
                      <input 
                        type="radio" 
                        class="btn-check" 
                        id="gender2" 
                        value="여자만" 
                        v-model="formData.genderLimit">
                      <label class="btn btn-outline-custom-primary" for="gender2">여자만</label>
                      
                      <input 
                        type="radio" 
                        class="btn-check" 
                        id="gender3" 
                        value="무관" 
                        v-model="formData.genderLimit">
                      <label class="btn btn-outline-custom-primary" for="gender3">무관</label>
                    </div>
                  </div>
                </div>
  
                <!-- 연령 제한 -->
                <div class="mb-4">
                  <label class="form-label fw-medium">연령 제한</label>
                  
                  <div class="mb-3">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="anyAge" 
                        v-model="isAnyAge"
                        @change="handleAgeTypeChange"
                      >
                      <label class="form-check-label" for="anyAge">
                        누구나 (연령 무관)
                      </label>
                    </div>
                  </div>
                  
                  <div v-if="!isAnyAge" class="age-range-container">
                    <div class="row g-2">
                      <div class="col-6">
                        <label for="ageLimitMin" class="form-label">최소 연령</label>
                        <input 
                          type="number" 
                          id="ageLimitMin" 
                          class="form-control" 
                          v-model="formData.ageLimitMin" 
                          min="1" 
                          max="100"
                          @change="validateAgeRange"
                        >
                      </div>
                      <div class="col-6">
                        <label for="ageLimitMax" class="form-label">최대 연령</label>
                        <input 
                          type="number" 
                          id="ageLimitMax" 
                          class="form-control" 
                          v-model="formData.ageLimitMax" 
                          min="1" 
                          max="100"
                          @change="validateAgeRange"
                        >
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- 추가 활동 지역 -->
                <LocationSelector 
                  v-model="formData.additionalLocations" 
                  label="추가 활동 지역" 
                  :required="false"
                  :multiple="true"
                  :maxSelections="4"
                  modalId="additionalLocationModal"
                  helperText="주 활동 지역 이외에 클럽에서 활동하게 될 지역을 선택해주세요 (최대 4개)"
                />
  
                <!-- 질문 사항 -->
                <div v-for="(question, index) in formData.questions" :key="index" class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label :for="`question${index}`" class="form-label fw-medium">
                      가입 질문 사항 {{ index + 1 }} {{ index === 0 ? '(선택)' : '' }}
                    </label>
                    <button type="button" class="btn btn-sm btn-outline-danger"
                      @click="removeQuestion(index)"
                      v-if="index > 0 || formData.questions.length > 1">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                  <textarea :id="`question${index}`" class="form-control" rows="2"
                    placeholder="클럽원에게 물어볼 질문을 입력해주세요" v-model="question.text"></textarea>
                </div>
  
                <!-- 질문 추가 버튼 -->
                <div class="text-center mt-3" v-if="formData.questions.length < 3">
                  <button type="button" class="btn btn-outline-custom-primary" @click="addQuestion">
                    <i class="bi bi-plus-circle me-1"></i> 질문 추가하기
                  </button>
                </div>
              </div>
            </div>
  
            <!-- 제출 버튼 -->
            <div class="d-flex justify-content-between mt-4">
              <button type="button" class="btn btn-outline-secondary px-4 py-2" @click="goBack">
                <i class="bi bi-arrow-left me-1"></i> 이전으로
              </button>
              <button type="submit" class="btn btn-custom-primary px-5 py-2 fw-bold">
                클럽 생성하기
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- 생성 완료 모달 -->
      <div class="modal fade" id="createCompleteModal" tabindex="-1" aria-labelledby="createCompleteModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 class="modal-title" id="createCompleteModalLabel">클럽 생성 완료</h5>
              <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center py-4">
              <div class="success-icon mb-3">
                <i class="bi bi-check-circle-fill text-success fs-1"></i>
              </div>
              <h4 class="fw-bold mb-2">클럽이 성공적으로 생성되었습니다!</h4>
              <p class="text-secondary mb-4">
                {{ formData.name }} 클럽이 생성되었습니다.<br>
                클럽 관리 페이지를 통해 수정 할 수 있습니다.
              </p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <button type="button" class="btn btn-custom-primary px-4" @click="goToClubDetail">
                클럽 페이지 바로가기
              </button>
              <button type="button" class="btn btn-outline-custom-primary px-4" @click="goToClubList">
                내 클럽 목록
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
  import * as bootstrap from 'bootstrap';
  import SportSelector from './SportSelector.vue';
  import LocationSelector from './LocationSelector.vue';
  
  const router = useRouter();
  const createCompleteModal = ref(null);
  const previewImage = ref(null);
  
  // 운동 실력 및 연령 제한 관련 상태
  const isAnySkillLevel = ref(true);
  const isAnyAge = ref(true);
  
  const formData = ref({
    // 필수 입력 사항
    name: '',                  // 클럽명
    description: '',           // 클럽 소개
    sportType: [],             // 운동 종목
    mainArea: '',              // 주 활동 지역
    maxMembersLimit: 50,       // 최대 가입 인원 (기본값: 50명)
    
    // 운동 실력 관련
    sportAbilityMin: '입문',    // 최소 운동 실력
    sportAbilityMax: '상급',    // 최대 운동 실력
    
    // 추가 입력 사항
    imgUrl: null,              // 클럽 이미지 URL
    genderLimit: '무관',        // 성별 제한 (기본값: 무관)
    
    // 연령 제한 관련
    ageLimitMin: 20,           // 최소 연령
    ageLimitMax: 60,           // 최대 연령
    
    // 추가 활동 지역
    additionalLocations: [],   // 추가 활동 지역 (배열로 변경)
    
    // 질문 사항
    questions: [{ text: '' }]  // 가입 질문 사항
  });
  
  // 폼 제출 상태 추가
  const isSubmitting = ref(false);
  
  // 이미지 업로드 처리
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // 파일 유형 검사
    if (!file.type.match('image.*')) {
      alert('이미지 파일만 업로드 가능합니다.');
      event.target.value = '';
      return;
    }
  
    // 파일 크기 검사 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB를 초과할 수 없습니다.');
      event.target.value = '';
      return;
    }
  
    // 이미지 미리보기
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  
    formData.value.imgUrl = file; // 필드명 변경: image -> imgUrl
  };
  
  // 이미지 제거
  const removeImage = () => {
    previewImage.value = null;
    formData.value.imgUrl = null;
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };
  
  // 운동 실력 타입 변경 처리
  const handleSkillLevelTypeChange = () => {
    if (isAnySkillLevel.value) {
      // '누구나'가 선택되면 최소/최대 실력을 초기화
      formData.value.sportAbilityMin = '입문';
      formData.value.sportAbilityMax = '상급';
    }
  };
  
  // 운동 실력 범위 유효성 검사
  const validateSkillRange = () => {
    const skillLevels = ['입문', '초보', '중급', '상급'];
    const minIndex = skillLevels.indexOf(formData.value.sportAbilityMin);
    const maxIndex = skillLevels.indexOf(formData.value.sportAbilityMax);
    
    if (minIndex > maxIndex) {
      // 최소 실력이 최대 실력보다 높으면 최대 실력을 최소 실력과 동일하게 설정
      formData.value.sportAbilityMax = formData.value.sportAbilityMin;
    }
  };
  
  // 연령 타입 변경 처리
  const handleAgeTypeChange = () => {
    if (isAnyAge.value) {
      // '누구나'가 선택되면 최소/최대 연령을 초기화
      formData.value.ageLimitMin = 20;
      formData.value.ageLimitMax = 60;
    }
  };
  
  // 연령 범위 유효성 검사
  const validateAgeRange = () => {
    // 최소 연령이 최대 연령보다 크면 최대 연령을 최소 연령과 동일하게 설정
    if (Number(formData.value.ageLimitMin) > Number(formData.value.ageLimitMax)) {
      formData.value.ageLimitMax = formData.value.ageLimitMin;
    }
    
    // 범위 제한
    if (formData.value.ageLimitMin < 1) formData.value.ageLimitMin = 1;
    if (formData.value.ageLimitMax > 100) formData.value.ageLimitMax = 100;
  };
  
  // 폼 제출 처리
  const submitForm = () => {
    if (isSubmitting.value) return; // 이미 제출 중이면 중복 제출 방지
    isSubmitting.value = true; // 제출 시작
  
    try {
      // 폼 유효성 검사 - 필수 입력 사항 검증
      if (!formData.value.name) {
        alert('클럽명을 입력해주세요.');
        return;
      }
  
      if (!formData.value.sportType || formData.value.sportType.length === 0) {
        alert('운동 종목을 하나 이상 선택해주세요.');
        return;
      }
  
      if (!formData.value.mainArea) {
        alert('주 활동 지역을 선택해주세요.');
        return;
      }
  
      if (!formData.value.maxMembersLimit || formData.value.maxMembersLimit < 1 || formData.value.maxMembersLimit > 300) {
        alert('최대 가입 인원은 1~300명 사이로 설정해주세요.');
        return;
      }
  
      if (!formData.value.description) {
        alert('클럽 소개를 입력해주세요.');
        return;
      }
  
      // 질문 사항 검증 - 빈 질문 제거
      const filteredQuestions = formData.value.questions.filter(q => q.text.trim() !== '');
  
      // 서버에 전송할 최종 데이터 구성
      const clubData = {
        // 필수 입력 사항
        name: formData.value.name,
        description: formData.value.description,
        sportType: formData.value.sportType,
        mainArea: formData.value.mainArea,
        maxMembersLimit: formData.value.maxMembersLimit,
        
        // 운동 실력 관련
        sportAbilityMin: isAnySkillLevel.value ? null : formData.value.sportAbilityMin,
        sportAbilityMax: isAnySkillLevel.value ? null : formData.value.sportAbilityMax,
        
        // 추가 입력 사항
        genderLimit: formData.value.genderLimit,
        
        // 연령 제한 관련
        ageLimitMin: isAnyAge.value ? null : formData.value.ageLimitMin,
        ageLimitMax: isAnyAge.value ? null : formData.value.ageLimitMax,
        
        // 추가 활동 지역 (배열로 전송)
        additionalLocations: formData.value.additionalLocations,
        
        // 질문 사항
        questions: filteredQuestions
      };
  
      // 이미지가 있는 경우 추가
      if (formData.value.imgUrl) {
        clubData.imgUrl = formData.value.imgUrl;
      }
  
      // 실제로는 API 호출하여 데이터 저장
      console.log('서버에 전송할 데이터:', clubData);
  
      // 성공 모달 표시
      if (createCompleteModal.value) {
        createCompleteModal.value.show();
      }
    } finally {
      isSubmitting.value = false; // 제출 완료 (성공/실패 여부 관계없이)
    }
  };
  
  // 모달 닫기
  const closeModal = () => {
    if (createCompleteModal.value) {
      createCompleteModal.value.hide();
    }
  };
  
  // 클럽 상세 페이지로 이동
  const goToClubDetail = () => {
    closeModal();
    // 실제로는 생성된 클럽의 ID로 이동
    router.push('/clubs/1');
  };
  
  // 클럽 목록으로 이동
  const goToClubList = () => {
    closeModal();
    router.push('/');
  };
  
  // 뒤로가기
  const goBack = () => {
    router.go(-1);
  };
  
  onMounted(() => {
    // Bootstrap 모달 초기화
    const modalEl = document.getElementById('createCompleteModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      createCompleteModal.value = new bootstrap.Modal(modalEl);
    }
  });
  </script>
  
  <style scoped>
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
  
  .form-control-lg {
    font-size: 1rem;
  }
  
  /* 이미지 업로드 스타일 */
  .preview-container {
    position: relative;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .img-preview {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 0.5rem;
  }
  
  .btn-remove-image {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #dc3545;
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
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    .skill-level-buttons .btn-group {
      flex-wrap: wrap;
    }
  
    .skill-level-buttons .btn {
      flex: 1 0 30%;
      margin-bottom: 5px;
    }
  }
  </style>