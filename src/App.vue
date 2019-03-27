<template>
<div id="app">
    <router-view />
    <span>123abcde</span>
</div>
</template>

<style lang="scss">

</style>

<script>
import {
    mapGetters
} from 'vuex'

export default {
    computed: {
        ...mapGetters(['test'])
    },
    mounted() {
        this.$store.dispatch('setTest', 100).then(() => {
            console.log(this.test);
        })
    },
}

document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html');
    let fontSize = window.innerWidth / 10;
    fontSize = fontSize > 50 ? 50 : fontSize;
    html.style.fontSize = fontSize + 'px';
});
</script>

<style lang="scss">
</style>
