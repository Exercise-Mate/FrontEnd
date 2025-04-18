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
        <div v-if="isEmpty" class="text-muted small py-2">
          선택된 {{ label }}이 없습니다.
        </div>
        <div v-else class="selected-items d-flex flex-wrap gap-2">
          <template v-if="multiple">
            <span v-for="(location, index) in modelValue" :key="index" class="selected-item badge bg-light text-dark border py-2 px-3 d-inline-flex align-items-center">
              {{ location }}
              <button type="button" class="btn-close btn-close-sm ms-2" style="font-size: 0.65rem;" @click="removeLocation(index)"></button>
            </span>
          </template>
          <template v-else>
            <span class="selected-item badge bg-light text-dark border py-2 px-3 d-inline-flex align-items-center">
              {{ modelValue }}
              <button type="button" class="btn-close btn-close-sm ms-2" style="font-size: 0.65rem;" @click="clearLocation"></button>
            </span>
          </template>
        </div>
      </div>
      <div v-if="helperText" class="form-text text-muted small">{{ helperText }}</div>
      
      <!-- 지역 선택 모달 -->
      <div class="modal fade" :id="modalId" tabindex="-1" ref="modalRef">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ label }} 선택</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <!-- 지역 검색 -->
              <div class="location-search-container mb-3">
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="지역명 검색 (예) 서울, 강남구" 
                    v-model="searchText"
                  >
                  <button class="btn btn-outline-custom-primary" type="button">
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </div>
              
              <!-- 선택된 지역 목록 (다중 선택인 경우만) -->
              <div v-if="multiple" class="selected-locations mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h6 class="mb-0 fw-medium">선택된 지역 ({{ tempLocations.length }}/{{ maxSelections }})</h6>
                </div>
                <div class="selected-items-container border rounded p-2">
                  <div v-if="tempLocations.length === 0" class="text-muted small p-2">
                    선택된 지역이 없습니다.
                  </div>
                  <div v-else class="selected-items d-flex flex-wrap gap-2 p-1">
                    <span v-for="(location, index) in tempLocations" :key="index" class="selected-item badge bg-light text-dark border py-2 px-3 d-inline-flex align-items-center">
                      {{ location }}
                      <button type="button" class="btn-close btn-close-sm ms-2" style="font-size: 0.65rem;" @click="removeLocationTemp(index)"></button>
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- 지역 선택 컨테이너 -->
              <div class="location-selection-container border rounded">
                <div class="row g-0">
                  <!-- 시/도 -->
                  <div class="col-4 border-end">
                    <div class="location-header">시/도</div>
                    <div class="location-list">
                      <div 
                        v-for="city in cities" 
                        :key="city"
                        class="location-item" 
                        :class="{'active': city === selectedCity}"
                        @click="selectCity(city)"
                      >
                        {{ city }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- 시/구/군 -->
                  <div class="col-8">
                    <div class="location-header">시/구/군</div>
                    <div class="location-list">
                      <div 
                        v-for="district in filteredDistricts" 
                        :key="district"
                        class="location-item" 
                        :class="{'active': district === selectedDistrict}"
                        @click="selectDistrict(district)"
                      >
                        {{ district }}
                      </div>
                      <div v-if="filteredDistricts.length === 0" class="p-3 text-center text-muted">
                        검색 결과가 없습니다.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 지역 추가 버튼 (다중 선택인 경우만) -->
              <div v-if="multiple" class="d-flex justify-content-end mt-3">
                <button 
                  type="button" 
                  class="btn btn-sm btn-custom-primary" 
                  @click="addLocation"
                  :disabled="!canAddLocation"
                >
                  <i class="bi bi-plus-circle me-1"></i> 지역 추가
                </button>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">취소</button>
              <button type="button" class="btn btn-custom-primary" @click="confirmSelection">선택 완료</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { Modal } from 'bootstrap';
  
  const props = defineProps({
    modelValue: {
      type: [String, Array],
      default: () => []
    },
    label: {
      type: String,
      default: '지역'
    },
    required: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    maxSelections: {
      type: Number,
      default: 4
    },
    modalId: {
      type: String,
      default: 'locationModal'
    },
    helperText: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const modalRef = ref(null);
  let modal = null;
  
  const searchText = ref('');
  const selectedCity = ref('서울');
  const selectedDistrict = ref('');
  const tempLocations = ref([]);
  const tempSingleLocation = ref({
    city: '',
    district: ''
  });
  
  // 계층적 지역 데이터
  const cities = ['서울', '경기', '인천', '강원', '대전', '세종', '충북', '충남', '부산', '울산', '경북', '경남', '대구', '광주', '전북', '전남', '제주'];
  const districtsByCity = {
    '서울': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', 
            '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', 
            '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
    '경기': ['고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', 
            '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '양평군', '여주시', '연천군', 
            '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'],
    '인천': ['계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '중구', '강화군', '옹진군'],
    // 다른 지역 데이터는 그대로 유지
  };
  
  // 필터링된 지역 목록
  const filteredDistricts = computed(() => {
    if (!selectedCity.value) return [];
    
    const districts = districtsByCity[selectedCity.value] || [];
    
    if (!searchText.value) return districts;
    
    return districts.filter(district => 
      district.toLowerCase().includes(searchText.value.toLowerCase())
    );
  });
  
  // 검색어에 따른 시/도 필터링
  watch(searchText, (newValue) => {
    if (newValue) {
      // 검색어가 시/도명과 일치하면 해당 시/도 선택
      const matchedCity = cities.find(city => 
        city.toLowerCase().includes(newValue.toLowerCase())
      );
      
      if (matchedCity) {
        selectedCity.value = matchedCity;
      }
    }
  });
  
  // 선택 가능 여부
  const canAddLocation = computed(() => {
    if (!selectedCity.value) return false;
    if (props.multiple && tempLocations.value.length >= props.maxSelections) return false;
    return true;
  });
  
  // 비어있는지 여부
  const isEmpty = computed(() => {
    if (props.multiple) {
      return !props.modelValue || props.modelValue.length === 0;
    } else {
      return !props.modelValue;
    }
  });
  
  // 컴포넌트 마운트 시 모달 초기화
  onMounted(() => {
    modal = new Modal(modalRef.value);
    
    // 초기값이 있으면 파싱 (단일 선택인 경우)
    if (!props.multiple && props.modelValue) {
      parseLocationText(props.modelValue);
    }
  });
  
  // 지역 텍스트 파싱
  const parseLocationText = (text) => {
    const parts = text.split(' ');
    if (parts.length >= 1) tempSingleLocation.value.city = parts[0];
    if (parts.length >= 2) tempSingleLocation.value.district = parts[1];
    
    selectedCity.value = tempSingleLocation.value.city || '서울';
    selectedDistrict.value = tempSingleLocation.value.district || '';
  };
  
  // 모달 열기
  const openModal = () => {
    if (props.multiple) {
      // 다중 선택인 경우
      tempLocations.value = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    } else {
      // 단일 선택인 경우
      tempSingleLocation.value = {
        city: selectedCity.value,
        district: selectedDistrict.value
      };
    }
    
    searchText.value = '';
    modal.show();
  };
  
  // 모달 닫기
  const closeModal = () => {
    modal.hide();
  };
  
  // 지역 선택 함수
  const selectCity = (city) => {
    selectedCity.value = city;
    selectedDistrict.value = '';
  };
  
  const selectDistrict = (district) => {
    selectedDistrict.value = district;
    
    // 단일 선택인 경우 자동으로 선택
    if (!props.multiple) {
      let locationText = '';
      
      if (selectedCity.value) {
        locationText += selectedCity.value;
        
        if (selectedDistrict.value) {
          locationText += ' ' + selectedDistrict.value;
        }
      }
      
      tempSingleLocation.value = {
        city: selectedCity.value,
        district: selectedDistrict.value
      };
    }
  };
  
  // 지역 추가 (다중 선택인 경우)
  const addLocation = () => {
    if (!selectedCity.value) return;
    
    let locationText = selectedCity.value;
    
    if (selectedDistrict.value) {
      locationText += ' ' + selectedDistrict.value;
    }
    
    // 이미 선택된 지역인지 확인
    if (tempLocations.value.includes(locationText)) {
      alert('이미 선택된 지역입니다.');
      return;
    }
    
    // 최대 선택 개수 확인
    if (tempLocations.value.length >= props.maxSelections) {
      alert(`${props.label}은 최대 ${props.maxSelections}개까지 선택 가능합니다.`);
      return;
    }
    
    tempLocations.value.push(locationText);
    
    // 선택 후 초기화
    selectedDistrict.value = '';
  };
  
  // 지역 제거 (다중 선택 모달 내에서)
  const removeLocationTemp = (index) => {
    tempLocations.value.splice(index, 1);
  };
  
  // 지역 제거 (메인 화면에서)
  const removeLocation = (index) => {
    if (props.multiple) {
      const newLocations = [...props.modelValue];
      newLocations.splice(index, 1);
      emit('update:modelValue', newLocations);
    }
  };
  
  // 지역 선택 초기화 (단일 선택인 경우)
  const clearLocation = () => {
    if (!props.multiple) {
      emit('update:modelValue', '');
      selectedCity.value = '서울';
      selectedDistrict.value = '';
    }
  };
  
  // 선택 완료
  const confirmSelection = () => {
    if (props.multiple) {
      // 다중 선택인 경우
      emit('update:modelValue', [...tempLocations.value]);
    } else {
      // 단일 선택인 경우
      let locationText = '';
      
      if (selectedCity.value) {
        locationText += selectedCity.value;
        
        if (selectedDistrict.value) {
          locationText += ' ' + selectedDistrict.value;
        }
      }
      
      emit('update:modelValue', locationText);
    }
    
    closeModal();
  };
  </script>
  
  <style scoped>
  .location-header {
    font-weight: 600;
    padding: 10px 15px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
  }
  
  .location-list {
    overflow-y: auto;
    max-height: 250px;
  }
  
  .location-item {
    padding: 10px 15px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .location-item:hover {
    background-color: #f8f9fa;
  }
  
  .location-item.active {
    background-color: #e9ecef;
    font-weight: 500;
  }
  </style>