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

import 'element-ui/lib/theme-chalk/col.css'
import 'element-ui/lib/theme-chalk/collapse-item.css'
import 'element-ui/lib/theme-chalk/collapse.css'
import 'element-ui/lib/theme-chalk/icon.css'
import 'element-ui/lib/theme-chalk/option-group.css'
import 'element-ui/lib/theme-chalk/option.css'
import 'element-ui/lib/theme-chalk/row.css'
import 'element-ui/lib/theme-chalk/select.css'

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
