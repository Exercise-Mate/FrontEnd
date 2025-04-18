<template>
    <div class="club-card" @click="handleCardClick">
      <div class="club-image-container">
        <img :src="club.image" :alt="club.name" class="club-image">
        <div v-if="rank" class="club-rank">{{ rank }}</div>
      </div>
      <div class="club-content">
        <div class="club-header">
          <h3 class="club-name">{{ club.name }}</h3>
          <div class="club-members">
            <i class="bi bi-people-fill"></i>
            <span>{{ club.members }}명</span>
          </div>
        </div>
  
        <div class="club-info">
          <div class="info-item">
            <div class="info-label">운동 종류</div>
            <div class="info-value">
              <span class="sport-badge" :class="getSportClass(club.sportType)">{{ club.sportType }}</span>
            </div>
          </div>
  
          <div class="info-item">
            <div class="info-label">지역</div>
            <div class="info-value">{{ club.mainArea }}</div>
          </div>
  
          <div class="info-item">
            <div class="info-label">실력 수준</div>
            <div class="info-value">
              <span class="skill-badge">{{ getAbilityRangeText(club.sportAbilityMin, club.sportAbilityMax) }}</span>
            </div>
          </div>
  
          <div class="info-item">
            <div class="info-label">나이대</div>
            <div class="info-value">{{ getAgeRangeText(club.ageLimitMin, club.ageLimitMax) }}</div>
          </div>
        </div>
  
        <div class="club-footer">
          <div class="club-activity" :class="getActivityClass(club.activityLevel)">
            <i class="bi bi-circle-fill"></i>
            <span>{{ getActivityText(club.activityLevel) }}</span>
          </div>
          <div 
            class="club-likes" 
            @click.stop="toggleLike"
            :class="{ 'liked': isLiked }"
          >
            <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i>
            <span>{{ likeCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  const props = defineProps({
    club: {
      type: Object,
      required: true
    },
    rank: {
      type: Number,
      default: null
    }
  });
  
  const emit = defineEmits(['like']);
  
  // useRouter 훅을 항상 호출하도록 수정
  const router = useRouter();
  
  // 좋아요 상태 관리
  const isLiked = ref(props.club.isLiked || false);
  const likeCount = ref(props.club.like || 0);
  
  // 좋아요 토글 함수
  const toggleLike = () => {
    isLiked.value = !isLiked.value;
    likeCount.value = isLiked.value ? likeCount.value + 1 : likeCount.value - 1;
    
    // 부모 컴포넌트에 이벤트 발생
    emit('like', {
      clubId: props.club.id,
      isLiked: isLiked.value
    });
  };
  
  // 클럽 카드 클릭 핸들러
  const handleCardClick = () => {
    router.push(`/club/detail/${props.club.id}`);
  };
  
  // 스포츠 종류에 따른 클래스 반환
  const getSportClass = (sportType) => {
    const sportMap = {
      '클라이밍': 'sport-climbing',
      '볼더링': 'sport-bouldering',
      '러닝': 'sport-running',
      '테니스': 'sport-tennis',
      '축구': 'sport-soccer',
      '요가': 'sport-yoga',
      '배드민턴': 'sport-badminton',
      '수영': 'sport-swimming',
      '농구': 'sport-basketball',
      '야구': 'sport-baseball',
      '배구': 'sport-volleyball',
      '골프': 'sport-golf',
      '필라테스': 'sport-pilates',
      '헬스': 'sport-fitness'
    };
    
    return sportMap[sportType] || 'sport-default';
  };
  
  // 실력 수준 텍스트 반환
  const getAbilityText = (level) => {
    const abilityMap = {
      1: '입문',
      2: '초급',
      3: '중급',
      4: '상급',
      5: '전문가'
    };
    
    return abilityMap[level] || '무관';
  };
  
  // 실력 범위 텍스트 반환
  const getAbilityRangeText = (min, max) => {
    if (!min && !max) return '무관';
    if (min && !max) return `${getAbilityText(min)} 이상`;
    if (!min && max) return `${getAbilityText(max)} 이하`;
    if (min === max) return getAbilityText(min);
    return `${getAbilityText(min)} ~ ${getAbilityText(max)}`;
  };
  
  // 나이대 범위 텍스트 반환
  const getAgeRangeText = (min, max) => {
    if (!min && !max) return '전 연령';
    if (min && !max) return `${min}대 이상`;
    if (!min && max) return `${max}대 이하`;
    if (min === max) return `${min}대`;
    return `${min}대 ~ ${max}대`;
  };
  
  // 활동 수준에 따른 클래스 반환
  const getActivityClass = (level) => {
    const activityMap = {
      'active': 'activity-active',
      'moderate': 'activity-moderate',
      'inactive': 'activity-inactive',
      'high': 'activity-active',
      'medium': 'activity-moderate',
      'low': 'activity-inactive'
    };
    
    return activityMap[level] || '';
  };
  
  // 활동 수준에 따른 텍스트 반환
  const getActivityText = (level) => {
    const activityMap = {
      'active': '활발한 활동',
      'moderate': '보통 활동',
      'inactive': '낮은 활동',
      'high': '활발한 활동',
      'medium': '보통 활동',
      'low': '낮은 활동'
    };
    
    return activityMap[level] || '활동 정보 없음';
  };
  </script>
  
  <style scoped>
  /* 클럽 카드 스타일 */
  .club-card {
    background-color: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .club-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .club-image-container {
    position: relative;
    height: 160px;
    overflow: hidden;
  }
  
  .club-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .club-card:hover .club-image {
    transform: scale(1.05);
  }
  
  .club-rank {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.8rem;
  }
  
  .club-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  
  .club-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.25rem;
  }
  
  .club-name {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0;
    color: #333;
    line-height: 1.3;
  }
  
  .club-members {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c757d;
    font-size: 0.9rem;
    white-space: nowrap;
  }
  
  .club-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .info-label {
    font-size: 0.8rem;
    color: #6c757d;
  }
  
  .info-value {
    font-size: 0.95rem;
    font-weight: 500;
    color: #333;
  }
  
  /* 운동 종류 배지 스타일 */
  .sport-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: white;
  }
  
  .sport-climbing {
    background-color: #e74c3c;
  }
  
  .sport-bouldering {
    background-color: #d35400;
  }
  
  .sport-running {
    background-color: #3498db;
  }
  
  .sport-tennis {
    background-color: #2ecc71;
  }
  
  .sport-soccer {
    background-color: #f39c12;
  }
  
  .sport-yoga {
    background-color: #9b59b6;
  }
  
  .sport-badminton {
    background-color: #1abc9c;
  }
  
  .sport-swimming {
    background-color: #3498db;
  }
  
  .sport-basketball {
    background-color: #FF9800;
  }
  
  .sport-baseball {
    background-color: #2196F3;
  }
  
  .sport-volleyball {
    background-color: #9C27B0;
  }
  
  .sport-golf {
    background-color: #795548;
  }
  
  .sport-pilates {
    background-color: #E91E63;
  }
  
  .sport-fitness {
    background-color: #F44336;
  }
  
  .sport-default {
    background-color: #95a5a6;
  }
  
  /* 실력 수준 스타일 */
  .skill-badge {
    display: inline-block;
    padding: 0.15rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #333;
    background-color: #f1f3f5;
  }
  
  /* 클럽 푸터 스타일 */
  .club-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #f1f3f5;
  }
  
  .club-activity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .club-activity i {
    font-size: 0.7rem;
  }
  
  .club-likes {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: #6c757d;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .club-likes:hover {
    transform: scale(1.1);
  }
  
  .club-likes.liked {
    color: #dc3545;
  }
  
  .club-likes i {
    font-size: 0.9rem;
  }
  
  .activity-active {
    color: #2ecc71;
  }
  
  .activity-moderate {
    color: #f39c12;
  }
  
  .activity-inactive {
    color: #e74c3c;
  }
  
  @media (max-width: 768px) {
    .club-info {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
  }
  </style>