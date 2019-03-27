<template>
<div id="app">
    <router-view />
    <span>123</span>
    <p>abcd</p>
</div>
</template>

<script>
export default {
    
}

document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html');
    let fontSize = window.innerWidth / 10;
    fontSize = fontSize > 50 ? 50 : fontSize;
    html.style.fontSize = fontSize + 'px';
});
</script>

<style lang="scss" scoped>
@import './assets/styles/global.scss';
    #app {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    body {
        margin: 0;
        padding: 0;
    }
</style>
