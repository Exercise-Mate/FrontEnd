<template>
    <div>
        <div class="container-fluid px-0">
            <!-- 상단 네비게이션 -->
            <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div class="container">
                    <a class="navbar-brand d-flex align-items-center" href="#">
                        <i class="bi bi-people-fill custom-primary me-2 fs-4"></i>
                        <span class="fw-bold">클럽 생성</span>
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

            <!-- 클럽 생성 폼 컴포넌트 -->
            <club-create-form />
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ClubCreateForm from './components/ClubCreateForm.vue';

const router = useRouter();

// 뒤로가기 함수
const goBack = () => {
    router.go(-1);
};
</script>

<style scoped>
.custom-primary {
    color: #37715D !important;
}

.navbar {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
}

.navbar-brand {
    font-size: 1.25rem;
}
</style>