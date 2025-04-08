<template>
  <div class="appointment-join-page">
    <div class="container py-4">
      <!-- 헤더 섹션 -->
      <div class="row mb-4">
        <div class="col-md-7">
          <h1 class="fs-4 fw-bold mb-2">약속 참가페이지</h1>
          <p class="text-secondary mb-0">안녕하세요 오늘 주심 참판 벗섭분</p>

          <!-- 참여 안내 사항 -->
          <div class="mt-3">
            <ul class="list-unstyled text-secondary small">
              <li class="mb-1">
                <i class="bi bi-check-circle-fill custom-primary me-2"></i>
                준비물은 운동복과 운동화입니다.
              </li>
              <li class="mb-1">
                <i class="bi bi-check-circle-fill custom-primary me-2"></i>
                물과 수건은 꼭 지참해주세요.
              </li>
              <li class="mb-1">
                <i class="bi bi-check-circle-fill custom-primary me-2"></i>
                시작 10분 전에 도착해주세요.
              </li>
              <li class="mb-1">
                <i class="bi bi-check-circle-fill custom-primary me-2"></i>
                주차 공간이 제한적이니 대중교통 이용 바랍니다.
              </li>
              <li class="mb-1">
                <i class="bi bi-check-circle-fill custom-primary me-2"></i>
                우천시 실내 활동으로 대체될 수 있습니다.
              </li>
              <li class="mb-1">
                <i class="bi bi-check-circle-fill custom-primary me-2"></i>
                참가비는 무료입니다.
              </li>
            </ul>
          </div>
        </div>

        <!-- 약속 정보 카드 -->
        <div class="col-md-5">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="fw-bold mb-1">{{ appointment.title }}</h5>
                  <div class="d-flex align-items-center">
                    <i class="bi bi-calendar3 text-secondary me-1"></i>
                    <span class="small text-secondary">{{ appointment.time }}</span>
                  </div>
                </div>
                <div v-if="appointment.isClub" class="club-badge d-flex justify-content-center align-items-center">
                  C
                </div>
              </div>

              <div class="d-flex align-items-start mb-3">
                <i class="bi bi-geo-alt custom-primary me-2 fs-5"></i>
                <div>
                  <p class="mb-0 fw-medium">{{ appointment.location }}</p>
                  <p class="mb-0 text-secondary small">서울특별시 동작구 상도로 369</p>
                </div>
              </div>

              <!-- 지도 -->
              <div class="map-container rounded overflow-hidden mb-2">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pVXkRqXI6vhiYTQLq2SiE07Bg7zg8q.png"
                  alt="위치 지도" class="w-100 map-image">
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <i class="bi bi-people custom-primary me-2"></i>
                  <span class="small">{{ appointment.participants.current }}/{{ appointment.participants.max }}명</span>
                </div>
                <button class="btn btn-sm btn-outline-custom-primary" @click="openMap">
                  <i class="bi bi-map me-1"></i> 길찾기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 참가 폼 섹션 -->
      <div class="join-form-section">
        <form @submit.prevent="submitForm">
          <!-- 참가 유형 선택 -->
          <div class="mb-4">
            <label for="participationType" class="form-label fw-medium">운동 실력</label>
            <select id="participationType" class="form-select" v-model="formData.participationType">
              <option value="" disabled selected>Select</option>
              <option value="individual">초보</option>
              <option value="group">중수</option>
              <option value="guest">고수</option>
            </select>
          </div>

          <!-- 질문 1 -->
          <div class="mb-4">
            <label for="affiliation" class="form-label fw-medium">질문 1. 소속 및 담당자님은</label>
            <input type="text" id="affiliation" class="form-control" placeholder="소속 및 담당자 정보를 입력해주세요"
              v-model="formData.affiliation">
          </div>

          <!-- 질문 2 -->
          <div class="mb-4">
            <label for="reason" class="form-label fw-medium">질문 2. 왜 이 약속에 참가하시나요?</label>
            <textarea id="reason" class="form-control" rows="3" placeholder="참가 이유를 자유롭게 작성해주세요"
              v-model="formData.reason"></textarea>
          </div>

          <!-- 질문 3 -->
          <div class="mb-4">
            <label for="purpose" class="form-label fw-medium">질문 3. 참여목적!</label>
            <textarea id="purpose" class="form-control" rows="3" placeholder="참여 목적을 작성해주세요"
              v-model="formData.purpose"></textarea>
          </div>

          <!-- 제출 버튼 -->
          <button type="submit" class="btn btn-custom-primary w-100 py-3 fw-bold">
            약속 참가 신청
          </button>
        </form>
      </div>
    </div>

    <!-- 신청 완료 모달 -->
    <div class="modal fade" id="joinCompleteModal" tabindex="-1" aria-labelledby="joinCompleteModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title" id="joinCompleteModalLabel">참가 신청 완료</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
              @click="closeModal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <div class="success-icon mb-3">
              <i class="bi bi-check-circle-fill text-success fs-1"></i>
            </div>
            <h4 class="fw-bold mb-2">참가 신청이 완료되었습니다!</h4>
            <p class="text-secondary mb-4">
              {{ appointment.title }}에 참가 신청이 완료되었습니다.<br>
              약속 시간에 맞춰 참석해주세요.
            </p>
            <div class="card bg-light border-0 mb-3">
              <div class="card-body">
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-calendar3 custom-primary me-2"></i>
                  <span class="fw-medium">{{ appointment.time }}</span>
                </div>
                <div class="d-flex align-items-center">
                  <i class="bi bi-geo-alt custom-primary me-2"></i>
                  <span class="fw-medium">{{ appointment.location }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button type="button" class="btn btn-custom-primary px-4" @click="goToAppointmentList">
              약속 목록으로
            </button>
            <button type="button" class="btn btn-outline-custom-primary px-4" data-bs-dismiss="modal"
              @click="closeModal">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const joinCompleteModal = ref(null);

// 약속 데이터 (실제로는 API에서 가져올 것)
const appointment = ref({
  id: 1,
  title: '다 모여라 클라이밍 클럽',
  category: '클라이밍',
  image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
  createdAt: '1시간 전',
  time: '2023년 06월 11일 11:00 - 13:00',
  location: '서울시 동작구',
  participants: {
    current: 14,
    max: 20
  },
  host: {
    name: 'Climbing Master',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  isClub: true
});

// 폼 데이터
const formData = ref({
  participationType: '',
  affiliation: '',
  reason: '',
  purpose: ''
});

// 폼 제출 처리
const submitForm = () => {
  // 폼 유효성 검사
  if (!formData.value.participationType) {
    alert('참가 유형을 선택해주세요.');
    return;
  }

  if (!formData.value.affiliation) {
    alert('소속 및 담당자 정보를 입력해주세요.');
    return;
  }

  // 실제로는 API 호출하여 데이터 저장
  console.log('제출된 데이터:', formData.value);

  // 성공 모달 표시
  if (joinCompleteModal.value) {
    joinCompleteModal.value.show();
  }
};

// 지도 열기
const openMap = () => {
  // 실제로는 지도 앱 또는 새 창에서 지도 열기
  window.open('https://maps.google.com/?q=' + encodeURIComponent(appointment.value.location), '_blank');
};

// 모달 닫기
const closeModal = () => {
  if (joinCompleteModal.value) {
    joinCompleteModal.value.hide();
  }
};

// 약속 목록으로 이동
const goToAppointmentList = () => {
  closeModal();
  router.push('/');
};

onMounted(() => {
  // Bootstrap 모달 초기화
  setTimeout(() => {
    const modalEl = document.getElementById('joinCompleteModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      joinCompleteModal.value = new bootstrap.Modal(modalEl);
    }
  }, 500);
});
</script>

<style scoped>
.map-container {
  height: 150px;
  overflow: hidden;
}

.map-image {
  object-fit: cover;
  height: 100%;
}

/* 클럽 배지 스타일 */
.club-badge {
  width: 34px;
  height: 34px;
  background-color: #37715D;
  color: white;
  border-radius: 10%;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 커스텀 색상 클래스 */
.custom-primary {
  color: #37715D !important;
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

/* 모바일 반응형 */
@media (max-width: 768px) {
  .col-md-5 {
    margin-top: 1.5rem;
  }
}
</style>