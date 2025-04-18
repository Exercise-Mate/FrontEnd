<template>
    <div>
        <div class="container-fluid px-0">
            <!-- 상단 네비게이션 -->
            <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div class="container">
                    <a class="navbar-brand d-flex align-items-center" href="#">
                        <i class="bi bi-people-fill custom-primary me-2 fs-4"></i>
                        <span class="fw-bold">클럽 수정</span>
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

            <!-- 클럽 수정 폼 컴포넌트 -->
            <club-edit-form :clubId="clubId" />
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import ClubEditForm from './components/ClubEditForm.vue';
import { ref, onMounted } from 'vue';

const router = useRouter();
const route = useRoute();
const clubId = ref(null);

// 라우트 파라미터에서 클럽 ID 가져오기
clubId.value = route.params.id;

// 뒤로가기 함수
const goBack = () => {
    router.go(-1);
};

onMounted(() => {
    // 클럽 ID가 없으면 목록 페이지로 리다이렉트
    if (!clubId.value) {
        router.push('/');
    }
});
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