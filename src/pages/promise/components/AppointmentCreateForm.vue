<template>
    <div class="appointment-create-page">
        <div class="container py-4">
            <!-- 헤더 섹션 -->
            <div class="header-section mb-4">
                <h1 class="fs-4 fw-bold mb-2">약속 생성페이지</h1>
                <p class="text-secondary mb-0">새로운 운동 약속을 만들어 함께할 친구들을 모아보세요!</p>
            </div>

            <!-- 생성 폼 섹션 -->
            <div class="create-form-section">
                <form @submit.prevent="submitForm">
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-body p-4">
                            <h5 class="fw-bold mb-3 d-flex align-items-center">
                                <i class="bi bi-info-circle-fill custom-primary me-2"></i>
                                기본 정보
                            </h5>

                            <!-- 약속 제목 -->
                            <div class="mb-4">
                                <label for="title" class="form-label fw-medium">약속 제목<span
                                        class="text-danger ms-1">*</span></label>
                                <input type="text" id="title" class="form-control form-control-lg"
                                    placeholder="약속 제목을 입력해주세요" v-model="formData.title" required>
                            </div>

                            <!-- 운동 종목 -->
                            <div class="mb-4">
                                <label for="category" class="form-label fw-medium">운동 종목<span
                                        class="text-danger ms-1">*</span></label>
                                <div class="input-group">
                                    <input type="text" id="category" class="form-control form-control-lg"
                                        placeholder="운동 종목을 입력해주세요" v-model="formData.category" required>
                                    <button class="btn btn-outline-secondary dropdown-toggle" type="button"
                                        data-bs-toggle="dropdown">
                                        <span class="visually-hidden">종목 선택</span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <li><a class="dropdown-item" href="#"
                                                @click.prevent="selectCategory('러닝')">러닝</a></li>
                                        <li><a class="dropdown-item" href="#"
                                                @click.prevent="selectCategory('클라이밍')">클라이밍</a></li>
                                        <li><a class="dropdown-item" href="#"
                                                @click.prevent="selectCategory('축구')">축구</a></li>
                                        <li><a class="dropdown-item" href="#"
                                                @click.prevent="selectCategory('농구')">농구</a></li>
                                        <li><a class="dropdown-item" href="#"
                                                @click.prevent="selectCategory('테니스')">테니스</a></li>
                                        <li><a class="dropdown-item" href="#"
                                                @click.prevent="selectCategory('요가')">요가</a></li>
                                    </ul>
                                </div>
                            </div>

                            <!-- 약속 장소 -->
                            <div class="mb-4">
                                <label for="location" class="form-label fw-medium">약속 장소<span
                                        class="text-danger ms-1">*</span></label>
                                <div class="input-group">
                                    <input type="text" id="location" class="form-control form-control-lg"
                                        placeholder="약속 장소를 입력해주세요" v-model="formData.location" required>
                                    <button class="btn btn-outline-custom-primary" type="button" @click="openMap">
                                        <i class="bi bi-geo-alt"></i>
                                    </button>
                                </div>
                                <div class="form-text">정확한 주소를 입력하시면 참가자들이 찾아오기 쉽습니다.</div>
                            </div>

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
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-body p-4">
                            <h5 class="fw-bold mb-3 d-flex align-items-center">
                                <i class="bi bi-calendar-check-fill custom-primary me-2"></i>
                                일정 및 참여 정보
                            </h5>

                            <!-- 약속 시간 및 참여 인원 -->
                            <div class="row mb-4">
                                <div class="col-md-6 mb-3 mb-md-0">
                                    <label for="date" class="form-label fw-medium">약속 날짜<span
                                            class="text-danger ms-1">*</span></label>
                                    <input type="date" id="date" class="form-control form-control-lg"
                                        v-model="formData.date" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="time" class="form-label fw-medium">약속 시간<span
                                            class="text-danger ms-1">*</span></label>
                                    <input type="time" id="time" class="form-control form-control-lg"
                                        v-model="formData.time" required>
                                </div>
                            </div>

                            <!-- 참여 인원 -->
                            <div class="mb-4">
                                <label for="participants" class="form-label fw-medium">참여 인원<span
                                        class="text-danger ms-1">*</span></label>
                                <div class="input-group">
                                    <input type="number" id="participants" class="form-control form-control-lg"
                                        placeholder="최대 참여 인원" v-model="formData.maxParticipants" min="2" max="100"
                                        required>
                                    <span class="input-group-text">명</span>
                                </div>
                            </div>

                            <!-- 운동 실력 -->
                            <div class="mb-4">
                                <label class="form-label fw-medium">운동 실력<span class="text-danger ms-1">*</span></label>
                                <div class="skill-level-buttons">
                                    <div class="btn-group w-100" role="group">
                                        <input type="radio" class="btn-check" name="skillLevel" id="skill1" value="입문"
                                            v-model="formData.skillLevel">
                                        <label class="btn btn-outline-custom-primary" for="skill1">입문</label>

                                        <input type="radio" class="btn-check" name="skillLevel" id="skill2" value="초보"
                                            v-model="formData.skillLevel">
                                        <label class="btn btn-outline-custom-primary" for="skill2">초보</label>

                                        <input type="radio" class="btn-check" name="skillLevel" id="skill3" value="중급"
                                            v-model="formData.skillLevel">
                                        <label class="btn btn-outline-custom-primary" for="skill3">중급</label>

                                        <input type="radio" class="btn-check" name="skillLevel" id="skill4" value="상급"
                                            v-model="formData.skillLevel">
                                        <label class="btn btn-outline-custom-primary" for="skill4">상급</label>

                                        <input type="radio" class="btn-check" name="skillLevel" id="skill5" value="무관"
                                            v-model="formData.skillLevel">
                                        <label class="btn btn-outline-custom-primary" for="skill5">무관</label>
                                    </div>
                                </div>
                            </div>

                            <!-- 참가 가능 연령 -->
                            <div class="mb-4">
                                <label class="form-label fw-medium">참가 가능 연령 (선택)</label>

                                <!-- 무관 옵션 -->
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="ageNoLimit"
                                        v-model="formData.ageNoLimit" @change="handleAgeNoLimit">
                                    <label class="form-check-label fw-medium" for="ageNoLimit">
                                        연령 제한 없음 (무관)
                                    </label>
                                </div>

                                <!-- 연령 범위 입력 필드 -->
                                <div class="row" v-if="!formData.ageNoLimit">
                                    <div class="col-md-6 mb-2 mb-md-0">
                                        <div class="input-group">
                                            <span class="input-group-text">최소</span>
                                            <input type="number" class="form-control" placeholder="최소 연령"
                                                v-model.number="formData.ageMin" min="15" max="100"
                                                :disabled="formData.ageNoLimit" @change="validateAgeRange">
                                            <span class="input-group-text">세</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="input-group">
                                            <span class="input-group-text">최대</span>
                                            <input type="number" class="form-control" placeholder="최대 연령"
                                                v-model.number="formData.ageMax" min="15" max="100"
                                                :disabled="formData.ageNoLimit" @change="validateAgeRange">
                                            <span class="input-group-text">세</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- 빠른 선택 버튼 -->
                                <div class="mt-3" v-if="!formData.ageNoLimit">
                                    <label class="form-label small text-secondary">빠른 선택:</label>
                                    <div class="d-flex flex-wrap gap-2">
                                        <button type="button" class="btn btn-sm btn-outline-secondary"
                                            @click="setAgeRange(20, 29)">20대</button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary"
                                            @click="setAgeRange(30, 39)">30대</button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary"
                                            @click="setAgeRange(40, 49)">40대</button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary"
                                            @click="setAgeRange(20, 39)">20-30대</button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary"
                                            @click="setAgeRange(30, 49)">30-40대</button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary"
                                            @click="setAgeRange(20, 49)">20-40대</button>
                                    </div>
                                </div>
                            </div>

                            <!-- 클럽 약속 여부 -->
                            <div class="mb-4">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="isClub"
                                        v-model="formData.isClub" @change="checkClubMembership">
                                    <label class="form-check-label fw-medium" for="isClub">
                                        클럽 약속으로 생성
                                        <span class="badge bg-custom-primary ms-2">C</span>
                                    </label>
                                </div>
                                <div class="form-text" v-if="formData.isClub">
                                    클럽 약속으로 생성하면 클럽 회원만 참여할 수 있습니다.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-body p-4">
                            <h5 class="fw-bold mb-3 d-flex align-items-center">
                                <i class="bi bi-card-text custom-primary me-2"></i>
                                상세 정보
                            </h5>

                            <!-- 약속 설명 -->
                            <div class="mb-4">
                                <label for="description" class="form-label fw-medium">약속 설명<span
                                        class="text-danger ms-1">*</span></label>
                                <textarea id="description" class="form-control form-control-lg" rows="5"
                                    placeholder="약속에 대한 상세 설명을 입력해주세요" v-model="formData.description"
                                    required></textarea>
                            </div>

                            <!-- 질문 사항 -->
                            <div v-for="(question, index) in formData.questions" :key="index" class="mb-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <label :for="`question${index}`" class="form-label fw-medium">
                                        질문 사항 {{ index + 1 }} {{ index === 0 ? '(선택)' : '' }}
                                    </label>
                                    <button type="button" class="btn btn-sm btn-outline-danger"
                                        @click="removeQuestion(index)"
                                        v-if="index > 0 || formData.questions.length > 1">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                                <textarea :id="`question${index}`" class="form-control" rows="2"
                                    placeholder="참가자에게 물어볼 질문을 입력해주세요" v-model="question.text"></textarea>
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
                            약속 생성하기
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
                        <h5 class="modal-title" id="createCompleteModalLabel">약속 생성 완료</h5>
                        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center py-4">
                        <div class="success-icon mb-3">
                            <i class="bi bi-check-circle-fill text-success fs-1"></i>
                        </div>
                        <h4 class="fw-bold mb-2">약속이 성공적으로 생성되었습니다!</h4>
                        <p class="text-secondary mb-4">
                            {{ formData.title }} 약속이 생성되었습니다.<br>
                            약속 페이지에서 참가자 현황을 확인할 수 있습니다.
                        </p>
                        <div class="card bg-light border-0 mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="bi bi-calendar3 custom-primary me-2"></i>
                                    <span class="fw-medium">{{ formData.date }} {{ formData.time }}</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-geo-alt custom-primary me-2"></i>
                                    <span class="fw-medium">{{ formData.location }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 justify-content-center">
                        <button type="button" class="btn btn-custom-primary px-4" @click="goToAppointmentDetail">
                            약속 상세보기
                        </button>
                        <button type="button" class="btn btn-outline-custom-primary px-4" @click="goToAppointmentList">
                            약속 목록으로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 토스트 메시지 컴포넌트 추가 - body 태그 닫기 전에 추가 -->
    <div class="toast-container position-fixed bottom-0 start-50 translate-middle p-5"
        style="z-index: 1060; min-width: 400px;">
        <div id="clubToast" class="toast align-items-center text-white bg-primary border-0 w-100 p-2" role="alert"
            aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <span style="font-size: 18px;">클럽에 가입된 사람만 클럽 약속을 생성할 수 있습니다.</span>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                    aria-label="Close"></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const createCompleteModal = ref(null);
const previewImage = ref(null);
const clubToast = ref(null); // 클럽 토스트 참조 추가

// 폼 데이터
const formData = ref({
    title: '',
    category: '',
    location: '',
    image: null,
    date: '',
    time: '',
    maxParticipants: 10,
    skillLevel: '무관',
    ageMin: 20,
    ageMax: 80,
    ageNoLimit: false,
    isClub: false,
    description: '',
    questions: [{ text: '' }]
});

// 종목 선택
const selectCategory = (category) => {
    formData.value.category = category;
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

    formData.value.image = file;
};

// 이미지 제거
const removeImage = () => {
    previewImage.value = null;
    formData.value.image = null;
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
};

// 연령 범위 유효성 검사
const validateAgeRange = () => {
    // 최소값이 최대값보다 크면 최대값을 최소값으로 설정
    if (formData.value.ageMin > formData.value.ageMax) {
        formData.value.ageMax = formData.value.ageMin;
    }

    // 범위 제한
    if (formData.value.ageMin < 15) formData.value.ageMin = 15;
    if (formData.value.ageMax > 100) formData.value.ageMax = 100;
};

// 연령 무관 처리
const handleAgeNoLimit = () => {
    if (formData.value.ageNoLimit) {
        // 무관 선택 시 기본값으로 설정
        formData.value.ageMin = 15;
        formData.value.ageMax = 100;
    }
};

// 연령대 빠른 선택
const setAgeRange = (min, max) => {
    formData.value.ageMin = min;
    formData.value.ageMax = max;
};

// 질문 추가
const addQuestion = () => {
    if (formData.value.questions.length < 3) {
        formData.value.questions.push({ text: '' });
    }
};

// 질문 제거
const removeQuestion = (index) => {
    formData.value.questions.splice(index, 1);
};

// 지도 열기
const openMap = () => {
    // 실제로는 지도 선택 모달 또는 새 창에서 지도 열기
    alert('지도에서 위치를 선택할 수 있는 기능이 구현될 예정입니다.');
};

// 클럽 약속 생성 가능 여부 확인
const checkClubMembership = () => {
    if (formData.value.isClub) {
        // 실제로는 클럽 가입 여부 확인 로직 필요
        const isClubMember = false; // 예시: 클럽 가입 여부

        if (!isClubMember) {
            formData.value.isClub = false; // 클럽 약속 생성 비활성화

            // 토스트 메시지 표시
            if (clubToast.value) {
                clubToast.value.show();
            }
        }
    }
};

// 폼 제출 처리
const submitForm = () => {
    // 폼 유효성 검사
    if (!formData.value.title) {
        alert('약속 제목을 입력해주세요.');
        return;
    }

    if (!formData.value.category) {
        alert('운동 종목을 입력해주세요.');
        return;
    }

    if (!formData.value.location) {
        alert('약속 장소를 입력해주세요.');
        return;
    }

    if (!formData.value.date || !formData.value.time) {
        alert('약속 날짜와 시간을 입력해주세요.');
        return;
    }

    if (!formData.value.description) {
        alert('약속 설명을 입력해주세요.');
        return;
    }

    // 클럽 약속 생성 시 클럽 가입 여부 확인
    if (formData.value.isClub) {
        // 실제 구현에서는 API를 통해 사용자의 클럽 가입 여부를 확인
        // 여기서는 시뮬레이션을 위해 가입되지 않은 것으로 가정
        const isClubMember = false; // 실제로는 API 응답 값으로 대체

        if (!isClubMember) {
            // 클럽에 가입되지 않은 경우 토스트 메시지 표시
            if (clubToast.value) {
                clubToast.value.show();
            }
            return; // 폼 제출 중단
        }
    }

    // 실제로는 API 호출하여 데이터 저장
    console.log('제출된 데이터:', formData.value);

    // 성공 모달 표시
    if (createCompleteModal.value) {
        createCompleteModal.value.show();
    }
};

// 모달 닫기
const closeModal = () => {
    if (createCompleteModal.value) {
        createCompleteModal.value.hide();
    }
};

// 약속 상세 페이지로 이동
const goToAppointmentDetail = () => {
    closeModal();
    // 실제로는 생성된 약속의 ID로 이동
    router.push('/appointments/1');
};

// 약속 목록으로 이동
const goToAppointmentList = () => {
    closeModal();
    router.push('/');
};

// 뒤로가기
const goBack = () => {
    router.go(-1);
};

onMounted(() => {
    // Bootstrap 모달 초기화
    setTimeout(() => {
        const modalEl = document.getElementById('createCompleteModal');
        if (modalEl && typeof bootstrap !== 'undefined') {
            createCompleteModal.value = new bootstrap.Modal(modalEl);
        }

        // Bootstrap 토스트 초기화
        const toastEl = document.getElementById('clubToast');
        if (toastEl && typeof bootstrap !== 'undefined') {
            clubToast.value = new bootstrap.Toast(toastEl, {
                delay: 3000,
                autohide: true
            });
        }
    }, 500);
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

/* 범위 슬라이더 스타일 */
.range-slider {
    position: relative;
    height: 30px;
}

.range-slider input[type="range"] {
    position: absolute;
    width: 100%;
    pointer-events: none;
    -webkit-appearance: none;
    z-index: 2;
    height: 10px;
    opacity: 0;
}

.range-slider input[type="range"]::-webkit-slider-thumb {
    pointer-events: all;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    -webkit-appearance: none;
}

.range-slider::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 5px;
    background: #dee2e6;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 5px;
}

.range-slider::after {
    content: "";
    position: absolute;
    width: calc(100% * (var(--end-percent, 1) - var(--start-percent, 0)));
    height: 5px;
    background: #37715D;
    top: 50%;
    transform: translateY(-50%);
    left: calc(100% * var(--start-percent, 0));
    border-radius: 5px;
}

.range-marks {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 0.75rem;
    color: #6c757d;
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