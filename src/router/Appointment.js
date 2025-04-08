export default [
  {
    path: "/appointments/detail",
    name: "appointment-detail",
    component: () => import("@/pages/promise/AppointmentDetailPage.vue"),
    props: true,
  },
  {
    // path: "/appointments/:id/join",
    path: "/appointments/join",
    name: "appointment-join",
    component: () => import("@/pages/promise/AppointmentJoinPage.vue"),
    props: true,
  },
  {
    path: "/appointments/create",
    name: "appointment-create",
    component: () => import("@/pages/promise/AppointmentCreatePage.vue"),
    props: true,
  },
  {
    // path: "/appointments/:id/applicants",
    path: "/appointments/applicants",
    name: "appointment-applicants",
    component: () => import("@/pages/promise/AppointmentApplicantsPage.vue"),
    props: true,
  },
  {
    path: "/appointments/review",
    name: "appointment-review",
    component: () => import("@/pages/promise/AppointmentReviewPage.vue"),
    props: true,
  },
];
