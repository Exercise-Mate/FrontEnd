<template>
    <div class="club-finding-page">
      <!-- 헤더 섹션 -->
      <div class="hero-section">
        <div class="hero-overlay"></div>
        <div class="container position-relative">
          <div class="hero-content text-white">
            <h1 class="hero-title display-4 fw-bold mb-3">나에게 맞는 클럽을 찾아보세요</h1>
            <p class="hero-description lead mb-4">함께 운동하고, 성장하고, 즐거운 시간을 보낼 수 있는 클럽을 찾아보세요.</p>
            <p class="hero-subtitle">다양한 운동 종목, 지역, 실력 수준에 맞는 클럽이 여러분을 기다리고 있습니다.</p>
            
            <!-- 클럽 생성 버튼 추가 -->
            <div class="hero-actions mt-4">
              <button class="btn btn-custom-primary btn-lg" @click="goToCreateClub">
                <i class="bi bi-plus-circle me-2"></i>새 클럽 만들기
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 필터 섹션 -->
      <div class="filter-section">
        <div class="container">
          <div class="filter-container bg-white rounded-3 shadow-sm p-4 mb-4">
            <div class="row">
              <div class="col-md-4">
                <SportSelector v-model="selectedSportTypes" label="운동 종목" :required="false" />
              </div>
              <div class="col-md-4">
                <LocationSelector v-model="selectedMainAreas" label="활동 지역" :required="false" :multiple="true" />
              </div>
              <div class="col-md-4">
                <div class="mb-4">
                  <label class="form-label fw-medium mb-2">실력 수준</label>
                  <div class="skill-level-selector d-flex flex-wrap gap-2">
                    <button 
                      v-for="level in skillLevels" 
                      :key="level.value"
                      class="btn btn-outline-secondary" 
                      :class="{ 'active': selectedSportAbilities.includes(level.value) }"
                      @click="toggleSportAbility(level.value)"
                    >
                      {{ level.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-end mt-2">
              <button class="btn btn-outline-secondary me-2" @click="resetFilters">
                <i class="bi bi-arrow-counterclockwise me-1"></i> 필터 초기화
              </button>
              <button class="btn btn-custom-primary" @click="applyFilters">
                <i class="bi bi-search me-1"></i> 클럽 찾기
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 클럽 목록 섹션 -->
      <div class="clubs-section">
        <div class="container">
          <!-- 검색 결과 정보 -->
          <div class="search-info d-flex justify-content-between align-items-center mb-3">
            <div class="result-count">
              <span class="fw-medium">총 {{ totalClubs }}개</span>의 클럽이 검색되었습니다.
            </div>
            <div class="sort-container">
              <label class="sort-label me-2">정렬:</label>
              <select class="form-select form-select-sm" v-model="sortOption">
                <option value="newest">최신순</option>
                <option value="members">회원 많은순</option>
                <option value="name">이름순</option>
              </select>
            </div>
          </div>
  
          <!-- 클럽 카드 목록 -->
          <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-custom-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">클럽을 불러오는 중...</p>
          </div>
          <div v-else>
            <div v-if="currentPageClubs.length > 0" class="club-list">
              <ClubCard 
                v-for="club in currentPageClubs" 
                :key="club.id" 
                :club="club"
                @like="handleLike"
              />
            </div>
            <div v-else class="empty-state">
              <div class="empty-icon">
                <i class="bi bi-people"></i>
              </div>
              <h3 class="empty-title">검색 결과가 없습니다</h3>
              <p class="empty-description">다른 검색 조건으로 다시 시도해보세요!</p>
              <div class="empty-actions">
                <button class="btn btn-custom-primary btn-lg me-3" @click="resetFilters">
                  <i class="bi bi-arrow-counterclockwise me-2"></i> 필터 초기화
                </button>
                <button class="btn btn-outline-secondary btn-lg" @click="goToCreateClub">
                  <i class="bi bi-plus-circle me-2"></i>새 클럽 만들기
                </button>
              </div>
            </div>
  
            <!-- 페이지네이션 -->
            <div class="pagination-container d-flex justify-content-center mt-5">
              <nav aria-label="Page navigation">
                <ul class="pagination">
                  <!-- 이전 페이지 세트 -->
                  <li class="page-item" :class="{ 'disabled': currentPageSet === 1 }">
                    <a class="page-link" href="#" @click.prevent="goToPrevPageSet">
                      <i class="bi bi-chevron-double-left"></i>
                    </a>
                  </li>
                  
                  <!-- 이전 페이지 -->
                  <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="goToPrevPage">
                      <i class="bi bi-chevron-left"></i>
                    </a>
                  </li>
                  
                  <!-- 페이지 번호 -->
                  <li v-for="page in pagesInCurrentSet" :key="page" class="page-item" :class="{ 'active': page === currentPage }">
                    <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
                  </li>
                  
                  <!-- 다음 페이지 -->
                  <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="goToNextPage">
                      <i class="bi bi-chevron-right"></i>
                    </a>
                  </li>
                  
                  <!-- 다음 페이지 세트 -->
                  <li class="page-item" :class="{ 'disabled': currentPageSet === totalPageSets }">
                    <a class="page-link" href="#" @click.prevent="goToNextPageSet">
                      <i class="bi bi-chevron-double-right"></i>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 인기 클럽 섹션 -->
      <div class="popular-clubs-section py-5 bg-light">
        <div class="container">
          <div class="section-header mb-4">
            <h2 class="section-title fw-bold">인기 클럽</h2>
            <p class="section-description text-muted">가장 많은 회원들이 활동하고 있는 인기 클럽을 만나보세요</p>
          </div>
          
          <div class="club-list">
            <ClubCard 
              v-for="(club, index) in popularClubs" 
              :key="club.id" 
              :club="club"
              :rank="index + 1"
              @like="handleLike"
            />
          </div>
        </div>
      </div>
      
      <!-- 추천 클럽 섹션 -->
      <div class="recommended-clubs-section py-5">
        <div class="container">
          <div class="section-header mb-4">
            <h2 class="section-title fw-bold">추천 클럽</h2>
            <p class="section-description text-muted">당신의 관심사와 지역에 맞는 클럽을 추천해드립니다</p>
          </div>
          
          <div class="club-list">
            <ClubCard 
              v-for="club in recommendedClubs" 
              :key="club.id" 
              :club="club"
              @like="handleLike"
            />
          </div>
        </div>
      </div>
  
      <!-- 클럽 생성 CTA 섹션 추가 -->
      <div class="create-club-cta py-5 bg-light">
        <div class="container">
          <div class="filter-container bg-white rounded-3 shadow-sm p-4">
            <div class="row align-items-center">
              <div class="col-md-8">
                <div class="cta-icon mb-3">
                  <i class="bi bi-people-fill"></i>
                </div>
                <h2 class="cta-title fw-bold mb-3">나만의 클럽을 만들어보세요</h2>
                <p class="cta-description text-muted mb-0">
                  원하는 클럽을 찾지 못하셨나요? 직접 클럽을 만들고 같은 관심사를 가진 사람들과 함께하세요.
                  지금 바로 나만의 클럽을 만들고 클럽장이 되어보세요!
                </p>
              </div>
              <div class="col-md-4 text-md-end mt-4 mt-md-0">
                <button class="btn btn-custom-primary btn-lg" @click="goToCreateClub">
                  <i class="bi bi-plus-circle me-2"></i>새 클럽 만들기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 플로팅 버튼 추가 -->
      <div class="floating-create-btn" @click="goToCreateClub">
        <i class="bi bi-plus-lg"></i>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import SportSelector from './components/SportSelector.vue';
  import LocationSelector from './components/LocationSelector.vue';
  import ClubCard from './components/ClubCard.vue';
  
  export default {
    name: 'ClubPage',
    components: {
      SportSelector,
      LocationSelector,
      ClubCard
    },
    setup() {
      const router = useRouter();
      const isLoading = ref(false);
      const clubs = ref([]);
      const filteredClubs = ref([]);
      const totalClubs = computed(() => filteredClubs.value.length);
      
      // 필터 상태
      const selectedSportTypes = ref([]);
      const selectedMainAreas = ref([]);
      const selectedSportAbilities = ref([]);
      const sortOption = ref('newest');
      
      // 페이지네이션 관련 상태
      const currentPage = ref(1);
      const itemsPerPage = 12; // 한 페이지에 12개씩 표시 (4x3 그리드)
      const pagesPerSet = 5; // 한 세트에 5페이지씩 표시
      
      // 인기 클럽과 추천 클럽
      const popularClubs = ref([]);
      const recommendedClubs = ref([]);
      
      // 실력 수준 옵션
      const skillLevels = [
        { value: 1, label: '입문' },
        { value: 2, label: '초급' },
        { value: 3, label: '중급' },
        { value: 4, label: '상급' },
        { value: 5, label: '전문가' }
      ];
      
      // 현재 페이지에 표시할 클럽 목록
      const currentPageClubs = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredClubs.value.slice(startIndex, endIndex);
      });
      
      // 총 페이지 수
      const totalPages = computed(() => {
        return Math.ceil(filteredClubs.value.length / itemsPerPage);
      });
      
      // 현재 페이지 세트
      const currentPageSet = computed(() => {
        return Math.ceil(currentPage.value / pagesPerSet);
      });
      
      // 총 페이지 세트 수
      const totalPageSets = computed(() => {
        return Math.ceil(totalPages.value / pagesPerSet);
      });
      
      // 현재 페이지 세트에 표시할 페이지 번호 목록
      const pagesInCurrentSet = computed(() => {
        const startPage = (currentPageSet.value - 1) * pagesPerSet + 1;
        const endPage = Math.min(startPage + pagesPerSet - 1, totalPages.value);
        
        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        
        return pages;
      });
      
      // 클럽 생성 페이지로 이동
      const goToCreateClub = () => {
        router.push('/club/create');
      };
      
      // 좋아요 처리 함수
      const handleLike = ({ clubId, isLiked }) => {
        console.log(`클럽 ${clubId} 좋아요 상태: ${isLiked}`);
        
        // 실제 구현에서는 API 호출을 통해 서버에 좋아요 상태 업데이트
        // const response = await fetch(`/api/clubs/${clubId}/like`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ isLiked }),
        // });
        
        // 모든 클럽 목록에서 해당 클럽의 좋아요 상태 업데이트
        const updateClubLikeStatus = (clubsList) => {
          const clubIndex = clubsList.findIndex(club => club.id === clubId);
          if (clubIndex !== -1) {
            clubsList[clubIndex].isLiked = isLiked;
            clubsList[clubIndex].like = isLiked 
              ? (clubsList[clubIndex].like || 0) + 1 
              : Math.max((clubsList[clubIndex].like || 0) - 1, 0);
          }
        };
        
        // 각 클럽 목록에서 좋아요 상태 업데이트
        updateClubLikeStatus(clubs.value);
        updateClubLikeStatus(filteredClubs.value);
        updateClubLikeStatus(popularClubs.value);
        updateClubLikeStatus(recommendedClubs.value);
      };
      
      // 정렬 옵션 변경 시 클럽 목록 재정렬
      watch(sortOption, () => {
        sortClubs();
      });
      
      // 클럽 목록 정렬
      const sortClubs = () => {
        switch (sortOption.value) {
          case 'newest':
            filteredClubs.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'members':
            filteredClubs.value.sort((a, b) => b.members - a.members);
            break;
          case 'name':
            filteredClubs.value.sort((a, b) => a.name.localeCompare(b.name));
            break;
        }
      };
      
      // 실력 수준 토글
      const toggleSportAbility = (level) => {
        const index = selectedSportAbilities.value.indexOf(level);
        if (index === -1) {
          selectedSportAbilities.value.push(level);
        } else {
          selectedSportAbilities.value.splice(index, 1);
        }
      };
      
      // 필터 적용
      const applyFilters = () => {
        isLoading.value = true;
        
        // 필터링 로직
        filteredClubs.value = clubs.value.filter(club => {
          // 운동 종목 필터
          if (selectedSportTypes.value.length > 0 && !selectedSportTypes.value.includes(club.sportType)) {
            return false;
          }
          
          // 활동 지역 필터
          if (selectedMainAreas.value.length > 0) {
            const locationMatched = selectedMainAreas.value.some(area => {
              return club.mainArea.includes(area);
            });
            
            if (!locationMatched) {
              return false;
            }
          }
          
          // 실력 수준 필터
          if (selectedSportAbilities.value.length > 0) {
            // 선택된 실력 수준이 클럽의 실력 범위 내에 있는지 확인
            const hasMatchingAbility = selectedSportAbilities.value.some(ability => {
              // 클럽에 실력 범위가 설정되어 있는 경우
              if (club.sportAbilityMin && club.sportAbilityMax) {
                return ability >= club.sportAbilityMin && ability <= club.sportAbilityMax;
              }
              // 최소 실력만 설정된 경우
              else if (club.sportAbilityMin) {
                return ability >= club.sportAbilityMin;
              }
              // 최대 실력만 설정된 경우
              else if (club.sportAbilityMax) {
                return ability <= club.sportAbilityMax;
              }
              return false;
            });
            
            if (!hasMatchingAbility) {
              return false;
            }
          }
          
          return true;
        });
        
        // 정렬 적용
        sortClubs();
        
        // 첫 페이지로 이동
        currentPage.value = 1;
        
        // 로딩 상태 해제 (실제로는 API 호출 후 처리)
        setTimeout(() => {
          isLoading.value = false;
        }, 500);
      };
      
      // 필터 초기화
      const resetFilters = () => {
        selectedSportTypes.value = [];
        selectedMainAreas.value = [];
        selectedSportAbilities.value = [];
        sortOption.value = 'newest';
        
        // 필터 적용
        applyFilters();
      };
      
      // 페이지 이동 함수
      const goToPage = (page) => {
        currentPage.value = page;
        window.scrollTo(0, 0);
      };
      
      const goToPrevPage = () => {
        if (currentPage.value > 1) {
          currentPage.value--;
          window.scrollTo(0, 0);
        }
      };
      
      const goToNextPage = () => {
        if (currentPage.value < totalPages.value) {
          currentPage.value++;
          window.scrollTo(0, 0);
        }
      };
      
      const goToPrevPageSet = () => {
        if (currentPageSet.value > 1) {
          currentPage.value = (currentPageSet.value - 2) * pagesPerSet + 1;
          window.scrollTo(0, 0);
        }
      };
      
      const goToNextPageSet = () => {
        if (currentPageSet.value < totalPageSets.value) {
          currentPage.value = currentPageSet.value * pagesPerSet + 1;
          window.scrollTo(0, 0);
        }
      };
      
      // 클럽 목록 가져오기
      const fetchClubs = async () => {
        isLoading.value = true;
        
        try {
          // API 호출을 시뮬레이션 (실제 구현 시에는 아래 주석을 해제하고 사용)
          // const response = await fetch('/api/clubs');
          // const data = await response.json();
          
          // API 응답 시뮬레이션 (1초 지연)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 더미 데이터 생성 (60개의 클럽)
          const dummyClubs = [];
          const sportTypes = ['클라이밍', '러닝', '테니스', '축구', '요가', '배드민턴', '수영', '농구', '야구', '배구', '골프', '필라테스'];
          const mainAreas = ['서울시 강남구', '서울시 서초구', '서울시 송파구', '서울시 마포구', '서울시 용산구', '서울시 동작구', '서울시 영등포구', '서울시 강서구'];
          const activityLevels = ['active', 'moderate', 'inactive'];
          
          for (let i = 1; i <= 60; i++) {
            const sportIndex = Math.floor(Math.random() * sportTypes.length);
            const locationIndex = Math.floor(Math.random() * mainAreas.length);
            const activityLevelIndex = Math.floor(Math.random() * activityLevels.length);
            
            // 실력 수준 범위 설정
            const sportAbilityMin = Math.floor(Math.random() * 3) + 1; // 1~3
            const sportAbilityMax = Math.floor(Math.random() * 2) + sportAbilityMin; // min~min+2
            
            // 나이 범위 설정
            const ageLimitMin = [20, 30, 40][Math.floor(Math.random() * 3)];
            const ageLimitMax = ageLimitMin + [0, 10, 20][Math.floor(Math.random() * 3)];
            
            const members = Math.floor(Math.random() * 100) + 10;
            const like = Math.floor(Math.random() * 50) + 1; // 좋아요 수 추가
            
            // 이미지 URL 생성 - 실제 이미지가 로드되도록 수정
            const sportKeyword = sportTypes[sportIndex].toLowerCase();
            const imageUrl = `https://source.unsplash.com/featured/300x200?${sportKeyword},sports`;
            
            dummyClubs.push({
              id: i,
              name: `${mainAreas[locationIndex].split(' ')[1]} ${sportTypes[sportIndex]} 클럽 ${i}`,
              sportType: sportTypes[sportIndex],
              mainArea: mainAreas[locationIndex],
              sportAbilityMin: sportAbilityMin,
              sportAbilityMax: sportAbilityMax,
              ageLimitMin: ageLimitMin,
              ageLimitMax: ageLimitMax === ageLimitMin ? null : ageLimitMax,
              members: members,
              activityLevel: activityLevels[activityLevelIndex],
              image: imageUrl,
              like: like, // 좋아요 수 추가
              isLiked: false, // 좋아요 상태 추가
              createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
            });
          }
          
          clubs.value = dummyClubs;
          filteredClubs.value = [...clubs.value];
          
          // 정렬 적용
          sortClubs();
          
          // 인기 클럽 설정 (회원 수 기준으로 정렬하여 4개 선택)
          popularClubs.value = [...clubs.value]
            .sort((a, b) => b.members - a.members)
            .slice(0, 4);
          
          // 추천 클럽 설정 (임의로 4개 선택)
          recommendedClubs.value = [...clubs.value]
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
          
          console.log('클럽 목록을 성공적으로 가져왔습니다:', clubs.value);
        } catch (error) {
          console.error('클럽 목록을 가져오는 중 오류가 발생했습니다:', error);
          alert('클럽 목록을 불러오는데 실패했습니다. 다시 시도해주세요.');
        } finally {
          isLoading.value = false;
        }
      };
      
      onMounted(() => {
        // 클럽 목록 가져오기
        fetchClubs();
      });
      
      return {
        isLoading,
        clubs,
        filteredClubs,
        totalClubs,
        selectedSportTypes,
        selectedMainAreas,
        selectedSportAbilities,
        skillLevels,
        sortOption,
        currentPage,
        currentPageClubs,
        totalPages,
        currentPageSet,
        totalPageSets,
        pagesInCurrentSet,
        popularClubs,
        recommendedClubs,
        toggleSportAbility,
        applyFilters,
        resetFilters,
        goToPage,
        goToPrevPage,
        goToNextPage,
        goToPrevPageSet,
        goToNextPageSet,
        handleLike,
        goToCreateClub
      };
    }
  };
  </script>
  
  <style scoped>
  .club-finding-page {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding-bottom: 80px;
    position: relative; /* 플로팅 버튼을 위한 상대 위치 설정 */
  }
  
  /* 히어로 섹션 스타일 */
  .hero-section {
    position: relative;
    background-image: url('https://source.unsplash.com/featured/1600x500?sports,team,club');
    background-size: cover;
    background-position: center;
    height: 400px;
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
  
  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
  }
  
  .hero-title {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .hero-description {
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }
  
  .hero-subtitle {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  /* 필터 섹션 스타일 */
  .filter-section {
    margin-bottom: 2rem;
  }
  
  .filter-container {
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  .skill-level-selector .btn {
    border-radius: 2rem;
  }
  
  .skill-level-selector .btn.active {
    background-color: #37715D;
    border-color: #37715D;
    color: white;
  }
  
  /* 클럽 목록 스타일 */
  .search-info {
    margin-bottom: 1.5rem;
  }
  
  .sort-container {
    display: flex;
    align-items: center;
  }
  
  .sort-label {
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 0;
  }
  
  .club-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
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
  
  .empty-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
  
  /* 페이지네이션 스타일 */
  .pagination-container {
    margin-top: 2rem;
  }
  
  .pagination .page-link {
    color: #495057;
    border-color: #dee2e6;
  }
  
  .pagination .page-item.active .page-link {
    background-color: #37715D;
    border-color: #37715D;
    color: white;
  }
  
  .pagination .page-item.disabled .page-link {
    color: #adb5bd;
  }
  
  /* 인기 클럽 및 추천 클럽 섹션 */
  .popular-clubs-section, .recommended-clubs-section {
    padding: 3rem 0;
  }
  
  .section-header {
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
  
  .section-description {
    font-size: 1rem;
  }
  
  /* 클럽 생성 CTA 섹션 스타일 */
  .create-club-cta {
    padding: 4rem 0;
  }
  
  .cta-icon {
    font-size: 3rem;
    color: #37715D;
  }
  
  .cta-title {
    font-size: 1.75rem;
    color: #333;
  }
  
  .cta-description {
    font-size: 1rem;
    line-height: 1.6;
  }
  
  /* 플로팅 버튼 스타일 */
  .floating-create-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #37715D;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s ease;
  }
  
  .floating-create-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
    background-color: #2c5a4a;
  }
  
  /* 커스텀 색상 클래스 */
  .btn-custom-primary {
    background-color: #37715D;
    border-color: #37715D;
    color: white;
  }
  
  .btn-custom-primary:hover {
    background-color: #2c5a4a;
    border-color: #2c5a4a;
  }
  
  @media (max-width: 768px) {
    .club-list {
      grid-template-columns: 1fr;
    }
  
    .section-title {
      font-size: 1.5rem;
    }
    
    .hero-section {
      height: 300px;
    }
    
    .hero-actions {
      flex-direction: column;
      width: 100%;
    }
    
    .hero-actions .btn {
      width: 100%;
    }
    
    .floating-create-btn {
      width: 50px;
      height: 50px;
      font-size: 1.25rem;
      bottom: 1.5rem;
      right: 1.5rem;
    }
  }
  </style>