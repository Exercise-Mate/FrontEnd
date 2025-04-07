<template>
    <div class="card rounded shadow-sm" @click="goToDetail" style="cursor: pointer;">
        <!-- 이미지 섹션 - 고정 크기로 설정 -->
        <div class="image-container">
            <img :src="appointment.image" :alt="appointment.title" class="image" />
        </div>

        <!-- 콘텐츠 섹션 -->
        <div class="p-3">
            <!-- 상단 정보 -->
            <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="small text-muted">{{ appointment.createdAt }}</span>
                <span class="badge bg-light text-dark rounded-pill"> {{ appointment.category }}</span>
            </div>

            <!-- 제목 - 글자 크기 줄이고 한 줄로 제한 -->
            <h3 class="fs-5 fw-bold mb-2 text-truncate">{{ appointment.title }}</h3>

            <!-- 시간 및 장소 -->
            <div class="mb-3">
                <div class="d-flex align-items-center mb-1">
                    <span class="fw-medium me-1 small">Time:</span>
                    <span class="small text-secondary">{{ appointment.time }}</span>
                </div>
                <div class="d-flex align-items-center">
                    <span class="fw-medium me-1 small">Place:</span>
                    <span class="small text-secondary">{{ appointment.location }}</span>
                </div>
            </div>

            <!-- 하단 정보 - 참가자수와 호스트 정보를 한 줄에 배치 -->
            <div class="d-flex justify-content-between w-100">
                <!-- 참가자 수 -->
                <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="text-secondary me-1"
                        viewBox="0 0 20 20" fill="currentColor">
                        <path
                            d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span class="small">{{ appointment.participants.current }}/{{ appointment.participants.max
                        }}명</span>
                </div>

                <!-- 호스트 정보 - 아바타 크기 증가 및 원형 보장 -->
                <div class="d-flex align-items-center">
                    <div class="host-avatar">
                        <img :src="appointment.host.avatar" :alt="appointment.host.name"
                            class="w-100 h-100 object-fit-cover" />
                    </div>
                    <span class="small text-truncate host-name">{{ appointment.host.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

// 약속 데이터를 props로 받음
const props = defineProps({
    appointment: {
        type: Object,
        required: true
    }
});

const router = useRouter();

const goToDetail = () => {
    // router.push({
    //     name: 'appointment-detail',
    //     params: { id: props.appointment.id }
    // });
    router.push({
        name: 'appointment-detail',
    });
};
</script>

<style scoped>
.card {
    width: 100%;
    max-width: 320px;
    border-radius: 0.75rem;
    overflow: hidden;
}

/* 이미지 컨테이너를 고정 크기로 설정 */
.image-container {
    width: 100%;
    height: 160px;
    overflow: hidden;
    position: relative;
}

/* 이미지가 컨테이너에 맞게 표시되도록 설정 */
.image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

/* 호스트 아바타 스타일 - 크기 증가 및 원형 보장 */
.host-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 6px;
    background-color: #e5e7eb;
}

/* 호스트 이름 최대 너비 제한 */
.host-name {
    max-width: 80px;
}

/* Bootstrap 5에서 object-fit-cover가 없는 경우를 위한 스타일 */
.object-fit-cover {
    object-fit: cover;
}
</style>
