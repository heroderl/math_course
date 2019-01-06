<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
html, body {
    width: 100%;
    height: 100%;
}
html, body, h1, ul, li, button {
    margin: 0;
    padding: 0;
    border: 0;
    background-color: initial;
}
ul {
    list-style: none;
}
button {
    cursor: pointer;
}
button:active {
    opacity: 0.5;
    -webkit-tap-highlight-color:transparent;
}
button:focus {
    outline: none;
}
</style>
