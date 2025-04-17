<template>
    <div class="container">
        <section class="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
            <div class="card-body">
                <div class="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3">
                    <i class="ai-user text-primary lead pe-1 me-2"></i>
                    <h2 class="h4 mb-0">개인 정보 수정</h2>
                </div>

                <div class="d-flex align-items-center">
                    <div class="dropdown">
                        <a class="d-flex flex-column justify-content-end position-relative overflow-hidden rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                            href="#" data-bs-toggle="dropdown" aria-expanded="false"
                            :style="`width: 120px; height: 120px; background-image: url(${member.imgUrl});`">
                            <span class="d-block text-light text-center lh-1 pb-1"
                                style="background-color: rgba(0,0,0,.5)">
                                <i class="ai-camera"></i>
                            </span>
                        </a>
                        <div class="dropdown-menu my-1">
                            <a class="dropdown-item fw-normal" href="#"><i
                                    class="ai-camera fs-base opacity-70 me-2"></i>앨범에서 사진 선택</a>
                            <a class="dropdown-item text-danger fw-normal" href="#"><i
                                    class="ai-trash fs-base me-2"></i>기본 이미지 적용</a>
                        </div>
                    </div>
                    <div class="ps-3">
                        <h3 class="h6 mb-1">별명</h3>
                        <input class="form-control" type="text" v-model="member.nickname" id="nickname">
                    </div>
                </div>

                <div class="row g-3 g-sm-4 mt-0 mt-lg-2">
                    <div class="col-sm-6">
                        <label class="form-label">이름</label>
                        <input class="form-control" type="text" :value="member.name" disabled>
                    </div>
                    <div class="col-sm-6">
                        <label class="form-label">생년월일</label>
                        <input class="form-control" type="text" :value="member.birth" disabled>
                    </div>
                    <div class="col-sm-12">
                        <label class="form-label">아이디</label>
                        <input class="form-control" type="text" :value="member.id" disabled>
                    </div>
                    <div class="col-12">
                        <div class="form-label">성별</div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="male" :value="true"
                                v-model="member.isMale" />
                            <label class="form-check-label" for="male">남성</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="female" :value="false"
                                v-model="member.isMale" />
                            <label class="form-check-label" for="female">여성</label>
                        </div>
                    </div>
                    <div class="col-sm-12">
                        <label class="form-label">이메일</label>
                        <input class="form-control" type="email" v-model="member.email" id="email">
                    </div>
                    <div class="col-sm-6">
                        <label class="form-label">관심 운동 종목</label>
                        <i class="ai-circle-plus fs-base me-2 ms-2" @click="isAddingSport = true"></i>

                        <div class="mt-2 d-flex flex-wrap">
                            <span v-for="sport in member.sports" :key="sport"
                                class="badge text-nav fs-xs me-2 mb-2 position-relative sport"
                                @mouseenter="hoveredSport = sport" @mouseleave="hoveredSport = null">
                                {{ sport }}
                                <span v-if="hoveredSport === sport"
                                    class="position-absolute top-0 end-0 translate-middle bg-danger rounded-circle delete-icon"
                                    @click.stop="removeSport(sport)">
                                    <i class="ai-trash"></i> <!-- X 아이콘 -->
                                </span>
                            </span>
                        </div>

                        <!-- 사용자 입력 필드 -->
                        <div v-if="isAddingSport" class="d-flex align-items-center mt-2">
                            <input v-model="newSport" type="text" class="form-control me-2" placeholder="운동 종목을 입력하세요"
                                maxlength="10" @keyup.enter="addSport" />
                            <button @click="addSport" class="btn btn-sm btn-primary">추가</button>
                            <button @click="cancelAddSport" class="btn btn-sm btn-secondary ms-2">취소</button>
                        </div>
                    </div>
                    <div class="col-sm-12">
                        <label class="form-label">주 활동 지역</label>
                        <i class="ai-search fs-base me-2 ms-2"></i>
                        <div class="mt-2">
                            <span class="badge border text-nav">{{ member.location }}</span>
                        </div>
                    </div>

                    <div class="col-12">
                        <label class="form-label" for="bio">소개말</label>
                        <textarea class="form-control" rows="5" v-model="member.introduction" id="bio"></textarea>
                    </div>

                    <div class="col-12 d-flex justify-content-end pt-3">
                        <button class="btn btn-secondary" type="button">취소</button>
                        <button class="btn btn-primary ms-3" type="button" @click="saveProfileChanges">변경사항 저장</button>
                    </div>
                </div>
            </div>
        </section>

        <section class="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
            <div class="card-body">
                <div class="d-flex align-items-center pb-4 mt-sm-n1 mb-0 mb-lg-1 mb-xl-3"><i
                        class="ai-lock-closed text-primary lead pe-1 me-2"></i>
                    <h2 class="h4 mb-0">비밀번호 변경</h2>
                </div>
                
                <div class="row align-items-center g-3 g-sm-4 pb-3">
                    <!-- 기존 비밀번호 -->
                    <div class="col-sm-6">
                        <label class="form-label" for="current-pass">기존 비밀번호</label>
                        <PasswordShowToggle v-model="currentPassword" id="current-pass" :disabled="true" />
                    </div>
                
                    <div class="col-sm-6">
                        <a class="d-inline-block fs-sm fw-semibold text-decoration-none mt-sm-4" href="account-password-recovery.html">
                            비밀번호를 잊으셨습니까?
                        </a>
                    </div>
                
                    <div class="col-sm-6">
                        <label class="form-label" for="new-pass">새 비밀번호</label>
                        <PasswordShowToggle v-model="newPassword" id="new-pass" />
                    </div>
                
                    <div class="col-sm-6">
                        <label class="form-label" for="confirm-pass">새 비밀번호 확인</label>
                        <PasswordShowToggle v-model="confirmPassword" id="confirm-pass" />
                    </div>
                </div>
                
                <!-- 경고 메시지 -->
                <div v-if="validationErrors"
                    class="d-flex align-items-center p-2 rounded bg-danger bg-opacity-10 text-danger small">
                    <i class="ai-triangle-alert fs-sm me-2"></i>
                    {{ validationErrors }}
                </div>

                <div class="alert alert-info d-flex my-3 my-sm-4">
                    <i class="ai-circle-info fs-xl me-2"></i>
                    <p class="mb-0">비밀번호는 8자 이상 15자 이하이어야 하며, 특수문자가 포함되어야 합니다.</p>
                </div>

                <div class="d-flex justify-content-end pt-3">
                    <button class="btn btn-secondary" type="button">취소</button>
                    <button class="btn btn-primary ms-3" type="button" @click="changePassword">비밀번호 변경</button>
                </div>
            </div>
        </section>

        <section class="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4">
            <div class="card-body">
                <div class="d-flex align-items-center pb-4 mt-sm-n1 mb-0 mb-lg-1 mb-xl-3"><i
                        class="ai-trash text-primary lead pe-1 me-2"></i>
                    <h2 class="h4 mb-0">회원 탈퇴</h2>
                </div>
                <div class="alert alert-warning d-flex mb-4"><i class="ai-triangle-alert fs-xl me-2"></i>
                    <p class="mb-0">계정을 삭제하면, 공개 프로필이 즉시 비활성화됩니다. 14일 내에 마음이 바뀌면 이메일과 비밀번호로 로그인하면 계정을 다시 활성화할 수 있는 링크를
                        보내드립니다.
                        <a href="#" class="alert-link">더 알아보기</a>
                    </p>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="confirm" v-model="deleteChecked" />
                    <label class="form-check-label text-dark fw-medium" for="confirm">
                        동의합니다. 회원 탈퇴하겠습니다.
                    </label>
                </div>

                <!-- 경고 메시지 -->
                <div v-if="showDeleteError"
                    class="d-flex align-items-center mt-2 p-2 rounded bg-danger bg-opacity-10 text-danger small">
                    <i class="ai-triangle-alert fs-sm me-2"></i>
                    회원 탈퇴에 동의해 주세요.
                </div>

                <div class="d-flex flex-column flex-sm-row justify-content-end pt-4 mt-sm-2 mt-md-3">
                    <button class="btn btn-danger" type="button" @click="deleteMember">
                        <i class="ai-trash ms-n1 me-2"></i>회원 탈퇴
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import axios from 'axios'
import PasswordShowToggle from '@/pages/profile/components/PasswordShowToggle.vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

