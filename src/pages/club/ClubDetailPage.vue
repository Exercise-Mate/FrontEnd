<template>
    <div class="club-detail-page">
      <div v-if="isLoading" class="loading-container">
        <div class="spinner-border text-custom-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">클럽 정보를 불러오는 중...</p>
      </div>
      <div v-else>
        <!-- 클럽 정보 섹션 -->
        <ClubInfoSection :clubInfo="clubInfo" />
  
        <!-- 클럽 약속 섹션 -->
        <ClubAppointmentsSection :clubId="clubId" />
  
        <!-- 비슷한 클럽 섹션 -->
        <SimilarClubsSection :clubId="clubId" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import ClubInfoSection from './components/ClubInfoSection.vue';
  import ClubAppointmentsSection from './components/ClubAppointmentsSection.vue';
  import SimilarClubsSection from './components/SimilarClubsSection.vue';

  
  const route = useRoute();
  const clubId = ref(route.params.id);
  const clubInfo = ref({});
  const isLoading = ref(true);
  
  // 클럽 정보 가져오기
  const fetchClubInfo = async () => {
    isLoading.value = true;
    
    try {
      // API 호출을 시뮬레이션 (실제 구현 시에는 아래 주석을 해제하고 사용)
      // const response = await fetch(`/api/clubs/${clubId.value}`);
      // const data = await response.json();
      
      // API 응답 시뮬레이션 (1초 지연)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // API에서 받아온 데이터 (시뮬레이션)
      const apiResponse = {
        id: clubId.value,
        name: '서울 클라이밍 크루',
        description: '우리는 클라이밍을 좋아하는 20~30대 모임입니다.\n우리는 클라이밍을 좋아하는 20~30대 모임입니다.\n우리는 클라이밍을 좋아하는 20~30대 모임입니다.\n\n클라이밍을 하고 싶으세요? 어서오세요 같이 열심히 하는 사람을 모집합니다.\n클라이밍을 하고 싶으세요? 어서오세요 같이 열심히 하는 사람을 모집합니다.\n클라이밍을 하고 싶으세요? 어서오세요 같이 열심히 하는 사람을 모집합니다.\n\n우리는 함께 할 수 있습니다. 고수가 되고 싶으신가요? 선수가 되고 싶다구요? 저희 크루로 들어오세요.\n우리는 함께 할 수 있습니다. 고수가 되고 싶으신가요? 선수가 되고 싶다구요? 저희 크루로 들어오세요.\n우리는 함께 할 수 있습니다. 고수가 되고 싶으신가요? 선수가 되고 싶다구요? 저희 크루로 들어오세요.',
        imgUrl: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
        sportType: ['클라이밍', '볼더링'],
        mainArea: '서울시 홍대',
        subAreas: ['서울시 강남', '서울시 신촌', '서울시 종로'],
        maxMembersLimit: 50,
        currentMembers: 35,
        likeCount: 25,
        owner: '클라이밍 마스터',
        ownerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        sportAbilityMin: '초보',
        sportAbilityMax: '상급',
      };
      
      // 받아온 데이터로 클럽 정보 업데이트
      clubInfo.value = apiResponse;
      
      console.log('클럽 정보를 성공적으로 가져왔습니다:', clubInfo.value);
    } catch (error) {
      console.error('클럽 정보를 가져오는 중 오류가 발생했습니다:', error);
      alert('클럽 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      isLoading.value = false;
    }
  };
  
  onMounted(() => {
    // 클럽 정보 가져오기
    fetchClubInfo();
  });
  </script>
  
  <style scoped>
  /* 페이지 스타일 */
  .club-detail-page {
    min-height: 100vh;
    background-color: #f8f9fa;
    padding-bottom: 2rem;
  }
  
  /* 로딩 컨테이너 */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  
  /* 커스텀 색상 클래스 */
  .text-custom-primary {
    color: #37715D !important;
  }
  </style>