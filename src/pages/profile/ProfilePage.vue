<template>
    <div class="container">
        <section class="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4">
            <div class="card-body">
                <div class="d-md-flex align-items-center">
                    <div class="d-sm-flex align-items-center w-100">
                        <div class="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                            style="width: 150px; height: 150px;" :style="{ backgroundImage: `url(${member.imgUrl})` }">
                        </div>

                        <div class="ms-3">
                            <div>
                                <span class="h3 fw-bold ms-4 me-4">{{ member.nickname }}</span>
                                <img v-if="member.isMale" src="/assets/img/gender/man.png" class="ms-3"
                                    style="height: 26px; margin-top: -15px" />
                                <img v-else src="/assets/img/gender/woman.png" class="ms-3"
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

        <section class="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4" v-if="loginMemberId == pageMemberId">
            <h3 class="text-center fw-bold">가입한 클럽</h3>
            <button class="btn btn-sm btn-primary ms-auto" style="margin-top: -55px;"
                @click="$router.push('/joinedClubs')">
                더보기
            </button>
            <div class="scroll-container">
                <article v-for="(item, index) in clubs" :key="index" class="swiper-slide mt-5">
                    <div class="card card-hover card-lifted h-100 border-0 mx-auto" style="max-width: 416px;">
                        <img class="card-img-top" :src="item.clubImgUrl" alt="Post clubImgUrl" />
                        <div class="card-body pb-4">
                            <div class="d-flex align-items-center mb-4 mt-n1">
                                <span class="badge text-nav fs-xs border">{{ item.sport }}</span>
                                <span class="fs-xs opacity-20 mx-3">|</span>
                                <span class="badge text-nav fs-xs border">{{ item.location }}</span>
                            </div>
                            <h3 class="h4 card-title">
                                <a :href="item.link">{{ item.title }}</a>
                            </h3>
                            <p class="card-text">{{ item.description }}</p>
                        </div>
                        <div class="card-footer pt-3">
                            <span class="d-flex align-items-center text-decoration-none pb-2">
                                <img class="rounded-circle" :src="item.memberImgUrl" width="48" alt="Post nickname" />
                                <h6 class="ps-3 mb-0">{{ item.nickname }}</h6>
                            </span>
                        </div>
                    </div>
                </article>
            </div>

            <h3 class="text-center fw-bold" style="margin-top: 70px;">참여한 약속</h3>
            <button class="btn btn-sm btn-primary ms-auto" style="margin-top: -55px;"
                @click="$router.push('/joinedAppointments')">
                더보기
            </button>
            <div class="scroll-container">
                <article v-for="(item, index) in appointments" :key="index" class="swiper-slide mt-5">
                    <div class="card card-hover card-lifted h-100 border-0 mx-auto" style="max-width: 416px;">
                        <img class="card-img-top" :src="item.clubImgUrl" alt="Post clubImgUrl" />
                        <div class="card-body pb-4">
                            <div class="d-flex align-items-center mb-4 mt-n1">
                                <span class="badge text-nav fs-xs border">{{ item.sport }}</span>
                            </div>
                            <h3 class="h4 card-title">
                                <a :href="item.link">{{ item.title }}</a>
                            </h3>

                            <div class="d-flex align-items-start justify-content-between mt-2">
                                <div>
                                    <div>Time : {{ item.createdAt }}</div>
                                    <div>Place : {{ item.location }}</div>
                                </div>
                                <div class="text-end">
                                    <span class="ai-user-check lead"></span>
                                    <span class="fw-bold ms-1 mt-1">{{ item.participantCount }} / {{
                                        item.participantLimit }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer pt-3">
                            <span class="d-flex align-items-center text-decoration-none pb-2">
                                <img class="rounded-circle" :src="item.memberImgUrl" width="48" alt="Post nickname" />
                                <h6 class="ps-3 mb-0">{{ item.nickname }}</h6>
                            </span>
                        </div>
                    </div>
                </article>
            </div>
        </section>

        <div class="manner-rating">
            <h3 class="text-center mb-5 fw-bold mt-5">받은 매너 평가</h3>

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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router'

// 로그인한 사용자 ID (예시)
const loginMemberId = ref(1);

// 현재 라우트 정보
const route = useRoute()

// path에서 추출한 memberId
const pageMemberId = computed(() => route.params.id)

// (임시) api호출해서 가져와야함
const member = ({   // 프로필 화면의 member 정보
    imgUrl: '/assets/img/avatar/01.jpg',
    nickname: '러닝런닝',
    introduction: 'a.k.a 여자 김봉주. 풀코스 뛰는 그 날까지~~',
    location: '수원 영통구',
    isMale: false,
    sports: ['러닝', '필라테스', '클라이밍'],
    participationCount: 18,
})

// (임시) api호출해서 가져와야함
const clubs = [
    {
        sport: "클라이밍",
        location: "서울 동작구",
        title: "DM 클라이밍 크루",
        description: "실내 암벽, 자연 암벽에서 볼더링과 리드 클라이밍을 즐겨하고 사랑하는 저희는 DM 크루 입니다.",
        clubImgUrl: "/assets/img/blog/grid/01.jpg",
        memberImgUrl: "/assets/img/avatar/06.jpg",
        nickname: "클밍아웃",
        link: "blog-single-v1.html" // (임시) 클럽의 상세페이지로 이동하도록 수정해야함
    },
    {
        sport: "배드민턴",
        location: "서울 강서구",
        title: "강서 배드민턴 클럽",
        description: "초보부터 중급까지 함께 배드민턴을 즐기는 강서구 중심의 스포츠 모임입니다.",
        clubImgUrl: "/assets/img/blog/grid/02.jpg",
        memberImgUrl: "/assets/img/avatar/02.jpg",
        nickname: "스매시조아",
        link: "blog-single-v1.html" // (임시) 클럽의 상세페이지로 이동하도록 수정해야함
    },
    {
        sport: "풋살",
        location: "경기 고양시",
        title: "고양 풋살 팀",
        description: "친목과 운동을 동시에! 매주 경기하며 팀워크를 다지는 풋살 팀입니다.",
        clubImgUrl: "/assets/img/blog/grid/03.jpg",
        memberImgUrl: "/assets/img/avatar/09.jpg",
        nickname: "킥앤런",
        link: "blog-single-v1.html" // (임시) 클럽의 상세페이지로 이동하도록 수정해야함
    },
    {
        sport: "러닝",
        location: "서울 마포구",
        title: "홍대 러닝 크루",
        description: "건강과 힐링을 위해 함께 달리는 마포 기반 러닝 크루입니다.",
        clubImgUrl: "/assets/img/blog/grid/04.jpg",
        memberImgUrl: "/assets/img/avatar/15.jpg",
        nickname: "달려보자",
        link: "blog-single-v1.html" // (임시) 클럽의 상세페이지로 이동하도록 수정해야함
    },
    {
        sport: "테니스",
        location: "경기 성남시",
        title: "성남 테니스 동호회",
        description: "주말마다 모여 친선 경기를 즐기는 열정 가득한 테니스 동호회입니다.",
        clubImgUrl: "/assets/img/blog/grid/05.jpg",
        memberImgUrl: "/assets/img/avatar/21.jpg",
        nickname: "라켓러버",
        link: "blog-single-v1.html" // (임시) 클럽의 상세페이지로 이동하도록 수정해야함
    }
]

// (임시) api호출해서 가져와야함
const appointments = [
    {
        sport: "클라이밍",
        location: "서울 동작구",
        title: "DM 클라이밍 크루",
        clubImgUrl: "/assets/img/blog/grid/01.jpg",
        memberImgUrl: "/assets/img/avatar/06.jpg",
        nickname: "클밍아웃",
        link: "blog-single-v1.html",
        createdAt: "2025.09.22 17시 00분",
        participantCount: 5,
        participantLimit: 8
    },
    {
        sport: "배드민턴",
        location: "서울 강서구",
        title: "강서 배드민턴 클럽",
        clubImgUrl: "/assets/img/blog/grid/02.jpg",
        memberImgUrl: "/assets/img/avatar/02.jpg",
        nickname: "스매시조아",
        link: "blog-single-v1.html",
        createdAt: "2025.09.21 19시 30분",
        participantCount: 4,
        participantLimit: 6
    },
    {
        sport: "풋살",
        location: "경기 고양시",
        title: "고양 풋살 팀",
        clubImgUrl: "/assets/img/blog/grid/03.jpg",
        memberImgUrl: "/assets/img/avatar/09.jpg",
        nickname: "킥앤런",
        link: "blog-single-v1.html",
        createdAt: "2025.09.20 20시 00분",
        participantCount: 10,
        participantLimit: 12
    },
    {
        sport: "러닝",
        location: "서울 마포구",
        title: "홍대 러닝 크루",
        clubImgUrl: "/assets/img/blog/grid/04.jpg",
        memberImgUrl: "/assets/img/avatar/15.jpg",
        nickname: "달려보자",
        link: "blog-single-v1.html",
        createdAt: "2025.09.18 06시 30분",
        participantCount: 7,
        participantLimit: 10
    },
    {
        sport: "테니스",
        location: "경기 성남시",
        title: "성남 테니스 동호회",
        clubImgUrl: "/assets/img/blog/grid/05.jpg",
        memberImgUrl: "/assets/img/avatar/21.jpg",
        nickname: "라켓러버",
        link: "blog-single-v1.html",
        createdAt: "2025.09.17 08시 00분",
        participantCount: 2,
        participantLimit: 4
    }
]

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

.scroll-container {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding: 1rem;
}

.swiper-slide {
    flex: 0 0 auto;
    max-width: 416px;
    width: 100%;
    box-sizing: border-box;
}

.card-lifted {
    box-shadow: 0 6px 20px rgba(119, 119, 119, 0.1);
}
</style>