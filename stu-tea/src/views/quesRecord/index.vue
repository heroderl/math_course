<template>
    <section>
        <math-header :isShowBtn="mathHeader.btnFlag" :title="mathHeader.headerName" :btnName="mathHeader.btnName"></math-header>
        <article class="content" ref="content">
            <ques-list :date="date" :list="list"></ques-list>
        </article>
    </section>
</template>

<style scoped src="./index.css"></style>
<script lang="ts" src="./index.ts"></script>
