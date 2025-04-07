<template>
    <div class="hero-section position-relative" style="height: 350px; overflow: hidden;">
        <!-- 그라데이션 오버레이 -->
        <div class="position-absolute top-0 start-0 w-100 h-100 hero-overlay"></div>

        <!-- 배경 이미지 -->
        <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="운동 모임" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" />

        <!-- 중앙 텍스트 -->
        <div
            class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center hero-content">
            <h1 class="display-4 fw-bold text-white mb-2">뜻깊은 운동을 다채롭게</h1>
            <p class="fs-5 text-white-50">만들어줄 원데이 운동 모임</p>
        </div>
    </div>
</template>

<style scoped>
.hero-overlay {
    background: linear-gradient(to right, rgba(13, 71, 161, 0.7), rgba(123, 31, 162, 0.7));
    z-index: 1;
}

.hero-content {
    z-index: 2;
}

.object-fit-cover {
    object-fit: cover;
}

/* 반응형 텍스트 크기 */
@media (max-width: 768px) {
    .display-4 {
        font-size: 2.5rem;
    }

    .fs-5 {
        font-size: 1rem !important;
    }
}
</style>