<template>
    <div class="container">
        <h3>Header</h3>
        <router-link to="/">
            Home
        </router-link>
        &nbsp;
        <router-link to="/shop">
            Shop
        </router-link>
        &nbsp;
        <router-link to="/appointment">
            Appointment
        </router-link>
        &nbsp;
        <router-link to="/myclub">
            My Clubs(임시)
        </router-link>
        &nbsp;
        <router-link to="/myAppointments">
            My Appointments(임시)
        </router-link>
        <br><br>

        <router-link to="/joinedClubs">
            Joined Clubs
        </router-link>
        &nbsp;
        <router-link to="/joinedAppointments">
            Joined Appointments
        </router-link>
        &nbsp;
        <router-link to="/profile/1">
            Profile
        </router-link>
        &nbsp;
        <router-link to="/profile/edit">
            Profile Edit
        </router-link>
        &nbsp;
        <router-link to="/chat-list">
            Chat List
        </router-link>
        &nbsp;
        <router-link to="/chat">
            Chat
        </router-link>
        <br><br>

        <router-link to="/club">
            Club
        </router-link>
        &nbsp;
        <router-link to="/club/manage/1">
            ClubManage
        </router-link>
        <br><br>

        <hr>
    </div>
</template>

<script setup>
</script>