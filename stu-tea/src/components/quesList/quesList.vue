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
                <li v-for="(item, key) in queryQuesOfDate()" :key="item['q_id']" :data-qid="item['q_id']">
                    <div>{{key + 1}}</div>
                    <p>{{item['q_content']}}</p>
                    <button v-if="isPush(parseInt(item['q_state'], 10))" class="noPush" @click="remotePush($event)">推送</button>
                    <button v-else class="push" @click="remotePush($event)">推送中</button>
                    <span>{{item['q_time'][0]}}年{{item['q_time'][1]}}月{{item['q_time'][2]}}日</span>
                </li>
            </ul>
        </article>
    </div>
</template>

<style scoped src="./quesList.css"></style>
<script lang="ts" src="./quesList.ts"></script>
