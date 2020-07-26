<template>
    <div id="app">
        <Calc/>
    </div>
</template>

<script>
import Calc from './components/Calc.vue'

export default {
    name: 'App',
    components: {
        Calc
    }
}
</script>

<style lang="scss">
@import "assets/scss/common.scss";
@import "assets/scss/main.scss";
/*
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
*/
</style>
