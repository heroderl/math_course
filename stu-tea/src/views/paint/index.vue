<template>
    <section>
        <math-header :isShowBtn="mathHeader.btnFlag" :title="mathHeader.headerName" :btnName="mathHeader.btnName"></math-header>
        <article class="content" ref="content">
            <div class="box_content">
                <article class="assistPanel">
                    <div class="top_tools_panel_left_color">
                        <ul>
                            <li><button id="colorBlack"></button></li>
                            <li><button id="colorRed"></button></li>
                            <li><button id="colorBlue"></button></li>
                            <li><button id="colorGreen"></button></li>
                            <li><button id="colorYellow"></button></li>
                            <li><button id="colorPurple"></button></li>
                        </ul>
                    </div>
                    <div class="top_tools_panel_left_tool">
                        <ul>
                            <li><button id="rubber" class="nochoosed"></button></li>
                            <li><button id="cancle" class="nochoosed"></button></li>
                            <li><button id="flag" class="nochoosed"></button></li>
                            <li><button id="rule" class="nochoosed"></button></li>
                            <li><button id="protractor" class="nochoosed"></button></li>
                            <li><button id="rotate" class="nochoosed"></button></li>
                        </ul>
                    </div>
                </article>
                <article class="questPanel"></article>
                <article class="canvasPanel">
                    <canvas id="myCanvas"></canvas>
                </article>
                <article class="toolPanel">
                    <div class="toolScroll">
                        <div class="toolContent">
                            <div class="tools_button">
                                <button id="interface_show" @click="isShowMask()">?</button>
                                <ul>
                                    <li><button id="point" class="nochoosed">點</button></li>
                                    <li><button id="segment" class="nochoosed">綫段</button></li>
                                    <li><button id="circular" class="nochoosed">圓</button></li>
                                    <li><button id="fan" class="nochoosed">扇形</button></li>
                                    <li><button id="radius" class="nochoosed">半徑</button></li>
                                    <li><button id="diameter" class="nochoosed">直徑</button></li>
                                    <li><button id="chord" class="nochoosed">弦</button></li>
                                    <!-- <li><button id="tangent" class="nochoosed">切线</button></li> -->
                                </ul>
                            </div>
                            <input type="text" id="value" placeholder="请输入"/>
                            <button class="right_tools_panel_Preservation">保存</button>
                        </div>
                    </div>
                </article>
                <aside class="inforPanel" v-show="infoFlag">
                    <div class="inforMask">
                        <h1>操作提示</h1>
                        <ul>
                            <li>點：點擊“點”功能按鈕，可繪製一個點；</li>
                            <li>綫段：點擊“綫段”功能按鈕，在畫板拖動形成綫段；</li>
                            <li>圓：點擊“圓”功能按鈕，點擊畫板拖動形成圓；</li>
                            <li>扇形：選中一個圓后，點擊“扇形”功能按鈕，在圓上拖動形成扇形；</li>
                            <li>半徑：選中一個圓后，在圓上點擊形成半徑；</li>
                            <li>直徑：選中一個圓后，在圓上點擊形成直徑；</li>
                            <li>弦：選中一個扇形后，在圖形上點擊形成弦；</li>
                            <li>文本框：在繪製圖形后，輸入角度/厘米改變圖形的大小；</li>
                            <li>保存：點擊“保存”功能按鈕，畫板内容保存至本地，並上傳至教師端。</li>
                        </ul>
                        <button @click="isShowMask()">跳过</button>
                    </div>
                </aside>
                <input type="text" id="inputFlag" class="hidden" placeholder="請輸入字母">
            </div>
        </article>
    </section>
</template>

<style scoped src="./index.css"></style>
<script lang="ts" src="./index.ts"></script>
