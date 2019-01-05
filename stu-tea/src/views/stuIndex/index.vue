<template>
    <section>
        <math-header :isShowBtn="btnFlag" :title="headerName" :btnName="btnName"></math-header>
        <article ref="content">
            <stu-home :liImgs="liImgs" :height="articleHeight"></stu-home>
        </article>
    </section>
</template>

<style scoped src="./index.css"></style>
<script lang="ts" src="./index.ts"></script>
