<template>
  <div>
    <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 100vh;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <appointment-detail v-else-if="appointment" :appointment="appointment" />
    <div v-else class="container py-5 text-center">
      <div class="alert alert-danger">
        <h4 class="alert-heading">약속을 찾을 수 없습니다</h4>
        <p>요청하신 약속 정보를 찾을 수 없습니다. 다시 시도해주세요.</p>
        <button class="btn btn-primary" @click="goBack">돌아가기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppointmentDetail from '@/pages/promise/components/AppointmentDetail.vue';

const route = useRoute();
const router = useRouter();
const appointment = ref(null);
const loading = ref(true);

// 뒤로가기 함수
const goBack = () => {
  router.push('/');
};

// 약속 데이터 가져오기 (실제로는 API에서 가져올 것)
onMounted(async () => {
  try {
    loading.value = true;

    // 실제 구현에서는 API 호출로 대체
    // const response = await fetch(`/api/appointments/${route.params.id}`);
    // appointment.value = await response.json();

    // 데이터 로딩 시뮬레이션 (실제 구현에서는 제거)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 예시 데이터
    appointment.value = {
      id: route.params.id,
      title: 'DM 클라이밍 크루',
      category: '클라이밍',
      image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
      createdAt: '1시간 전',
      time: '2024.09.22 17시 00분',
      location: '서울시 동작구',
      participants: {
        current: 14,
        max: 20
      },
      host: {
        name: 'Climbing Master',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      isClub: true // 클럽 약속 여부
    };
  } catch (error) {
    console.error('약속 데이터를 가져오는 중 오류 발생:', error);
    appointment.value = null;
  } finally {
    loading.value = false;
  }
});
</script>