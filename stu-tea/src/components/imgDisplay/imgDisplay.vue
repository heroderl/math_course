<template>
    <div>
        <ul class="imgLists">
            <li v-for="(item, key, index) in liImgs" :key="index">
                <img :src="item" @click="showImg(item)">
            </li>
        </ul>
        <aside class="showImg" v-if="showAside">
            <button @click="showImg()">X</button>
            <img src="" ref="asideImg">
        </aside>
    </div>
</template>

<style scoped src="./imgDisplay.css"></style>
<script lang="ts" src="./imgDisplay.ts"></script>
