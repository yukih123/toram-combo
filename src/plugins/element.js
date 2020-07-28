import Vue from 'vue'
import {
    Row,
    Col,
    Select,
    Option,
    OptionGroup,
    Collapse,
    CollapseItem
} from 'element-ui'
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
