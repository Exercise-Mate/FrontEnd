<template>
    <div class="club-info-section">
      <!-- 클럽 배너 이미지 -->
      <div class="club-banner mb-4">
        <img :src="clubInfo.imgUrl" :alt="clubInfo.name" class="club-banner-image">
      </div>
  
      <!-- 클럽 정보 섹션 -->
      <div class="container mb-5">
        <div class="row">
          <div class="col-md-8">
            <!-- 클럽 제목 -->
            <h1 class="club-title mb-2">{{ clubInfo.name }}</h1>
            
            <!-- 클럽장 정보 -->
            <div class="d-flex align-items-center mb-3">
              <div class="owner-avatar me-2">
                <img :src="clubInfo.ownerAvatar" :alt="clubInfo.owner" class="owner-image">
              </div>
              <div class="owner-name">클럽장: {{ clubInfo.owner }}</div>
            </div>
            
            <!-- 간단한 메타 정보 -->
            <div class="simple-meta d-flex flex-wrap mb-2">
              <div class="simple-meta-item me-4">
                <span v-for="(sport, index) in clubInfo.sportType" :key="index" class="sport-badge me-1">
                  {{ sport }}
                </span>
              </div>
            </div>

            <div class="simple-meta d-flex flex-wrap mb-4">
                <div class="simple-meta-item">
                  <i class="bi bi-people me-1"></i>
                  <span>{{ clubInfo.currentMembers }}/{{ clubInfo.maxMembersLimit }}명</span>
                </div>
              </div>
          </div>
          
          <div class="col-md-4">
            <!-- 액션 버튼 영역 -->
            <div class="club-actions">
              <!-- 좋아요/찜하기 버튼 -->
              <button class="btn btn-like" :class="{ 'liked': isLiked }" @click="toggleLike">
                <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i>
                <span>{{ clubInfo.likeCount }} 찜하기</span>
              </button>
              
              <!-- 가입 상태에 따른 버튼 -->
              <button v-if="isJoined" class="btn btn-chat" @click="openChat">
                <i class="bi bi-chat-dots-fill me-2"></i>클럽 채팅하기
              </button>
              <button v-else class="btn btn-join" @click="joinClub">
                <i class="bi bi-person-plus-fill me-2"></i>클럽 가입하기
              </button>
            </div>
          </div>
        </div>
  
        <div class="section-header mb-4">
            <h2 class="section1-title">클럽 소개</h2>
            <p class="section1-subtitle">우리 클럽은 이런 클럽이에요!</p>
        </div>
        <!-- 클럽 소개 섹션 -->
        <div class="club-description-section mb-4">
          <h2 class="section-title">클럽 설명</h2>
          <p class="club-description" v-for="(line, index) in clubDescriptionLines" :key="index">{{ line }}</p>
        </div>
  
        <!-- 활동 지역 정보 -->
        <div class="club-meta-card mb-4">
          <h2 class="section-title"><i class="bi bi-geo-alt me-2"></i>활동 지역</h2>
          <div class="meta-content">
            <div class="area-item">
              <div class="area-label">주 활동 지역</div>
              <div class="area-value">{{ clubInfo.mainArea }}</div>
            </div>
            <div class="area-item" v-if="clubInfo.subAreas && clubInfo.subAreas.length > 0">
              <div class="area-label">부 활동 지역</div>
              <div class="area-value">
                <span v-for="(area, index) in clubInfo.subAreas" :key="index" class="sub-area-badge">
                  {{ area }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 실력 수준 정보 -->
        <div class="club-meta-card">
          <h2 class="section-title"><i class="bi bi-trophy me-2"></i>실력 수준</h2>
          <div class="meta-content">
            <div class="skill-level">
              {{ getSkillRangeText(clubInfo.sportAbilityMin, clubInfo.sportAbilityMax) }}
            </div>
            <div class="skill-description mt-3">
              <p>이 클럽은 {{ getSkillDescription(clubInfo.sportAbilityMin, clubInfo.sportAbilityMax) }}</p>
              <div class="skill-tips mt-3">
                <div class="skill-tip-item">
                  <div class="skill-tip-icon"><i class="bi bi-lightbulb"></i></div>
                  <div class="skill-tip-text">
                    <strong>초보자 팁:</strong> 기본 기술을 배우고 안전하게 즐기는 방법을 익혀보세요.
                  </div>
                </div>
                <div class="skill-tip-item" v-if="hasIntermediateOrAbove">
                  <div class="skill-tip-icon"><i class="bi bi-stars"></i></div>
                  <div class="skill-tip-text">
                    <strong>중급자 이상 팁:</strong> 정기적인 연습과 다양한 코스 도전으로 실력을 향상시켜보세요.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const props = defineProps({
    clubInfo: {
      type: Object,
      required: true,
      default: () => ({})
    }
  });
  
  // 클럽 가입 여부 상태 (실제로는 API에서 받아와야 함)
  const isJoined = ref(false);
  
  // 좋아요/찜하기 상태
  const isLiked = ref(false);
  
  // 클럽 설명을 줄바꿈으로 분리
  const clubDescriptionLines = computed(() => {
    return props.clubInfo.description ? props.clubInfo.description.split('\n') : [];
  });
  
  // 중급자 이상 포함 여부
  const hasIntermediateOrAbove = computed(() => {
    const min = props.clubInfo.sportAbilityMin?.toLowerCase();
    const max = props.clubInfo.sportAbilityMax?.toLowerCase();
    return max === '중급' || max === '상급' || min === '중급' || min === '상급';
  });
  
  // 운동 실력 범위 텍스트 생성
  const getSkillRangeText = (min, max) => {
    if (!min && !max) return '무관';
    if (min === max) return min;
    return `${min} ~ ${max}`;
  };
  
  // 실력 수준에 따른 설명 생성
  const getSkillDescription = (min, max) => {
    if (!min && !max) return '모든 실력 수준의 회원을 환영합니다.';
    if (min === '초보' && max === '상급') return '초보자부터 상급자까지 모든 실력 수준의 회원이 함께 활동하는 클럽입니다.';
    if (min === '초보' && max === '중급') return '초보자와 중급자가 함께 배우고 성장할 수 있는 클럽입니다.';
    if (min === '중급' && max === '상급') return '어느 정도 경험이 있는 중급자부터 상급자까지 함께 활동하는 클럽입니다.';
    if (min === max && min === '초보') return '클라이밍을 처음 시작하는 초보자들을 위한 클럽입니다.';
    if (min === max && min === '중급') return '기본기가 갖춰진 중급자들이 함께 활동하는 클럽입니다.';
    if (min === max && min === '상급') return '높은 수준의 실력을 갖춘 상급자들이 함께 활동하는 클럽입니다.';
    return `${min}부터 ${max}까지의 실력을 가진 회원들이 함께 활동하는 클럽입니다.`;
  };
  
  // 좋아요/찜하기 토글
  const toggleLike = () => {
    isLiked.value = !isLiked.value;
    // 실제 구현 시에는 API 호출 필요
    console.log('찜하기 상태 변경:', isLiked.value);
  };
  
  // 클럽 채팅 열기
  const openChat = () => {
    // 실제 구현 시에는 채팅 페이지로 이동 또는 채팅 모달 열기
    console.log('클럽 채팅 열기');
  };

  // 클럽 가입하기
  const joinClub = () => {
    router.push('/club/join');
  };
  </script>
  
  <style scoped>
  /* 클럽 배너 스타일 */
  .club-banner {
    width: 100%;
    height: 400px;
    overflow: hidden;
    position: relative;
    border-radius: 0.75rem;
  }
  
  .club-banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  /* 클럽 제목 스타일 */
  .club-title {
    font-size: 2.25rem;
    font-weight: 700;
  }
  
  /* 클럽장 정보 스타일 */
  .owner-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #e9ecef;
  }
  
  .owner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .owner-name {
    font-size: 0.95rem;
    color: #6c757d;
  }
  
  /* 간단한 메타 정보 스타일 */
  .simple-meta {
    gap: 1.5rem;
  }
  
  .simple-meta-item {
    display: flex;
    align-items: center;
    color: #495057;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }
  
  .sport-badge {
    display: inline-block;
    padding: 0.15rem 0.5rem;
    background-color: #d1e7dd;
    color: #0f5132;
    border-radius: 0.25rem;
    font-size: 0.8rem;
  }
  
  /* 클럽 설명 섹션 스타일 */
  .club-description-section {
    background-color: #fff;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #37715D;
  }
  
  .club-description {
    margin-bottom: 0.5rem;
    color: #6c757d;
  }

  .section1-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .section1-subtitle {
    color: #6c757d;
    margin-bottom: 1.5rem;
  }
  
  /* 클럽 액션 버튼 스타일 */
  .club-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-like {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #6c757d;
    transition: all 0.2s;
  }
  
  .btn-like:hover {
    background-color: #e9ecef;
  }
  
  .btn-like.liked {
    background-color: #f8d7da;
    border-color: #f5c2c7;
    color: #dc3545;
  }
  
  .btn-like.liked:hover {
    background-color: #f5c2c7;
  }
  
  .btn-chat {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    background-color: #37715D;
    border: none;
    color: white;
    transition: all 0.2s;
  }
  
  .btn-chat:hover {
    background-color: #2c5a4a;
  }
  
  .btn-join {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    background-color: #37715D;
    border: none;
    color: white;
    transition: all 0.2s;
  }
  
  .btn-join:hover {
    background-color: #2c5a4a;
  }
  
  /* 메타 카드 스타일 */
  .club-meta-card {
    background-color: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  }
  
  .meta-content {
    color: #495057;
  }
  
  /* 활동 지역 스타일 */
  .area-item {
    margin-bottom: 0.75rem;
  }
  
  .area-label {
    font-size: 0.875rem;
    color: #6c757d;
    margin-bottom: 0.25rem;
  }
  
  .area-value {
    font-weight: 500;
  }
  
  .sub-area-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    background-color: #e9ecef;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }
  
  /* 실력 수준 스타일 */
  .skill-level {
    font-weight: 600;
    font-size: 1.2rem;
    color: #37715D;
  }
  
  .skill-description {
    color: #6c757d;
  }
  
  .skill-tips {
    margin-top: 1rem;
  }
  
  .skill-tip-item {
    display: flex;
    margin-bottom: 0.75rem;
    background-color: #f8f9fa;
    padding: 0.75rem;
    border-radius: 0.5rem;
  }
  
  .skill-tip-icon {
    margin-right: 0.75rem;
    color: #37715D;
    font-size: 1.25rem;
  }
  
  .skill-tip-text {
    font-size: 0.9rem;
  }
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    .club-banner {
      height: 250px;
    }
    
    .club-title {
      font-size: 1.75rem;
    }
    
    .club-actions {
      margin-top: 1.5rem;
    }
    
    .section-title {
      font-size: 1.25rem;
    }
  }
  </style>