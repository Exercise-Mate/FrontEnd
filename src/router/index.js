import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import Shop from "@/pages/Shop.vue";
import Appointment from "@/pages/promise/AppointmentPage.vue";
import AppointmentRoute from "@/router/Appointment";
import MyClubsPage from "@/pages/MyClubsPage.vue";
import MyAppointmentsPage from "@/pages/promise/MyAppointmentsPage.vue";
import JoinedClubsPage from "@/pages/club/JoinedClubsPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Home", component: Home },
    { path: "/shop", name: "Shop", component: Shop },
    { path: "/appointment", name: "Appointment", component: Appointment },
    { path: "/myclub", name: "MyClub", component: MyClubsPage },
    {
      path: "/myAppointments",
      name: "MyCreatedAppointment",
      component: MyAppointmentsPage,
    },
    // (임시) 아래 두 줄을 다른 라우터 파일에 분리?
    { path: "/joinedClubs", name: "JoinedClubs", component: JoinedClubsPage },

    ...AppointmentRoute,
    // { path: '/input', name: "Input", component: Input },
    // { path: '/input2', name: "Input2", component: Input2 },
    // { path: '/update', name: "Update", component: Update },
  ],
});

export default router;