// (임시) api호출해서 가져와야함
const member = ref({
    name: '고윤정',
    imgUrl: '/assets/img/avatar/01.jpg',
    nickname: '러닝런닝',
    introduction: 'a.k.a 여자 김봉주. 풀코스 뛰는 그 날까지~~',
    location: '수원 권선구',
    isMale: false,
    email: 'goyounjung@example.com',
    sports: ['러닝', '필라테스', '클라이밍'],
    birth: '1996-04-22',
    id: 'goyounjung' // 아이디
})

const isAddingSport = ref(false); // 운동 종목을 추가할 때 사용자 입력 필드를 보이게 할 상태
const newSport = ref('');  // 사용자가 입력한 운동 종목을 저장
const hoveredSport = ref(null);

// 운동 종목 추가
const addSport = () => {
    if (newSport.value && !member.value.sports.includes(newSport.value)) {
        member.value.sports.push(newSport.value);
        newSport.value = '';  // 입력 후 필드를 비움
    }
};

// 운동 종목 삭제
const removeSport = (sport) => {
    const index = member.value.sports.indexOf(sport);
    if (index !== -1) {
        member.value.sports.splice(index, 1);
    }
};

// 운동 종목 추가 취소
const cancelAddSport = () => {
    newSport.value = '';  // 입력값 초기화
    isAddingSport.value = false;  // 입력 필드 숨김
};

