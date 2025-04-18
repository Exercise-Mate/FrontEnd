export default [
    {
      path: "/club/create",
      name: "club-create",
      component: () => import("@/pages/club/ClubCreatePage.vue"),
      props: true,
    },
    {
        path: "/club/join",
        name: "club-join",
        component: () => import("@/pages/club/ClubJoinPage.vue"),
        props: true,
      },
      {
        path: "/club/detail/:id",
        name: "club-detail",
        component: () => import("@/pages/club/ClubDetailPage.vue"),
        props: true,
      },
      {
        path: "/club",
        name: "club-main",
        component: () => import("@/pages/club/ClubPage.vue"),
        props: true,
      },
      {
        path: "/club/edit/:id",
        name: "club-edit",
        component: () => import("@/pages/club/ClubEditPage.vue"),
        props: true,
      },
      {
        path: "/club/appointment/:id",
        name: "club-appointment",
        component: () => import("@/pages/club/ClubAllAppointmentsPage.vue"),
        props: true,
      },
      {
        path: "/club/manage/:id",
        name: "club-manage",
        component: () => import("@/pages/club/ClubManagePage.vue"),
        props: true,
      }
  ];
  