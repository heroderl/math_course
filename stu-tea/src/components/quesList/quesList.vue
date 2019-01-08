<template>
    <div class="math-list">
        <article class="math-list-time">
            <img class="dateImg" src="../../../static/image/TestList.png" alt="">
            <div class="math-list-time_select">
                <select id="year" v-model="year">
                    <option value="-1" selected>全部</option>
                    <option :value="key" v-for="(item, key) in getYear()" :key="key">{{item}}</option>
                </select>
                <span>年</span>
                <select id="month" v-model="month">
                    <option value="-1" selected>全部</option>
                    <option :value="key" v-for="(item, key) in getMonth(year)" :key="key">{{item}}</option>
                </select>
                <span>月</span>
                <select id="day" v-model="day">
                    <option value="-1" selected>全部</option>
                    <option :value="key" v-for="(item, key) in getDay(year, month)" :key="key">{{item}}</option>
                </select>
                <span>日</span>
            </div>
        </article>

        <article class="math-list-body">
            <ul>
                <!-- <li v-for="(item, key, index) in list" :key="item.id">
                    <div>{{index}}</div>
                    <p>{{item.content}}</p>
                    <button :class="item.state">推送</button>
                    <span>{{item.time}}</span>
                </li> -->
            </ul>
        </article>
    </div>
</template>

<style scoped src="./quesList.css"></style>
<script lang="ts" src="./quesList.ts"></script>
