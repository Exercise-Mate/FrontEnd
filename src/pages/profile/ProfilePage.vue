<template>
    <div class="container">
        <section class="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4">
            <div class="card-body">
                <div class="d-md-flex align-items-center">
                    <div class="d-sm-flex align-items-center w-100">
                        <div class="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                            style="width: 150px; height: 150px; background-image: url(assets/img/avatar/02.jpg);">
                        </div>

                        <div class="ms-3">
                            <div>
                                <span class="h3 fw-bold ms-4 me-4">{{ member.nickname }}</span>
                                <img v-if="member.isMale" src="/public/assets/img/gender/man.png" class="ms-3"
                                    style="height: 26px; margin-top: -15px" />
                                <img v-else src="/public/assets/img/gender/woman.png" class="ms-3"
                                    style="height: 30px; margin-top: -15px" />
                            </div>
                            <span class="badge border text-nav mt-4 ms-4">{{ member.location }}</span>
                            
                            <!-- 배지 스타일 -->
                            <!-- <span class="badge border text-info ms-4">약속 참여 <span class="badge bg-info ms-2">{{ member.participationCount }}</span></span> -->
                            <button type="button" class="btn btn-sm btn-outline-secondary ms-4">
                                약속 참여<span class="badge bg-info ms-2">{{ member.participationCount }}</span>
                            </button>
                        </div>

                        <button class="btn btn-sm btn-secondary ms-auto" style="margin-top: -55px;">
                            <i class="ai-edit ms-n1 me-2"></i>프로필 수정
                        </button>
                    </div>
                </div>

                <div class="mt-5 ms-1">
                    {{ member.introduction }}
                </div>

                <span v-for="sport in member.sports" :key="sport" class="badge text-nav fs-xs mt-4 me-4 sport">{{ sport
                }}</span>
            </div>
        </section>

        <div class="manner-rating">
            <h3 class="text-center mb-5 fw-bold">받은 매너 평가</h3>

            <div class="rating-items">
                <div v-for="(evaluation, index) in sortedEvaluation" :key="index" class="mb-3">
                    <div class="rating-evaluations border-dark-grey position-relative">
                        <div class="rating-evaluations d-flex align-items-center"
                            :class="{ 'positive': evaluation.isPositive, 'negative': !evaluation.isPositive }"
                            :style="{ width: `${calculateWidth(evaluation.count)}%` }">
                            <span class="rating-text ms-4">{{ evaluation.text }}</span>
                        </div>

                        <div
                            class="rating-count position-absolute top-50 end-0 translate-middle-y d-flex align-items-center me-2">
                            <span class="ai-user-group lead"></span>
                            <span class="fw-bold ms-1">{{ evaluation.count }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

// (임시) api호출해서 가져와야함
const member = ({
    nickname: '러닝런닝',
    introduction: 'a.k.a 여자 김봉주. 풀코스 뛰는 그 날까지~~',
    location: '수원 영통구',
    isMale: false,
    sports: ['러닝', '필라테스', '클라이밍'],
    participationCount: 18,
})

// (임시) api호출해서 가져와야함
const evaluations = [
    { text: '친절하고 매너가 좋아요.', count: 5, isPositive: true },
    { text: '분위기 메이커예요.', count: 4, isPositive: true },
    { text: '시간 약속을 잘 지켜요.', count: 4, isPositive: true },
    { text: '다음에도 같이 하고 싶어요.', count: 2, isPositive: true },
    { text: '개인적인 행동을 많이 해요.', count: 3, isPositive: false },
    { text: '위험하게 플레이해요.', count: 1, isPositive: false },
];

const sortedEvaluation = computed(() => {
    return evaluations
        .filter(evaluations => evaluations.count > 0) // count가 0 초과인 것만
        .sort((a, b) => {
            if (a.isPositive === b.isPositive) {
                return b.count - a.count; // count 내림차순
            }
            return a.isPositive ? -1 : 1; // positive 먼저
        });
});

const maxCount = computed(() => {
    return Math.max(...evaluations.map(evaluations => evaluations.count));
});

const calculateWidth = (count) => {
    const minWidth = 0;
    const maxWidth = 100;

    if (maxCount.value === 0) return minWidth;

    return minWidth + ((count / maxCount.value) * (maxWidth - minWidth));
};
</script>

<style scoped>
.sport {
    background-color: #88C2AE;
    border: 1px solid #438C74;
}

.manner-rating {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.rating-evaluations {
    height: 60px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border-radius: 25px 25px 25px 4px;
}

.positive {
    background-color: #5b9279;
    color: white;
}

.negative {
    background-color: #f2f3f5;
    color: #333;
}

.rating-text {
    font-size: 16px;
    font-weight: 500;
}

.rating-count {
    border-radius: 50px;
    padding: 8px 16px;
    color: #333;
    font-size: 18px;
    min-width: 40px;
    text-align: center;
}

.border-dark-grey {
    border: 1px solid #dbd9d9;
}
</style>