// 변경사항 저장
const saveProfileChanges = async () => {
    try {
        // const response = await axios.put(`/api/members/${pageMemberId.value}`, member.value)

        // member 변수값 보여주기
        alert('변경된 회원 정보:\n' + JSON.stringify(member.value, null, 2));
        router.push('/profile/1')
    } catch (error) {
        console.error('프로필 저장 실패:', error)
        alert('저장 중 오류가 발생했습니다.')
    }
}

// 비밀번호 변경
const currentPassword = ref('12345678!');
const newPassword = ref('');
const confirmPassword = ref('');
const validationErrors = ref('');  // 하나의 오류 메시지를 저장

function changePassword() {
    // Reset validation error
    validationErrors.value = '';

    // Validate new password
    if (!newPassword.value) {
        validationErrors.value = '새 비밀번호를 입력해주세요.';
        return;
    } else if (!confirmPassword.value) {
        validationErrors.value = '새 비밀번호 확인을 입력해주세요.';
        return;
    } else if (newPassword.value !== confirmPassword.value) {
        validationErrors.value = '비밀번호가 일치하지 않습니다.';
        return;
    } 

    alert('비밀번호가 성공적으로 변경되었습니다.');
}

const deleteChecked = ref(false)
const showDeleteError = ref(false)

const deleteMember = async () => {
    if (!deleteChecked.value) {
        showDeleteError.value = true
        return
    }

    try {
        // await axios.delete(`/api/members/${member.value.id}`)
        alert('정상적으로 탈퇴되었습니다.')
        router.push('/')
    } catch (e) {
        console.error(e)
    }
}
</script>

<style scoped>
.sport {
    background-color: #88C2AE;
    border: 1px solid #438C74;
    transition: background-color 0.2s, border-color 0.2s;
    padding: 0.25rem 0.75rem;
    display: inline-block;
    position: relative;
    /* 배지 내에서 아이콘 위치 */
}

.delete-icon {
    width: 1rem;
    height: 1rem;
    font-size: 0.75rem;
    /* 아이콘 크기 */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
}

.sport:hover .delete-icon {
    background-color: #dc3545;
    color: white;
}
</style>