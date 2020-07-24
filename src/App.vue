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
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
body {
    margin: 0;
    color: #353866;
    background-color: #F8FAFF;
    border-bottom: 15px #CBA6C3 solid;
}
</style>
