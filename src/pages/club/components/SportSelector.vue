<template>
    <div class="mb-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <label class="form-label fw-medium mb-0">{{ label }}<span v-if="required" class="text-danger ms-1">*</span>
          <button type="button" class="btn btn-icon" @click="openModal">
            <i class="bi bi-search fs-4"></i>
          </button>
        </label>
      </div>
      
      <div class="selected-items-container mb-2">
        <div v-if="modelValue.length === 0" class="text-muted small py-2">
          선택된 {{ label }}이 없습니다.
        </div>
        <div v-else class="selected-items d-flex flex-wrap gap-2">
          <span v-for="(sport, index) in modelValue" :key="index" class="selected-item badge bg-light text-dark border py-2 px-3 d-inline-flex align-items-center">
            {{ sport }}
            <button type="button" class="btn-close btn-close-sm ms-2" style="font-size: 0.65rem;" @click="removeSport(index)"></button>
          </span>
        </div>
      </div>
      
      <!-- 운동 종목 선택 모달 -->
      <div class="modal fade" :id="modalId" tabindex="-1" ref="modalRef">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ label }} 선택</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body p-0 d-flex flex-column">
              <!-- 종목 검색 -->
              <div class="sport-search-container p-3 border-bottom">
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="종목 검색" 
                    v-model="searchText"
                  >
                  <button class="btn btn-outline-custom-primary" type="button">
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </div>
              
              <!-- 종목 목록 - 스크롤 가능한 영역 -->
              <div class="sport-list-container">
                <div class="sport-list">
                  <div 
                    v-for="sport in filteredSports" 
                    :key="sport"
                    class="sport-item d-flex align-items-center p-3 border-bottom" 
                    :class="{'active': tempSelectedSports.includes(sport)}"
                    @click="toggleSport(sport)"
                  >
                    {{ sport }}
                  </div>
                  <div v-if="filteredSports.length === 0" class="p-3 text-center text-muted">
                    검색 결과가 없습니다.
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">취소</button>
              <button type="button" class="btn btn-custom-primary" @click="confirmSelection">
                선택 완료 ({{ tempSelectedSports.length }}개)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { Modal } from 'bootstrap';
  
  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: '운동 종목'
    },
    required: {
      type: Boolean,
      default: true
    },
    modalId: {
      type: String,
      default: 'sportModal'
    },
    sportsList: {
      type: Array,
      default: () => [
        '러닝', '클라이밍', '축구', '농구', '테니스', '요가', 
        '수영', '배드민턴', '골프', '등산', '사이클', '필라테스',
        '크로스핏', '웨이트 트레이닝', '복싱', '태권도', '스키', '스노보드',
        '볼링', '당구', '탁구', '야구', '족구', '배구', '승마',
        '스케이트보드', '서핑', '윈드서핑', '카약', '래프팅'
      ]
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const modalRef = ref(null);
  let modal = null;
  
  const searchText = ref('');
  const tempSelectedSports = ref([]);
  
  // 필터링된 종목 목록
  const filteredSports = computed(() => {
    if (!searchText.value) return props.sportsList;
    
    return props.sportsList.filter(sport => 
      sport.toLowerCase().includes(searchText.value.toLowerCase())
    );
  });
  
  // 컴포넌트 마운트 시 모달 초기화
  onMounted(() => {
    modal = new Modal(modalRef.value);
  });
  
  // 모달 열기
  const openModal = () => {
    tempSelectedSports.value = [...props.modelValue];
    searchText.value = '';
    modal.show();
  };
  
  // 모달 닫기
  const closeModal = () => {
    modal.hide();
  };
  
  // 종목 토글
  const toggleSport = (sport) => {
    const index = tempSelectedSports.value.indexOf(sport);
    if (index === -1) {
      tempSelectedSports.value.push(sport);
    } else {
      tempSelectedSports.value.splice(index, 1);
    }
  };
  
  // 종목 제거
  const removeSport = (index) => {
    const newSports = [...props.modelValue];
    newSports.splice(index, 1);
    emit('update:modelValue', newSports);
  };
  
  // 선택 완료
  const confirmSelection = () => {
    emit('update:modelValue', [...tempSelectedSports.value]);
    closeModal();
  };
  </script>
  
  <style scoped>
  .sport-list-container {
    overflow-y: auto;
    max-height: 300px;
    flex-grow: 1;
  }
  
  .sport-list {
    width: 100%;
  }
  
  .sport-item {
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .sport-item:hover {
    background-color: #f8f9fa;
  }
  
  .sport-item.active {
    background-color: #e9ecef;
    font-weight: 500;
  }
  
  .selected-item {
    font-weight: normal;
  }
  
  /* 모달 내부 스타일 */
  .modal-content {
    display: flex;
    flex-direction: column;
    height: 500px; /* 모달 높이 고정 */
  }
  
  .modal-body {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .modal-header, .modal-footer {
    flex-shrink: 0;
  }
  
  /* 커스텀 색상 클래스 */
  .btn-custom-primary {
    background-color: #37715D !important;
    border-color: #37715D !important;
    color: white !important;
  }
  
  .btn-outline-custom-primary {
    color: #37715D !important;
    border-color: #37715D !important;
  }
  
  .btn-outline-custom-primary:hover {
    background-color: #37715D !important;
    color: white !important;
  }
  </style>