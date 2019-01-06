<template>
    <section>
        <math-header :isShowBtn="mathHeader.btnFlag" :title="mathHeader.headerName" :btnName="mathHeader.btnName"></math-header>
        <article class="content" ref="content">
            <div class="box_content">
                <div class="box-scroll">
                    <img-display :liImgs="imgDisplay.liImgs"></img-display>
                </div>
            </div>
        </article>
    </section>
</template>

<style scoped src="./index.css"></style>
<script lang="ts" src="./index.ts"></script>
