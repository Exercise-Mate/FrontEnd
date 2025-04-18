<template>
    <div class="club-manage-page">
      <div class="container-fluid px-0">
        <!-- 상단 네비게이션 -->
        <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="#">
              <i class="bi bi-people-fill custom-primary me-2 fs-4"></i>
              <span class="fw-bold">클럽 관리</span>
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
  
        <!-- 메인 컨텐츠 -->
        <div class="container py-4">
          <!-- 탭 네비게이션 -->
          <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
              <a class="nav-link" :class="{ 'active': activeTab === 'join-requests' }" href="#"
                @click.prevent="setActiveTab('join-requests')">
                <i class="bi bi-person-plus me-1"></i> 클럽 가입 요청
                <span v-if="joinRequests.length > 0" class="badge bg-custom-primary ms-1">{{ joinRequests.length }}</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ 'active': activeTab === 'members' }" href="#"
                @click.prevent="setActiveTab('members')">
                <i class="bi bi-people me-1"></i> 클럽원 관리
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ 'active': activeTab === 'edit' }" href="#"
                @click.prevent="setActiveTab('edit')">
                <i class="bi bi-pencil-square me-1"></i> 클럽 정보 수정
              </a>
            </li>
          </ul>
  
          <!-- 탭 컨텐츠 -->
          <div class="tab-content">
            <!-- 클럽 가입 요청 탭 -->
            <div v-if="activeTab === 'join-requests'" class="tab-pane fade show active">
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-body p-4">
                  <h5 class="fw-bold mb-3 d-flex align-items-center">
                    <i class="bi bi-person-plus custom-primary me-2"></i>
                    클럽 가입 요청
                  </h5>
  
                  <div v-if="isLoading" class="text-center py-4">
                    <div class="spinner-border text-custom-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3">가입 요청을 불러오는 중...</p>
                  </div>
  
                  <div v-else-if="joinRequests.length === 0" class="text-center py-4">
                    <div class="empty-state">
                      <i class="bi bi-inbox fs-1 text-muted mb-3"></i>
                      <h5>가입 요청이 없습니다</h5>
                      <p class="text-muted">새로운 가입 요청이 들어오면 이곳에 표시됩니다.</p>
                    </div>
                  </div>
  
                  <div v-else>
                    <!-- 가입 요청 목록 -->
                    <div v-for="(request, index) in joinRequests" :key="request.id"
                      class="join-request-item p-3 mb-3 border rounded">
                      <div class="d-flex align-items-start">
                        <div class="user-avatar me-3">
                          <i class="bi bi-person-circle fs-1 text-secondary"></i>
                        </div>
                        <div class="flex-grow-1">
                          <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="mb-0 fw-bold">{{ request.name }}</h5>
                            <div class="request-date text-muted small">{{ request.requestDate }}</div>
                          </div>
  
                          <div class="user-info mb-3">
                            <div class="row g-2">
                              <div class="col-md-3">
                                <div class="info-item">
                                  <span class="info-label text-muted">운동 실력:</span>
                                  <span class="info-value">{{ request.sport_ability }}</span>
                                </div>
                              </div>
                              <div class="col-md-3">
                                <div class="info-item">
                                  <span class="info-label text-muted">성별:</span>
                                  <span class="info-value">{{ request.is_male ? '남자' : '여자' }}</span>
                                </div>
                              </div>
                              <div class="col-md-3">
                                <div class="info-item">
                                  <span class="info-label text-muted">나이:</span>
                                  <span class="info-value">{{ request.age }}세</span>
                                </div>
                              </div>
                            </div>
                          </div>
  
                          <div class="join-questions mb-3">
                            <h6 class="fw-bold mb-2">가입 질문 답변</h6>
                            <div v-for="(answer, i) in request.introduction" :key="i" class="question-answer mb-2">
                              <div class="question text-muted small">{{ joinQuestions[i] }}</div>
                              <div class="answer">{{ answer }}</div>
                            </div>
                          </div>
  
                          <div class="club-position mb-3">
                            <h6 class="fw-bold mb-2">클럽 직급 설정</h6>
                            <div class="btn-group" role="group">
                              <input type="radio" class="btn-check" :id="`position-member-${index}`"
                                v-model="request.position" value="클럽원">
                              <label class="btn btn-outline-custom-primary" :for="`position-member-${index}`">클럽원</label>
  
                              <input type="radio" class="btn-check" :id="`position-manager-${index}`"
                                v-model="request.position" value="매니저">
                              <label class="btn btn-outline-custom-primary" :for="`position-manager-${index}`">매니저</label>
  
                              <input type="radio" class="btn-check" :id="`position-submaster-${index}`"
                                v-model="request.position" value="부클럽장">
                              <label class="btn btn-outline-custom-primary" :for="`position-submaster-${index}`">부클럽장</label>
                            </div>
                          </div>
  
                          <div class="action-buttons">
                            <button class="btn btn-custom-primary me-2" @click="approveRequest(request.id)">
                              <i class="bi bi-check-lg me-1"></i> 승인
                            </button>
                            <button class="btn btn-outline-danger" @click="rejectRequest(request.id)">
                              <i class="bi bi-x-lg me-1"></i> 거절
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- 클럽원 관리 탭 -->
            <div v-if="activeTab === 'members'" class="tab-pane fade show active">
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-body p-4">
                  <h5 class="fw-bold mb-3 d-flex align-items-center">
                    <i class="bi bi-people custom-primary me-2"></i>
                    클럽원 관리
                  </h5>
  
                  <div v-if="isLoading" class="text-center py-4">
                    <div class="spinner-border text-custom-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3">클럽원 목록을 불러오는 중...</p>
                  </div>
  
                  <div v-else>
                    <!-- 검색 및 필터링 -->
                    <div class="search-filter mb-4">
                      <div class="row g-2">
                        <div class="col-md-6">
                          <div class="input-group">
                            <span class="input-group-text bg-white">
                              <i class="bi bi-search"></i>
                            </span>
                            <input type="text" class="form-control" placeholder="이름으로 검색"
                              v-model="memberSearchQuery">
                          </div>
                        </div>
                        <div class="col-md-3">
                          <select class="form-select" v-model="memberPositionFilter">
                            <option value="">모든 직급</option>
                            <option value="클럽장">클럽장</option>
                            <option value="부클럽장">부클럽장</option>
                            <option value="매니저">매니저</option>
                            <option value="클럽원">클럽원</option>
                          </select>
                        </div>
                        <div class="col-md-3">
                          <select class="form-select" v-model="memberSortOption">
                            <option value="name">이름순</option>
                            <option value="joinDate">가입일순</option>
                            <option value="position">직급순</option>
                          </select>
                        </div>
                      </div>
                    </div>
  
                    <!-- 클럽원 목록 테이블 -->
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <thead class="table-light">
                          <tr>
                            <th>이름</th>
                            <th>운동 실력</th>
                            <th>성별</th>
                            <th>나이</th>
                            <th>가입 날짜</th>
                            <th>직급</th>
                            <th>관리</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="member in filteredMembers" :key="member.id">
                            <td class="align-middle">
                              <div class="d-flex align-items-center">
                                <i class="bi bi-person-circle fs-4 me-2 text-secondary"></i>
                                {{ member.name }}
                              </div>
                            </td>
                            <td class="align-middle">{{ member.sport_ability }}</td>
                            <td class="align-middle">{{ member.is_male ? '남자' : '여자' }}</td>
                            <td class="align-middle">{{ member.age }}세</td>
                            <td class="align-middle">{{ member.joinDate }}</td>
                            <td class="align-middle">
                              <span class="position-badge" :class="getPositionClass(member.position)">
                                {{ member.position }}
                              </span>
                            </td>
                            <td class="align-middle">
                              <button class="btn btn-sm btn-outline-secondary" @click="openManageModal(member)">
                                관리
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
  
                    <!-- 페이지네이션 -->
                    <nav v-if="totalMemberPages > 1" class="mt-4">
                      <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ 'disabled': currentMemberPage === 1 }">
                          <a class="page-link" href="#" @click.prevent="currentMemberPage--">
                            <i class="bi bi-chevron-left"></i>
                          </a>
                        </li>
                        <li v-for="page in totalMemberPages" :key="page" class="page-item"
                          :class="{ 'active': currentMemberPage === page }">
                          <a class="page-link" href="#" @click.prevent="currentMemberPage = page">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ 'disabled': currentMemberPage === totalMemberPages }">
                          <a class="page-link" href="#" @click.prevent="currentMemberPage++">
                            <i class="bi bi-chevron-right"></i>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- 클럽 정보 수정 탭 -->
            <div v-if="activeTab === 'edit'" class="tab-pane fade show active">
              <club-edit-form :clubId="clubId" />
            </div>
          </div>
        </div>
      </div>
  
      <!-- 멤버 관리 모달 -->
      <div class="modal fade" id="manageMemberModal" tabindex="-1" aria-labelledby="manageMemberModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="manageMemberModalLabel">클럽원 관리</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="text-center mb-4">
                <div class="member-avatar mb-3">
                  <i class="bi bi-person-circle fs-1 text-secondary"></i>
                </div>
                <h5 class="fw-bold mb-1">{{ selectedMember?.name }}</h5>
                <p class="text-muted mb-0">{{ selectedMember?.position }} · {{ selectedMember?.joinDate }} 가입</p>
              </div>
  
              <div class="member-info mb-4">
                <div class="row g-3">
                  <div class="col-md-4">
                    <div class="info-card p-2 text-center border rounded">
                      <div class="info-label text-muted small">운동 실력</div>
                      <div class="info-value fw-medium">{{ selectedMember?.sport_ability }}</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="info-card p-2 text-center border rounded">
                      <div class="info-label text-muted small">성별</div>
                      <div class="info-value fw-medium">{{ selectedMember?.is_male ? '남자' : '여자' }}</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="info-card p-2 text-center border rounded">
                      <div class="info-label text-muted small">나이</div>
                      <div class="info-value fw-medium">{{ selectedMember?.age }}세</div>
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="management-options">
                <div class="mb-4">
                  <h6 class="fw-bold mb-2">직급 변경</h6>
                  <div class="position-select">
                    <select class="form-select" v-model="newPosition">
                      <option value="클럽장">클럽장</option>
                      <option value="부클럽장">부클럽장</option>
                      <option value="매니저">매니저</option>
                      <option value="클럽원">클럽원</option>
                    </select>
                    <div class="form-text text-danger" v-if="newPosition === '클럽장'">
                      주의: 클럽장으로 변경 시 현재 클럽장은 부클럽장으로 변경됩니다.
                    </div>
                    <button class="btn btn-custom-primary w-100 mt-2" @click="changePosition">
                      직급 변경하기
                    </button>
                  </div>
                </div>
  
                <div>
                  <h6 class="fw-bold mb-2 text-danger">클럽에서 내보내기</h6>
                  <p class="text-muted small mb-2">
                    클럽원을 내보내면 더 이상 클럽 활동에 참여할 수 없습니다. 이 작업은 되돌릴 수 없습니다.
                  </p>
                  <button class="btn btn-outline-danger w-100" @click="confirmRemoveMember">
                    <i class="bi bi-person-x me-1"></i> 클럽에서 내보내기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 직급 변경 모달 -->
      <div class="modal fade" id="changePositionModal" tabindex="-1" aria-labelledby="changePositionModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="changePositionModalLabel">직급 변경</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p><strong>{{ selectedMember?.name }}</strong>님의 직급을 변경합니다.</p>
              <div class="form-group">
                <label class="form-label">새 직급</label>
                <select class="form-select" v-model="newPosition">
                  <option value="클럽장">클럽장</option>
                  <option value="부클럽장">부클럽장</option>
                  <option value="매니저">매니저</option>
                  <option value="클럽원">클럽원</option>
                </select>
                <div class="form-text text-danger" v-if="newPosition === '클럽장'">
                  주의: 클럽장으로 변경 시 현재 클럽장은 부클럽장으로 변경됩니다.
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">취소</button>
              <button type="button" class="btn btn-custom-primary" @click="changePosition">변경하기</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 클럽원 내보내기 모달 -->
      <div class="modal fade" id="removeMemberModal" tabindex="-1" aria-labelledby="removeMemberModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="removeMemberModalLabel">클럽원 내보내기</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="text-center mb-3">
                <i class="bi bi-exclamation-triangle-fill text-warning fs-1"></i>
              </div>
              <p class="text-center">
                <strong>{{ selectedMember?.name }}</strong>님을 클럽에서 내보내시겠습니까?<br>
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">취소</button>
              <button type="button" class="btn btn-danger" @click="removeMember">내보내기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import ClubEditForm from './components/ClubEditForm.vue';
  import * as bootstrap from 'bootstrap';
  
  export default {
    components: {
      ClubEditForm
    },
    setup() {
      const router = useRouter();
      const route = useRoute();
      const clubId = ref(null);
      const activeTab = ref('join-requests');
      const isLoading = ref(true);
  
      // 모달 관련 상태
      const manageMemberModal = ref(null);
      const changePositionModal = ref(null);
      const removeMemberModal = ref(null);
      const selectedMember = ref(null);
      const newPosition = ref('클럽원');
  
      // 클럽 가입 요청 관련 상태
      const joinRequests = ref([]);
      const joinQuestions = ref([
        '소주 몇병 마시나요?',
        '금요일에 맨날 마시나요?'
      ]);
  
      // 클럽원 관리 관련 상태
      const members = ref([]);
      const memberSearchQuery = ref('');
      const memberPositionFilter = ref('');
      const memberSortOption = ref('name');
      const currentMemberPage = ref(1);
      const membersPerPage = 10;
  
      // 라우트 파라미터에서 클럽 ID 가져오기
      clubId.value = route.params.id;
  
      // 탭 변경 함수
      const setActiveTab = (tabName) => {
        activeTab.value = tabName;
      };
  
      // 필터링된 클럽원 목록
      const filteredMembers = computed(() => {
        let result = [...members.value];
  
        // 검색어 필터링
        if (memberSearchQuery.value) {
          const query = memberSearchQuery.value.toLowerCase();
          result = result.filter(member => member.name.toLowerCase().includes(query));
        }
  
        // 직급 필터링
        if (memberPositionFilter.value) {
          result = result.filter(member => member.position === memberPositionFilter.value);
        }
  
        // 정렬
        switch (memberSortOption.value) {
          case 'name':
            result.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'joinDate':
            result.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
            break;
          case 'position':
            const positionOrder = { '클럽장': 1, '부클럽장': 2, '매니저': 3, '클럽원': 4 };
            result.sort((a, b) => positionOrder[a.position] - positionOrder[b.position]);
            break;
        }
  
        // 페이지네이션
        const startIndex = (currentMemberPage.value - 1) * membersPerPage;
        const endIndex = startIndex + membersPerPage;
        return result.slice(startIndex, endIndex);
      });
  
      // 총 페이지 수
      const totalMemberPages = computed(() => {
        return Math.ceil(members.value.length / membersPerPage);
      });
  
      // 직급에 따른 클래스 반환
      const getPositionClass = (position) => {
        switch (position) {
          case '클럽장':
            return 'position-master';
          case '부클럽장':
            return 'position-submaster';
          case '매니저':
            return 'position-manager';
          default:
            return 'position-member';
        }
      };
  
      // 가입 요청 데이터 가져오기
      const fetchJoinRequests = async () => {
        isLoading.value = true;
  
        try {
          // 실제 구현에서는 API 호출
          // const response = await fetch(`/api/clubs/${clubId.value}/join-requests`);
          // const data = await response.json();
  
          // API 호출 시뮬레이션 (1초 지연)
          await new Promise(resolve => setTimeout(resolve, 1000));
  
          // 더미 데이터 (실제 구현에서는 API 응답 데이터 사용)
          const dummyJoinRequests = [
            {
              id: 1,
              name: '고대호',
              sport_ability: '상급',
              is_male: true,
              age: 28,
              introduction: ['3잔이요.', '네 매주 마셔요.'],
              position: '클럽원',
              requestDate: '2024-04-15'
            },
            {
              id: 2,
              name: '김민지',
              sport_ability: '중급',
              is_male: false,
              age: 25,
              introduction: ['1병이요.', '가끔 마셔요.'],
              position: '클럽원',
              requestDate: '2024-04-16'
            },
            {
              id: 3,
              name: '박준영',
              sport_ability: '초급',
              is_male: true,
              age: 32,
              introduction: ['2병이요.', '네 매주 마셔요.'],
              position: '클럽원',
              requestDate: '2024-04-17'
            }
          ];
  
          joinRequests.value = dummyJoinRequests;
          console.log('가입 요청을 성공적으로 가져왔습니다:', joinRequests.value);
        } catch (error) {
          console.error('가입 요청을 가져오는 중 오류가 발생했습니다:', error);
          alert('가입 요청을 불러오는데 실패했습니다. 다시 시도해주세요.');
        } finally {
          isLoading.value = false;
        }
      };
  
      // 클럽원 데이터 가져오기
      const fetchMembers = async () => {
        isLoading.value = true;
  
        try {
          // 실제 구현에서는 API 호출
          // const response = await fetch(`/api/clubs/${clubId.value}/members`);
          // const data = await response.json();
  
          // API 호출 시뮬레이션 (1초 지연)
          await new Promise(resolve => setTimeout(resolve, 1000));
  
          // 더미 데이터 (실제 구현에서는 API 응답 데이터 사용)
          const dummyMembers = [
            {
              id: 1,
              name: '이승우',
              sport_ability: '상급',
              is_male: true,
              age: 35,
              joinDate: '2024-01-10',
              position: '클럽장'
            },
            {
              id: 2,
              name: '김지연',
              sport_ability: '중급',
              is_male: false,
              age: 29,
              joinDate: '2024-01-15',
              position: '부클럽장'
            },
            {
              id: 3,
              name: '박민수',
              sport_ability: '상급',
              is_male: true,
              age: 32,
              joinDate: '2024-01-20',
              position: '매니저'
            },
            {
              id: 4,
              name: '정다은',
              sport_ability: '초급',
              is_male: false,
              age: 27,
              joinDate: '2024-02-05',
              position: '클럽원'
            },
            {
              id: 5,
              name: '최준호',
              sport_ability: '중급',
              is_male: true,
              age: 31,
              joinDate: '2024-02-10',
              position: '클럽원'
            },
            {
              id: 6,
              name: '한소영',
              sport_ability: '초급',
              is_male: false,
              age: 26,
              joinDate: '2024-02-15',
              position: '클럽원'
            },
            {
              id: 7,
              name: '강민준',
              sport_ability: '상급',
              is_male: true,
              age: 33,
              joinDate: '2024-02-20',
              position: '클럽원'
            },
            {
              id: 8,
              name: '윤서연',
              sport_ability: '중급',
              is_male: false,
              age: 28,
              joinDate: '2024-03-01',
              position: '클럽원'
            },
            {
              id: 9,
              name: '임재현',
              sport_ability: '초급',
              is_male: true,
              age: 30,
              joinDate: '2024-03-05',
              position: '클럽원'
            },
            {
              id: 10,
              name: '송지원',
              sport_ability: '중급',
              is_male: false,
              age: 25,
              joinDate: '2024-03-10',
              position: '클럽원'
            },
            {
              id: 11,
              name: '오민석',
              sport_ability: '상급',
              is_male: true,
              age: 34,
              joinDate: '2024-03-15',
              position: '클럽원'
            },
            {
              id: 12,
              name: '황수진',
              sport_ability: '중급',
              is_male: false,
              age: 29,
              joinDate: '2024-03-20',
              position: '클럽원'
            }
          ];
  
          members.value = dummyMembers;
          console.log('클럽원 목록을 성공적으로 가져왔습니다:', members.value);
        } catch (error) {
          console.error('클럽원 목록을 가져오는 중 오류가 발생했습니다:', error);
          alert('클럽원 목록을 불러오는데 실패했습니다. 다시 시도해주세요.');
        } finally {
          isLoading.value = false;
        }
      };
  
      // 가입 요청 승인
      const approveRequest = async (requestId) => {
        try {
          // 실제 구현에서는 API 호출
          // await fetch(`/api/clubs/${clubId.value}/join-requests/${requestId}/approve`, {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({
          //     position: joinRequests.value.find(req => req.id === requestId).position
          //   }),
          // });
  
          console.log(`가입 요청 ID ${requestId} 승인 처리`);
  
          // 승인된 요청 제거
          joinRequests.value = joinRequests.value.filter(req => req.id !== requestId);
  
          // 클럽원 목록 새로고침
          fetchMembers();
  
          alert('가입 요청이 승인되었습니다.');
        } catch (error) {
          console.error('가입 요청 승인 중 오류가 발생했습니다:', error);
          alert('가입 요청 승인에 실패했습니다. 다시 시도해주세요.');
        }
      };
  
      // 가입 요청 거절
      const rejectRequest = async (requestId) => {
        try {
          // 실제 구현에서는 API 호출
          // await fetch(`/api/clubs/${clubId.value}/join-requests/${requestId}/reject`, {
          //   method: 'POST'
          // });
  
          console.log(`가입 요청 ID ${requestId} 거절 처리`);
  
          // 거절된 요청 제거
          joinRequests.value = joinRequests.value.filter(req => req.id !== requestId);
  
          alert('가입 요청이 거절되었습니다.');
        } catch (error) {
          console.error('가입 요청 거절 중 오류가 발생했습니다:', error);
          alert('가입 요청 거절에 실패했습니다. 다시 시도해주세요.');
        }
      };
  
      // 멤버 관리 모달 열기
      const openManageModal = (member) => {
        selectedMember.value = member;
        newPosition.value = member.position;
  
        if (manageMemberModal.value) {
          manageMemberModal.value.show();
        }
      };
  
      // 내보내기 확인 함수 추가
      const confirmRemoveMember = () => {
        if (manageMemberModal.value) {
          manageMemberModal.value.hide();
        }
  
        // 잠시 후 삭제 확인 모달 표시
        setTimeout(() => {
          if (removeMemberModal.value) {
            removeMemberModal.value.show();
          }
        }, 500);
      };
  
      // 직급 변경 모달 열기
      // const openChangePositionModal = (member) => {
      //   selectedMember.value = member;
      //   newPosition.value = member.position;
  
      //   if (changePositionModal.value) {
      //     changePositionModal.value.show();
      //   }
      // };
  
      // 클럽원 내보내기 모달 열기
      const openRemoveMemberModal = (member) => {
        selectedMember.value = member;
  
        if (removeMemberModal.value) {
          removeMemberModal.value.show();
        }
      };
  
      // 직급 변경
      const changePosition = async () => {
        if (!selectedMember.value) return;
  
        try {
          // 실제 구현에서는 API 호출
          // await fetch(`/api/clubs/${clubId.value}/members/${selectedMember.value.id}/position`, {
          //   method: 'PUT',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({
          //     position: newPosition.value
          //   }),
          // });
  
          console.log(`클럽원 ID ${selectedMember.value.id}의 직급을 ${newPosition.value}로 변경`);
  
          // 클럽장으로 변경 시 기존 클럽장 처리
          if (newPosition.value === '클럽장') {
            const currentMaster = members.value.find(m => m.position === '클럽장');
            if (currentMaster && currentMaster.id !== selectedMember.value.id) {
              currentMaster.position = '부클럽장';
            }
          }
  
          // 선택된 클럽원의 직급 변경
          selectedMember.value.position = newPosition.value;
  
          // 모달 닫기
          if (manageMemberModal.value) {
            manageMemberModal.value.hide();
          }
  
          alert('직급이 변경되었습니다.');
        } catch (error) {
          console.error('직급 변경 중 오류가 발생했습니다:', error);
          alert('직급 변경에 실패했습니다. 다시 시도해주세요.');
        }
      };
  
      // 클럽원 내보내기
      const removeMember = async () => {
        if (!selectedMember.value) return;
  
        try {
          // 실제 구현에서는 API 호출
          // await fetch(`/api/clubs/${clubId.value}/members/${selectedMember.value.id}`, {
          //   method: 'DELETE'
          // });
  
          console.log(`클럽원 ID ${selectedMember.value.id} 내보내기 처리`);
  
          // 내보낸 클럽원 제거
          members.value = members.value.filter(m => m.id !== selectedMember.value.id);
  
          // 모달 닫기
          if (removeMemberModal.value) {
            removeMemberModal.value.hide();
          }
  
          alert('클럽원이 내보내기 되었습니다.');
        } catch (error) {
          console.error('클럽원 내보내기 중 오류가 발생했습니다:', error);
          alert('클럽원 내보내기에 실패했습니다. 다시 시도해주세요.');
        }
      };
  
      // 뒤로가기
      const goBack = () => {
        router.go(-1);
      };
  
      // 페이지 변경 시 데이터 새로고침
      watch(activeTab, (newTab) => {
        if (newTab === 'join-requests') {
          fetchJoinRequests();
        } else if (newTab === 'members') {
          fetchMembers();
        }
      });
  
      // 검색어 변경 시 페이지 초기화
      watch(memberSearchQuery, () => {
        currentMemberPage.value = 1;
      });
  
      // 직급 필터 변경 시 페이지 초기화
      watch(memberPositionFilter, () => {
        currentMemberPage.value = 1;
      });
  
      onMounted(() => {
        // 클럽 ID가 없으면 목록 페이지로 리다이렉트
        if (!clubId.value) {
          router.push('/');
          return;
        }
  
        // Bootstrap 모달 초기화
        const manageMemberModalEl = document.getElementById('manageMemberModal');
        if (manageMemberModalEl && typeof bootstrap !== 'undefined') {
          manageMemberModal.value = new bootstrap.Modal(manageMemberModalEl);
        }
  
        const changePositionModalEl = document.getElementById('changePositionModal');
        if (changePositionModalEl && typeof bootstrap !== 'undefined') {
          changePositionModal.value = new bootstrap.Modal(changePositionModalEl);
        }
  
        const removeMemberModalEl = document.getElementById('removeMemberModal');
        if (removeMemberModalEl && typeof bootstrap !== 'undefined') {
          removeMemberModal.value = new bootstrap.Modal(removeMemberModalEl);
        }
  
        // 초기 데이터 로드
        fetchJoinRequests();
      });
  
      return {
        clubId,
        activeTab,
        isLoading,
        joinRequests,
        joinQuestions,
        members,
        memberSearchQuery,
        memberPositionFilter,
        memberSortOption,
        currentMemberPage,
        totalMemberPages,
        filteredMembers,
        selectedMember,
        newPosition,
        setActiveTab,
        getPositionClass,
        approveRequest,
        rejectRequest,
        openManageModal,
        confirmRemoveMember,
        openRemoveMemberModal,
        changePosition,
        removeMember,
        goBack
      };
    }
  };
  </script>
  
  <style scoped>
  .custom-primary {
    color: #37715D !important;
  }
  
  .bg-custom-primary {
    background-color: #37715D !important;
  }
  
  .btn-custom-primary {
    background-color: #37715D !important;
    border-color: #37715D !important;
    color: white !important;
  }
  
  .btn-custom-primary:hover {
    background-color: #2c5a4a !important;
    border-color: #2c5a4a !important;
  }
  
  .btn-outline-custom-primary {
    color: #37715D !important;
    border-color: #37715D !important;
  }
  
  .btn-outline-custom-primary:hover {
    background-color: #37715D !important;
    color: white !important;
  }
  
  .btn-check:checked+.btn-outline-custom-primary {
    background-color: #37715D !important;
    color: white !important;
  }
  
  .navbar {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  
  .navbar-brand {
    font-size: 1.25rem;
  }
  
  .nav-tabs .nav-link {
    color: #495057;
    border: none;
    padding: 0.75rem 1rem;
    border-bottom: 2px solid transparent;
  }
  
  .nav-tabs .nav-link.active {
    color: #37715D;
    background-color: transparent;
    border-bottom: 2px solid #37715D;
    font-weight: 600;
  }
  
  .nav-tabs .nav-link:hover:not(.active) {
    border-bottom: 2px solid #dee2e6;
  }
  
  .badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
  }
  
  .join-request-item {
    background-color: #f8f9fa;
    transition: all 0.2s ease;
  }
  
  .join-request-item:hover {
    background-color: #f1f3f5;
  }
  
  .info-label {
    display: inline-block;
    min-width: 80px;
  }
  
  .question {
    font-weight: 500;
  }
  
  .answer {
    padding: 0.5rem;
    background-color: white;
    border-radius: 0.25rem;
    border: 1px solid #dee2e6;
  }
  
  .position-badge {
    display: inline-block;
    padding: 0.25em 0.6em;
    font-size: 0.75em;
    font-weight: 600;
    border-radius: 0.25rem;
  }
  
  .position-master {
    background-color: #dc3545;
    color: white;
  }
  
  .position-submaster {
    background-color: #fd7e14;
    color: white;
  }
  
  .position-manager {
    background-color: #198754;
    color: white;
  }
  
  .position-member {
    background-color: #6c757d;
    color: white;
  }
  
  .empty-state {
    padding: 2rem;
    text-align: center;
  }
  
  .table th {
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    .join-request-item {
      padding: 1rem;
    }
  
    .info-item {
      margin-bottom: 0.5rem;
    }
  
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  
    .action-buttons .btn {
      width: 100%;
    }
  }
  </style>