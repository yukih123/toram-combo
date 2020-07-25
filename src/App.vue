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
@import "assets/colors.scss";
@import "assets/scss/main.scss";
/*
@import "assets/colors.scss";

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
body {
    margin: 0;
    color: $font-color;
    background-color: $background-color;
    border-bottom: 15px $main-color solid;
    &:after {
        content: '';
        display: block;
        border-bottom: 5px $sub-color solid;
    }
}
h1, h2, p, ul {
    margin: 0;
}
a {
    color: $link-color;
}
header {
    padding: 10px !important;
    background-color: $main-color;
    border-bottom: 5px $sub-color solid;
    h1 {
        color: $background-color;
        font-family: 'DS-kinshichi';
        letter-spacing: -0.1em;
        text-align: center;
        text-indent: -0.5em;
        &:before {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            margin: 0 5px;
            background-image: url("/favicon.ico");
            background-size: contain;
            vertical-align: middle;
        }
    }
}
footer {
    padding: 0 20px 20px;
}
.el-collapse-item__header,
.el-collapse-item__wrap,
.el-collapse-item__content {
    color: $font-color !important;
    background-color: transparent !important;
    .header-icon {
        margin-right: 5px;
    }
    ul {
        padding-left: 20px;
    }
}
.el-collapse-item__header,
.el-collapse-item__wrap {
    font-size: medium !important;
}
*/
</style>
