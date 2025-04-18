<template>
    <div class="appointment-edit-page">
      <div class="container py-4">
        <!-- 헤더 섹션 -->
        <div class="header-section mb-4">
          <p class="text-secondary mb-0">클럽 정보를 수정하여 더 나은 클럽 활동을 만들어보세요!</p>
        </div>
  
        <!-- 로딩 상태 표시 -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-custom-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">클럽 정보를 불러오는 중...</p>
        </div>
  
        <!-- 수정 폼 섹션 -->
        <div v-else class="edit-form-section">
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
              <div>
                <button type="button" class="btn btn-outline-danger px-4 py-2 me-2" @click="showDeleteConfirm">
                  <i class="bi bi-trash me-1"></i> 클럽 삭제
                </button>
                <button type="submit" class="btn btn-custom-primary px-5 py-2 fw-bold">
                  클럽 수정하기
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  
      <!-- 수정 완료 모달 -->
      <div class="modal fade" id="editCompleteModal" tabindex="-1" aria-labelledby="editCompleteModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 class="modal-title" id="editCompleteModalLabel">클럽 수정 완료</h5>
              <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center py-4">
              <div class="success-icon mb-3">
                <i class="bi bi-check-circle-fill text-success fs-1"></i>
              </div>
              <h4 class="fw-bold mb-2">클럽이 성공적으로 수정되었습니다!</h4>
              <p class="text-secondary mb-4">
                {{ formData.name }} 클럽 정보가 업데이트되었습니다.<br>
                변경된 내용은 즉시 반영됩니다.
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

      <!-- 삭제 확인 모달 -->
      <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 class="modal-title" id="deleteConfirmModalLabel">클럽 삭제 확인</h5>
              <button type="button" class="btn-close" @click="closeDeleteModal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center py-4">
              <div class="warning-icon mb-3">
                <i class="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
              </div>
              <h4 class="fw-bold mb-2">정말 클럽을 삭제하시겠습니까?</h4>
              <p class="text-secondary mb-4">
                {{ formData.name }} 클럽을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.<br>
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <button type="button" class="btn btn-outline-secondary px-4" @click="closeDeleteModal">
                취소
              </button>
              <button type="button" class="btn btn-danger px-4" @click="deleteClub">
                삭제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import * as bootstrap from 'bootstrap';
  import SportSelector from './SportSelector.vue';
  import LocationSelector from './LocationSelector.vue';
  
  const props = defineProps({
    clubId: {
      type: [String, Number],
      required: true
    }
  });
  
  const router = useRouter();
  const editCompleteModal = ref(null);
  const deleteConfirmModal = ref(null);
  const previewImage = ref(null);
  const isLoading = ref(true);
  
  // 운동 실력 및 연령 제한 관련 상태
  const isAnySkillLevel = ref(false);
  const isAnyAge = ref(false);
  
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
  
  // 클럽 정보 가져오기
  const fetchClubData = async () => {
    isLoading.value = true;
    
    try {
      // 실제 구현에서는 API 호출
      // const response = await fetch(`/api/clubs/${props.clubId}`);
      // const data = await response.json();
      
      // API 호출 시뮬레이션 (1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 더미 데이터 (실제 구현에서는 API 응답 데이터 사용)
      const dummyClubData = {
        id: props.clubId,
        name: '서울시 러닝 클럽',
        description: '서울시에서 함께 달리는 러닝 클럽입니다. 주 2회 정기 모임을 가지며, 초보자부터 경험자까지 모두 환영합니다.',
        sportType: ['러닝'],
        mainArea: '서울시 강남구',
        maxMembersLimit: 100,
        sportAbilityMin: '초보',
        sportAbilityMax: '중급',
        imgUrl: 'https://source.unsplash.com/featured/300x200?running,club',
        genderLimit: '무관',
        ageLimitMin: 20,
        ageLimitMax: 40,
        additionalLocations: ['서울시 서초구', '서울시 송파구'],
        questions: [
          { text: '러닝을 시작한 지 얼마나 되셨나요?' },
          { text: '일주일에 몇 번 정도 러닝을 하시나요?' }
        ]
      };
      
      // 폼 데이터 설정
      formData.value = { ...dummyClubData };
      
      // 이미지 미리보기 설정
      if (formData.value.imgUrl) {
        previewImage.value = formData.value.imgUrl;
      }
      
      // 운동 실력 및 연령 제한 체크박스 상태 설정
      isAnySkillLevel.value = !formData.value.sportAbilityMin && !formData.value.sportAbilityMax;
      isAnyAge.value = !formData.value.ageLimitMin && !formData.value.ageLimitMax;
      
      console.log('클럽 정보를 성공적으로 가져왔습니다:', formData.value);
    } catch (error) {
      console.error('클럽 정보를 가져오는 중 오류가 발생했습니다:', error);
      alert('클럽 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      isLoading.value = false;
    }
  };
  
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
  
    formData.value.imgUrl = file;
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
      formData.value.sportAbilityMin = null;
      formData.value.sportAbilityMax = null;
    } else {
      // 기본값 설정
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
      formData.value.ageLimitMin = null;
      formData.value.ageLimitMax = null;
    } else {
      // 기본값 설정
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
  
  // 질문 추가
  const addQuestion = () => {
    formData.value.questions.push({ text: '' });
  };
  
  // 질문 제거
  const removeQuestion = (index) => {
    formData.value.questions.splice(index, 1);
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
        id: props.clubId, // 클럽 ID 추가 (수정 시 필요)
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
      if (editCompleteModal.value) {
        editCompleteModal.value.show();
      }
    } finally {
      isSubmitting.value = false; // 제출 완료 (성공/실패 여부 관계없이)
    }
  };
  
  // 삭제 확인 모달 표시
  const showDeleteConfirm = () => {
    if (deleteConfirmModal.value) {
      deleteConfirmModal.value.show();
    }
  };
  
  // 클럽 삭제 처리
  const deleteClub = async () => {
    try {
      // 실제로는 API 호출하여 클럽 삭제
      // await fetch(`/api/clubs/${props.clubId}`, {
      //   method: 'DELETE'
      // });
      
      console.log(`클럽 ID ${props.clubId} 삭제 요청`);
      
      // 삭제 모달 닫기
      closeDeleteModal();
      
      // 클럽 목록 페이지로 이동
      router.push('/');
      
      // 삭제 성공 알림
      alert('클럽이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('클럽 삭제 중 오류가 발생했습니다:', error);
      alert('클럽 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };
  
  // 모달 닫기
  const closeModal = () => {
    if (editCompleteModal.value) {
      editCompleteModal.value.hide();
    }
  };
  
  // 삭제 모달 닫기
  const closeDeleteModal = () => {
    if (deleteConfirmModal.value) {
      deleteConfirmModal.value.hide();
    }
  };
  
  // 클럽 상세 페이지로 이동
  const goToClubDetail = () => {
    closeModal();
    router.push(`/clubs/${props.clubId}`);
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
    const editModalEl = document.getElementById('editCompleteModal');
    if (editModalEl && typeof bootstrap !== 'undefined') {
      editCompleteModal.value = new bootstrap.Modal(editModalEl);
    }
    
    const deleteModalEl = document.getElementById('deleteConfirmModal');
    if (deleteModalEl && typeof bootstrap !== 'undefined') {
      deleteConfirmModal.value = new bootstrap.Modal(deleteModalEl);
    }
    
    // 클럽 정보 가져오기
    fetchClubData();
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