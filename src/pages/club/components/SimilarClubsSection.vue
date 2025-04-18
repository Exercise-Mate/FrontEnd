<template>
    <div class="similar-clubs-section container mb-5">
      <div class="section-header mb-4">
        <h2 class="section-title">비슷한 클럽</h2>
        <p class="section-subtitle">이 클럽과 비슷한 다른 클럽들을 살펴보세요!</p>
      </div>
  
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-custom-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">클럽을 불러오는 중...</p>
      </div>
      <div v-else>
        <div class="position-relative clubs-wrapper">
          <!-- 좌우 스크롤 버튼 -->
          <button class="navigation-btn navigation-btn-left" @click="prevPage" v-show="currentPage > 1">
            <i class="bi bi-chevron-left"></i>
          </button>
          
          <div class="clubs-container">
            <div class="row">
              <div v-for="club in currentPageClubs" :key="club.id" class="col-md-3 mb-4">
                <div class="club-card" @click="goToClubDetail(club.id)">
                  <div class="club-image-container">
                    <img :src="club.image" :alt="club.name" class="club-image">
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
                          <span class="sport-badge" :class="getSportClass(club.sport)">{{ club.sport }}</span>
                        </div>
                      </div>
  
                      <div class="info-item">
                        <div class="info-label">지역</div>
                        <div class="info-value">{{ club.location }}</div>
                      </div>
  
                      <div class="info-item">
                        <div class="info-label">실력 수준</div>
                        <div class="info-value">
                          <span class="skill-badge">{{ getSkillText(club.skillLevel) }}</span>
                        </div>
                      </div>
  
                      <div class="info-item">
                        <div class="info-label">나이대</div>
                        <div class="info-value">{{ club.ageRange }}</div>
                      </div>
                    </div>
  
                    <div class="club-footer">
                      <div class="club-activity" :class="getActivityClass(club.activityLevel)">
                        <i class="bi bi-circle-fill"></i>
                        <span>{{ getActivityText(club.activityLevel) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="similarClubs.length === 0" class="empty-state">
              <div class="empty-icon">
                <i class="bi bi-people"></i>
              </div>
              <h3 class="empty-title">비슷한 클럽이 없습니다</h3>
              <p class="empty-description">아직 비슷한 클럽이 없습니다. 다른 클럽을 찾아보세요!</p>
            </div>
          </div>
          
          <button class="navigation-btn navigation-btn-right" @click="nextPage" v-show="currentPage < totalPages">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
  
        <div class="pagination-dots text-center mt-3" v-if="similarClubs.length > 0">
          <span v-for="page in totalPages" :key="page" 
                class="pagination-dot" 
                :class="{ 'active': page === currentPage }"
                @click="goToPage(page)"></span>
        </div>
  
        <div class="text-center mt-4">
          <button class="btn btn-find-more" @click="findMoreClubs">
            <span>다른 클럽 찾아보기</span>
            <i class="bi bi-search ms-2"></i>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'SimilarClubsSection',
    props: {
      clubId: {
        type: [String, Number],
        required: true
      }
    },
    setup(props) {
      const router = useRouter();
      const isLoading = ref(true);
      const similarClubs = ref([]);
      
      // 페이지네이션 관련 상태
      const currentPage = ref(1);
      const itemsPerPage = 4; // 한 페이지에 4개씩 표시
      
      // 현재 페이지에 표시할 클럽 목록
      const currentPageClubs = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return similarClubs.value.slice(startIndex, endIndex);
      });
      
      // 총 페이지 수
      const totalPages = computed(() => {
        return Math.ceil(similarClubs.value.length / itemsPerPage);
      });
      
      // 특정 페이지로 이동
      const goToPage = (page) => {
        currentPage.value = page;
      };
      
      // 이전 페이지로 이동
      const prevPage = () => {
        if (currentPage.value > 1) {
          currentPage.value--;
        }
      };
      
      // 다음 페이지로 이동
      const nextPage = () => {
        if (currentPage.value < totalPages.value) {
          currentPage.value++;
        }
      };
      
      // 클럽 상세 페이지로 이동
      const goToClubDetail = (id) => {
        router.push(`/club/${id}`);
      };
      
      // 클럽 찾기 페이지로 이동
      const findMoreClubs = () => {
        router.push('/club');
      };
      
      // 스포츠 종류에 따른 클래스 반환
      const getSportClass = (sport) => {
        const sportMap = {
          '축구': 'sport-soccer',
          '농구': 'sport-basketball',
          '야구': 'sport-baseball',
          '배구': 'sport-volleyball',
          '테니스': 'sport-tennis',
          '배드민턴': 'sport-badminton',
          '골프': 'sport-golf',
          '수영': 'sport-swimming',
          '러닝': 'sport-running',
          '클라이밍': 'sport-climbing',
          '요가': 'sport-yoga',
          '필라테스': 'sport-pilates',
          '헬스': 'sport-fitness'
        };
        
        return sportMap[sport] || 'sport-default';
      };
      
      // 실력 수준에 따른 텍스트 반환
      const getSkillText = (skillLevel) => {
        const skillMap = {
          1: '입문',
          2: '초급',
          3: '중급',
          4: '상급',
          5: '전문가'
        };
        
        return skillMap[skillLevel] || '중급';
      };
      
      // 활동 수준에 따른 클래스 반환
      const getActivityClass = (activityLevel) => {
        const activityMap = {
          'active': 'activity-active',
          'moderate': 'activity-moderate',
          'inactive': 'activity-inactive',
          'high': 'activity-active',
          'medium': 'activity-moderate',
          'low': 'activity-inactive'
        };
        
        return activityMap[activityLevel] || '';
      };
      
      // 활동 수준에 따른 텍스트 반환
      const getActivityText = (activityLevel) => {
        const activityMap = {
          'active': '활발한 활동',
          'moderate': '보통 활동',
          'inactive': '낮은 활동',
          'high': '활발한 활동',
          'medium': '보통 활동',
          'low': '낮은 활동'
        };
        
        return activityMap[activityLevel] || '활동 정보 없음';
      };
      
      // 비슷한 클럽 목록 가져오기
      const fetchSimilarClubs = async () => {
        isLoading.value = true;
        
        try {
          // API 호출을 시뮬레이션 (실제 구현 시에는 아래 주석을 해제하고 사용)
          // const response = await fetch(`/api/clubs/${props.clubId}/similar`);
          // const data = await response.json();
          
          // API 응답 시뮬레이션 (1초 지연)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // API에서 받아온 데이터 (시뮬레이션) - 8개의 클럽
          const clubsData = [
            {
              id: 101,
              name: '서울 러닝 크루',
              sport: '러닝',
              location: '서울시 강남구',
              skillLevel: 2,
              ageRange: '20대 ~ 30대',
              members: 45,
              activityLevel: 'active',
              image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80'
            },
            {
              id: 102,
              name: '클라이밍 마스터즈',
              sport: '클라이밍',
              location: '서울시 마포구',
              skillLevel: 3,
              ageRange: '20대 ~ 40대',
              members: 32,
              activityLevel: 'moderate',
              image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80'
            },
            {
              id: 103,
              name: '테니스 프렌즈',
              sport: '테니스',
              location: '서울시 서초구',
              skillLevel: 2,
              ageRange: '30대',
              members: 28,
              activityLevel: 'active',
              image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80'
            },
            {
              id: 104,
              name: '볼더링 초보 모임',
              sport: '클라이밍',
              location: '서울시 강남구',
              skillLevel: 1,
              ageRange: '20대 ~ 30대',
              members: 24,
              activityLevel: 'moderate',
              image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1705&q=80'
            },
            {
              id: 105,
              name: '축구 동호회',
              sport: '축구',
              location: '서울시 송파구',
              skillLevel: 3,
              ageRange: '20대 ~ 40대',
              members: 52,
              activityLevel: 'active',
              image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80'
            },
            {
              id: 106,
              name: '수영 마스터즈',
              sport: '수영',
              location: '서울시 송파구',
              skillLevel: 4,
              ageRange: '30대 ~ 40대',
              members: 35,
              activityLevel: 'active',
              image: 'https://images.unsplash.com/photo-1560090995-01632a28895b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80'
            },
            {
              id: 107,
              name: '배드민턴 동호회',
              sport: '배드민턴',
              location: '서울시 강남구',
              skillLevel: 2,
              ageRange: '20대 ~ 50대',
              members: 40,
              activityLevel: 'moderate',
              image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80'
            },
            {
              id: 108,
              name: '요가 커뮤니티',
              sport: '요가',
              location: '서울시 마포구',
              skillLevel: 2,
              ageRange: '20대 ~ 40대',
              members: 38,
              activityLevel: 'moderate',
              image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80'
            }
          ];
          
          similarClubs.value = clubsData;
          
          console.log('비슷한 클럽 목록을 성공적으로 가져왔습니다:', similarClubs.value);
        } catch (error) {
          console.error('비슷한 클럽 목록을 가져오는 중 오류가 발생했습니다:', error);
          alert('클럽 목록을 불러오는데 실패했습니다. 다시 시도해주세요.');
        } finally {
          isLoading.value = false;
        }
      };
      
      onMounted(() => {
        // 비슷한 클럽 목록 가져오기
        fetchSimilarClubs();
      });
      
      return {
        isLoading,
        similarClubs,
        currentPage,
        currentPageClubs,
        totalPages,
        goToPage,
        prevPage,
        nextPage,
        goToClubDetail,
        findMoreClubs,
        getSportClass,
        getSkillText,
        getActivityClass,
        getActivityText
      };
    }
  };
  </script>
  
  <style scoped>
  /* 섹션 스타일 */
  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .section-subtitle {
    color: #6c757d;
    margin-bottom: 1.5rem;
  }
  
  /* 클럽 컨테이너 */
  .clubs-wrapper {
    position: relative;
    padding: 0 50px;
    margin-bottom: 20px;
  }
  
  .clubs-container {
    padding: 0.5rem 0;
    position: relative;
    overflow: hidden;
  }
  
  /* 네비게이션 버튼 스타일 */
  .navigation-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: white;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s;
  }
  
  .navigation-btn:hover {
    background-color: #f8f9fa;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .navigation-btn i {
    font-size: 1.2rem;
    color: #495057;
  }
  
  .navigation-btn-left {
    left: 0;
  }
  
  .navigation-btn-right {
    right: 0;
  }
  
  /* 다른 클럽 찾아보기 버튼 스타일 */
  .btn-find-more {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.5rem;
    border-radius: 2rem;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s;
    margin-top: 1rem;
  }
  
  .btn-find-more:hover {
    background-color: #e9ecef;
    color: #212529;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .btn-find-more i {
    font-size: 1.1rem;
  }
  
  /* 페이지네이션 점 스타일 */
  .pagination-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 1rem;
  }
  
  .pagination-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #dee2e6;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .pagination-dot.active {
    background-color: #37715D;
    transform: scale(1.2);
  }
  
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
  
  .sport-default {
    background-color: #95a5a6;
  }
  
  .sport-basketball { background-color: #FF9800; }
  .sport-baseball { background-color: #2196F3; }
  .sport-volleyball { background-color: #9C27B0; }
  .sport-golf { background-color: #795548; }
  .sport-pilates { background-color: #E91E63; }
  .sport-fitness { background-color: #F44336; }
  
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
  
  .activity-active {
    color: #2ecc71;
  }
  
  .activity-moderate {
    color: #f39c12;
  }
  
  .activity-inactive {
    color: #e74c3c;
  }
  
  /* 빈 상태 스타일 */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
    text-align: center;
  }
  
  .empty-icon {
    font-size: 3.5rem;
    color: #dee2e6;
    margin-bottom: 1.5rem;
  }
  
  .empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #333;
  }
  
  .empty-description {
    color: #6c757d;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
  
  /* 커스텀 색상 클래스 */
  .text-custom-primary {
    color: #37715D;
  }
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    .clubs-wrapper {
      padding: 0 40px;
    }
    
    .navigation-btn {
      width: 35px;
      height: 35px;
    }
    
    .club-info {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
  }
  </style>