<template>
    <div class="appointment-detail">
        <!-- 헤더 이미지 섹션 -->
        <div class="header-section position-relative" v-if="appointment">
            <!-- 이미지 슬라이더 -->
            <div id="appointmentImageSlider" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <div class="image-container">
                            <img :src="appointment.image" class="d-block w-100 header-image" alt="약속 이미지">
                        </div>
                    </div>
                    <div class="carousel-item">
                        <div class="image-container">
                            <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
                                class="d-block w-100 header-image" alt="추가 이미지">
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#appointmentImageSlider"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">이전</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#appointmentImageSlider"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">다음</span>
                </button>

                <!-- 이미지 인디케이터 -->
                <div class="carousel-indicators position-absolute bottom-0 mb-2">
                    <button type="button" data-bs-target="#appointmentImageSlider" data-bs-slide-to="0" class="active"
                        aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#appointmentImageSlider" data-bs-slide-to="1"
                        aria-label="Slide 2"></button>
                </div>
            </div>

            <!-- 뒤로가기 버튼 -->
            <button class="btn btn-light btn-sm position-absolute top-0 start-0 m-3 rounded-circle" @click="goBack">
                <i class="bi bi-arrow-left"></i>
            </button>

            <!-- 공유 버튼 -->
            <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-3 rounded-circle">
                <i class="bi bi-share"></i>
            </button>
        </div>

        <!-- 로딩 표시 -->
        <div v-else class="d-flex justify-content-center align-items-center" style="height: 300px;">
            <div class="spinner-border custom-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- 콘텐츠 섹션 -->
        <div class="content-section container py-4" v-if="appointment">
            <!-- 제목 및 카테고리 -->
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="d-flex align-items-center">
                        <h1 class="fs-3 fw-bold mb-0 me-3">{{ appointment.title }}</h1>
                        <!-- 클럽 약속 표시 - 타이틀 바로 뒤에 붙도록 수정 -->
                        <div v-if="appointment.isClub"
                            class="club-badge d-flex justify-content-center align-items-center">
                            C
                        </div>
                    </div>
                    <div class="category-tag custom-bg-primary text-white px-3 py-2 rounded-pill fs-6 fw-bold">
                        {{ appointment.category }}
                    </div>
                </div>
                <div class="text-secondary small">{{ appointment.createdAt }} 등록</div>
            </div>

            <!-- 나머지 콘텐츠 -->

            <!-- 날짜 및 시간 정보 -->
            <div class="appointment-info-card mb-4">
                <div class="row">
                    <!-- 왼쪽 정보 카드 -->
                    <div class="col-md-6">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <!-- 날짜 및 시간 정보 (1줄) -->
                                <div class="d-flex align-items-center mb-4">
                                    <div class="date-badge me-3 text-center">
                                        <div class="month custom-bg-primary text-white small rounded-top px-2 py-1">{{
                                            formatMonth(appointment.time) }}</div>
                                        <div class="day bg-light rounded-bottom px-3 py-1 fw-bold">{{
                                            formatDay(appointment.time) }}</div>
                                    </div>
                                    <div>
                                        <h5 class="mb-1 fw-bold">{{ formatDate(appointment.time) }}</h5>
                                        <p class="mb-0 text-secondary">{{ formatTime(appointment.time) }}</p>
                                    </div>
                                </div>

                                <hr>

                                <!-- 장소 및 참가자 정보 (2줄) -->
                                <div class="row mb-4">
                                    <!-- 장소 정보 -->
                                    <div class="col-6">
                                        <div class="d-flex flex-column">
                                            <div class="d-flex align-items-center mb-2">
                                                <i class="bi bi-geo-alt custom-primary me-2 fs-5"></i>
                                                <h5 class="mb-0 fw-bold">장소</h5>
                                            </div>
                                            <p class="mb-0 fw-medium">{{ appointment.location }}</p>
                                            <p class="mb-0 text-secondary small">서울특별시 동작구 상도로 369</p>
                                        </div>
                                    </div>

                                    <!-- 참가자 정보 -->
                                    <div class="col-6">
                                        <div class="d-flex flex-column">
                                            <div class="d-flex align-items-center mb-2">
                                                <i class="bi bi-people custom-primary me-2 fs-5"></i>
                                                <h5 class="mb-0 fw-bold">참가자</h5>
                                            </div>
                                            <div class="progress mb-2" style="height: 8px;">
                                                <div class="progress-bar custom-bg-primary" role="progressbar"
                                                    :style="`width: ${(appointment.participants.current / appointment.participants.max) * 100}%`"
                                                    :aria-valuenow="appointment.participants.current" aria-valuemin="0"
                                                    :aria-valuemax="appointment.participants.max"></div>
                                            </div>
                                            <p class="mb-0 text-secondary small">
                                                {{ appointment.participants.current }}명 / {{
                                                    appointment.participants.max }}명
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <hr>

                                <!-- 수준 기준 및 나이 기준 (2줄) -->
                                <div class="row">
                                    <!-- 수준 기준 -->
                                    <div class="col-6">
                                        <div class="d-flex flex-column">
                                            <div class="d-flex align-items-center mb-2">
                                                <i class="bi bi-award custom-primary me-2 fs-5"></i>
                                                <h5 class="mb-0 fw-bold">수준</h5>
                                            </div>
                                            <p class="mb-0 text-secondary small">모든 수준 환영</p>
                                        </div>
                                    </div>

                                    <!-- 나이 기준 -->
                                    <div class="col-6">
                                        <div class="d-flex flex-column">
                                            <div class="d-flex align-items-center mb-2">
                                                <i class="bi bi-person-badge custom-primary me-2 fs-5"></i>
                                                <h5 class="mb-0 fw-bold">나이</h5>
                                            </div>
                                            <p class="mb-0 text-secondary small">20세 ~ 제한없음</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 오른쪽 참여자 레벨 분포도 -->
                    <div class="col-md-6">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="fw-bold mb-3">참여자 레벨 분포</h5>

                                <!-- 레벨 분포 차트 -->
                                <div class="level-distribution">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="small fw-medium">입문</span>
                                        <span class="small text-secondary">30%</span>
                                    </div>
                                    <div class="progress mb-3" style="height: 10px;">
                                        <div class="progress-bar custom-bg-primary" role="progressbar"
                                            style="width: 30%; opacity: 0.85;" aria-valuenow="30" aria-valuemin="0"
                                            aria-valuemax="100"></div>
                                    </div>

                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="small fw-medium">초급</span>
                                        <span class="small text-secondary">40%</span>
                                    </div>
                                    <div class="progress mb-3" style="height: 10px;">
                                        <div class="progress-bar custom-bg-primary" role="progressbar"
                                            style="width: 40%; opacity: 0.95;" aria-valuenow="40" aria-valuemin="0"
                                            aria-valuemax="100"></div>
                                    </div>

                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="small fw-medium">중급</span>
                                        <span class="small text-secondary">20%</span>
                                    </div>
                                    <div class="progress mb-3" style="height: 10px;">
                                        <div class="progress-bar custom-bg-primary" role="progressbar"
                                            style="width: 20%; opacity: 0.75;" aria-valuenow="20" aria-valuemin="0"
                                            aria-valuemax="100"></div>
                                    </div>

                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="small fw-medium">고급</span>
                                        <span class="small text-secondary">10%</span>
                                    </div>
                                    <div class="progress mb-3" style="height: 10px;">
                                        <div class="progress-bar custom-bg-primary" role="progressbar"
                                            style="width: 10%; opacity: 0.65;" aria-valuenow="10" aria-valuemin="0"
                                            aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 호스트 정보 -->
            <div class="host-section mb-4">
                <h4 class="fs-5 fw-bold mb-3">주최자</h4>
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <img :src="appointment.host.avatar" alt="호스트 프로필" class="rounded-circle me-3" width="50"
                                height="50">
                            <div>
                                <h5 class="mb-1 fw-bold">{{ appointment.host.name }}</h5>
                                <p class="mb-0 text-secondary small">
                                    <i class="bi bi-star-fill text-warning me-1"></i>
                                    <span>4.8</span>
                                    <span class="mx-2">|</span>
                                    <span>운동 약속 15회 주최</span>
                                </p>
                            </div>
                            <button class="btn btn-outline-custom-primary btn-sm ms-auto">
                                <i class="bi bi-chat-dots me-1"></i> 메시지
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 약속 상세 정보 -->
            <div class="detail-section mb-4">
                <h4 class="fs-5 fw-bold mb-3">약속 상세</h4>
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="mb-4">
                            <h5 class="fw-bold mb-2">소개</h5>
                            <p>{{ appointment.title }}에 참여하세요! 모든 실력 수준을 환영합니다. 함께 즐겁게 운동하며 새로운 친구도 만들어보세요.</p>
                        </div>

                        <div class="mb-4">
                            <h5 class="fw-bold mb-2">준비물</h5>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item border-0 ps-0">
                                    <i class="bi bi-check-circle-fill custom-primary me-2"></i> 운동복 및 운동화
                                </li>
                                <li class="list-group-item border-0 ps-0">
                                    <i class="bi bi-check-circle-fill custom-primary me-2"></i> 개인 물통
                                </li>
                                <li class="list-group-item border-0 ps-0">
                                    <i class="bi bi-check-circle-fill custom-primary me-2"></i> 수건
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h5 class="fw-bold mb-2">참고사항</h5>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item border-0 ps-0">
                                    <i class="bi bi-info-circle-fill custom-primary me-2"></i> 시작 10분 전에 도착해주세요.
                                </li>
                                <li class="list-group-item border-0 ps-0">
                                    <i class="bi bi-info-circle-fill custom-primary me-2"></i> 주차 공간이 제한적이니 가능하면 대중교통을
                                    이용해주세요.
                                </li>
                                <li class="list-group-item border-0 ps-0">
                                    <i class="bi bi-info-circle-fill custom-primary me-2"></i> 우천시 실내 활동으로 대체될 수 있습니다.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 위치 지도 -->
            <div class="map-section mb-4">
                <h4 class="fs-5 fw-bold mb-3">위치</h4>
                <div class="card border-0 shadow-sm">
                    <div class="card-body p-0">
                        <div class="map-container">
                            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pVXkRqXI6vhiYTQLq2SiE07Bg7zg8q.png"
                                alt="위치 지도" class="w-100 map-image">
                        </div>
                        <div class="p-3">
                            <h5 class="fw-bold mb-1">{{ appointment.location }}</h5>
                            <p class="mb-2 text-secondary">서울특별시 동작구 상도로 369</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-custom-primary btn-sm">
                                    <i class="bi bi-map me-1"></i> 길찾기
                                </button>
                                <button class="btn btn-outline-secondary btn-sm">
                                    <i class="bi bi-clipboard me-1"></i> 주소 복사
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 비슷한 약속 -->
            <div class="similar-section mb-4">
                <h4 class="fs-5 fw-bold mb-3">비슷한 약속</h4>
                <div class="row g-3">
                    <div class="col-6" v-for="i in 2" :key="i">
                        <div class="card border-0 shadow-sm h-100">
                            <img :src="`https://images.unsplash.com/photo-${i === 1 ? '1476480862126-209bfaa8edc8' : '1579952363873-27f3bade9f55'}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80`"
                                class="card-img-top similar-img" alt="비슷한 약속">
                            <div class="card-body">
                                <span class="badge custom-bg-primary text-white mb-1">{{ i === 1 ? '러닝' : '축구' }}</span>
                                <h5 class="card-title fs-6 fw-bold">{{ i === 1 ? '한강 러닝 크루' : '주말 축구 모임' }}</h5>
                                <p class="card-text small text-secondary mb-0">{{ i === 1 ? '2024.09.23' : '2024.09.24'
                                    }} | {{ i === 1 ? '서초구' : '강남구' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 로딩 표시 (콘텐츠 섹션) -->
        <div v-else class="content-section container py-4">
            <div class="d-flex justify-content-center">
                <div class="spinner-border custom-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>

        <!-- 하단 고정 액션 버튼 -->
        <div class="action-bar fixed-bottom bg-white border-top py-3 px-4">
            <div class="container d-flex justify-content-between align-items-center">
                <div>
                    <p class="mb-0 fw-bold">무료</p>
                    <p class="mb-0 small text-secondary">참가비 없음</p>
                </div>
                <button class="btn btn-custom-primary px-4 py-2" @click="handleJoinClick">
                    약속 참여하기
                </button>
            </div>
        </div>

        <!-- 토스트 메시지 -->
        <div class="toast-container position-fixed top-50 start-50 translate-middle" style="z-index: 1060">
            <div id="conditionToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-danger text-white">
                    <strong class="me-auto">참여 불가</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"
                        aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    참여 조건에 부합하지 않습니다. 나이 또는 수준 조건을 확인해주세요.
                </div>
            </div>
        </div>

        <!-- 클럽 가입 모달 -->
        <div class="modal fade" id="clubJoinModal" tabindex="-1" aria-labelledby="clubJoinModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="clubJoinModalLabel">클럽 가입 필요</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-3">
                            <div class="club-badge-large d-flex justify-content-center align-items-center mx-auto mb-3">
                                C
                            </div>
                            <h4 class="fw-bold">{{ appointment.title }}</h4>
                            <p class="text-secondary">클럽 가입 후 참여 가능합니다.</p>
                        </div>
                        <div class="card border-0 bg-light mb-3">
                            <div class="card-body">
                                <h6 class="fw-bold mb-2">클럽 혜택</h6>
                                <ul class="list-unstyled mb-0">
                                    <li class="d-flex align-items-center mb-2">
                                        <i class="bi bi-check-circle-fill custom-primary me-2"></i>
                                        <span>정기적인 운동 모임 참여</span>
                                    </li>
                                    <li class="d-flex align-items-center mb-2">
                                        <i class="bi bi-check-circle-fill custom-primary me-2"></i>
                                        <span>클럽 전용 채팅방 이용</span>
                                    </li>
                                    <li class="d-flex align-items-center">
                                        <i class="bi bi-check-circle-fill custom-primary me-2"></i>
                                        <span>클럽 회원 전용 이벤트 참여</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            @click="closeModal">취소</button>
                        <button type="button" class="btn btn-custom-primary" @click="goToClub">클럽 이동하기</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import router from '@/router';
import { defineProps, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
    appointment: {
        type: Object,
        required: true,
    }
});

// 참여하기 버튼 클릭 핸들러
const handleJoinClick = () => {
    // 예시: 랜덤하게 조건 충족 여부 결정 (실제로는 사용자 정보와 약속 조건을 비교)
    const randomCondition = false;

    if (props.appointment.isClub) {
        // 클럽 약속인 경우 모달 표시
        if (clubJoinModal.value) {
            clubJoinModal.value.show();
        }
    } else if (!randomCondition) {
        // 일반 약속이지만 조건 불충족 시 토스트 표시
        if (conditionToast.value) {
            conditionToast.value.show();
        }
    } else {
        // 조건 충족 시 참여 처리 (실제 구현에서는 API 호출)
        alert('약속에 참여되었습니다!');
    }
};

// 모달 닫기 함수
const closeModal = () => {
    if (clubJoinModal.value) {
        // 모달 내부의 모든 버튼에서 포커스 제거
        const modalButtons = document.querySelectorAll('#clubJoinModal button');
        modalButtons.forEach(button => {
            button.blur();
        });

        // 모달 닫기
        clubJoinModal.value.hide();

        // 포커스를 다른 안전한 요소로 이동
        setTimeout(() => {
            const safeElement = document.querySelector('.action-bar button');
            if (safeElement) {
                safeElement.focus();
            }
        }, 100);
    }
};

// 클럽 페이지로 이동
const goToClub = () => {
    // 모달 내부의 모든 버튼에서 포커스 제거
    const modalButtons = document.querySelectorAll('#clubJoinModal button');
    modalButtons.forEach(button => {
        button.blur();
    });

    // 모달 닫기
    if (clubJoinModal.value) {
        clubJoinModal.value.hide();
    }

    // 실제 구현에서는 클럽 페이지로 이동
    router.push('/appointments/join');
};

onMounted(() => {
    // Bootstrap 토스트 및 모달 초기화
    if (typeof bootstrap !== 'undefined') {
        // 토스트 초기화
        const toastEl = document.getElementById('conditionToast');
        if (toastEl) {
            conditionToast.value = new bootstrap.Toast(toastEl, {
                delay: 3000
            });
        }

        // 모달 초기화
        const modalEl = document.getElementById('clubJoinModal');
        if (modalEl) {
            clubJoinModal.value = new bootstrap.Modal(modalEl);
        }
    }
});

// 날짜 포맷 함수들
const formatMonth = (dateString) => {
    const date = new Date(dateString.split(' ')[0].replace(/\./g, '-'));
    return `${date.getMonth() + 1}월`;
};

const formatDay = (dateString) => {
    const date = new Date(dateString.split(' ')[0].replace(/\./g, '-'));
    return date.getDate();
};

const formatDate = (dateString) => {
    const date = new Date(dateString.split(' ')[0].replace(/\./g, '-'));
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
};

const formatTime = (dateString) => {
    return dateString.split(' ')[1];
};

// 뒤로가기 함수
const goBack = () => {
    window.history.back();
};
</script>

<style scoped>
.header-image {
    height: 300px;
    object-fit: cover;
}

.image-container {
    background-color: #f8f9fa;
    height: 300px;
    overflow: hidden;
}

.date-badge {
    min-width: 60px;
}

.map-container {
    height: 200px;
    overflow: hidden;
}

.map-image {
    object-fit: cover;
    height: 100%;
}

.similar-img {
    height: 120px;
    object-fit: cover;
}

.carousel-indicators {
    margin-bottom: 0;
}

.carousel-indicators button {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    border: none;
}

.carousel-indicators button.active {
    background-color: white;
}

/* 커스텀 색상 클래스 */
.custom-primary {
    color: #37715D !important;
}

.custom-bg-primary {
    background-color: #37715D;
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

/* 카테고리 태그 스타일 */
.category-tag {
    font-size: 1rem;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 4px rgba(55, 113, 93, 0.2);
}

/* 모바일 화면에서 하단 액션 바 위에 패딩 추가 */
@media (max-width: 768px) {
    .appointment-detail {
        padding-bottom: 80px;
    }

    /* 모바일에서는 2열 레이아웃을 1열로 변경 */
    .col-6 {
        width: 100%;
        margin-bottom: 1.5rem;
    }

    .col-6:last-child {
        margin-bottom: 0;
    }
}

/* 클럽 배지 스타일 */
.club-badge {
    width: 34px;
    height: 34px;
    background-color: #37715D;
    color: white;
    border-radius: 10%;
    line-height: 30px;
    font-weight: bold;
    font-size: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>