import Vue from 'vue'
import {
    Row,
    Col,
    Select,
    Option,
    OptionGroup,
    Collapse,
    CollapseItem,
    Icon
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import lang from 'element-ui/lib/locale/lang/ja'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Row);
Vue.use(Col);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Icon);
