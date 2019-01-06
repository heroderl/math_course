<template>
    <header>
        <button v-if="isShowBtn" @click="retBtn">{{btnName}}</button>
        <h1>{{title}}</h1>
    </header>
</template>

<style scoped src="./math-header.css"></style>
<script lang="ts" src="./math-header.ts"></script>
