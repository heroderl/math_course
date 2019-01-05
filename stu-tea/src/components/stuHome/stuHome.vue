<template>
    <ul ref="ulBtn">
        <li v-for="(item, key, index) in liImgs" :key="index">
            <nav>
                <img :src="item.src" :alt="item.text">
                <a @click="item.click()">{{item.text}}</a>
            </nav>
        </li>
    </ul>
</template>

<style scoped src="./stuHome.css"></style>
<script lang="ts" src="./stuHome.ts"></script>
