<template>
    <el-container>
        <el-header height="auto">
            <h1>{{ config.title }}</h1>
        </el-header>
        <el-main>
            <div class="tip">
                <p>コンボのMPを計算するツールです。</p>
                <p>スキルと特殊効果を順に選んでください。</p>
            </div>
            <div class="form">
                <el-row :gutter="10" class="form_title">
                    <el-col :span="16">スキル</el-col>
                    <el-col :span="6">特殊効果</el-col>
                </el-row>
                <el-row v-for="(row, row_index) in rows" :key="row_index" :gutter="10">
                    <el-col :span="16">
                        <el-select
                            placeholder="スキルを選択"
                            v-model="row.skill"
                            value-key="name"
                            :disabled="isDisabledSkill(row_index)"
                            @change="change()">
                            <el-option-group
                                v-for="(category, category_index) in skill_categories"
                                :key="category_index"
                                :label="category.name">
                                <el-option
                                    v-for="(skill, skill_index) in category.skills"
                                    :key="skill_index"
                                    :label="skill.name + ' ' + skill.mp"
                                    :value="{
                                        name: skill.name,
                                        mp: skill.mp,
                                        halve_next: skill.halve_next,
                                    }">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-select
                            v-model="row.effect"
                            placeholder="特殊効果を選択"
                            :disabled="isDisabledSkill(row_index) || row_index == 0">
                            <el-option
                                v-for="(effect, key) in effects"
                                :key="key"
                                :label="effect"
                                :value="key"
                                :disabled="isDisabledEffect(row_index) && key != 'none'">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2">
                        <i v-if="row.skill.name != null" class="el-icon-delete" @click="deleteRow(row_index)"></i>
                    </el-col>
                </el-row>
            </div>
            <div class="result">
                <el-row :gutter="10">
                    消費MP <span class="point">{{ result }}</span>
                </el-row>
                <el-row :gutter="10">
                    コンボポイント <span class="point">{{ point }}</span>
                </el-row>
            </div>

            <el-collapse v-model="active_collapses" class="detail">
                <el-collapse-item name="1">
                    <template slot="title">
                        <i class="header-icon el-icon-info"></i> 使い方・注意事項
                    </template>
                    <ul>
                        <li>コンボに組み込みたいスキルと特殊効果を選択してください。</li>
                        <li>フィナウ〆やホリフィ〆など、キャンセルで終わらせたい場合は、特殊効果で〆を選んでください。</li>
                        <li>執念の消費MPは状況によるので、必要MP全てをHPでまかなう(MP消費0)と仮定して計算しています。</li>
                    </ul>
                </el-collapse-item>
                <el-collapse-item name="2">
                    <template slot="title">
                        <i class="header-icon el-icon-question"></i> お問い合わせ・バグ報告
                    </template>
                    <p>Twitter <a :href="'https://twitter.com/' + config.account">@{{ config.account }}</a> までご連絡ください。</p>
                    <p>プルリクエストしたい、ソースが見たいという方はDMください。</p>
                </el-collapse-item>
            </el-collapse>
        </el-main>
        <el-footer height="auto">
            <p class="license">Favicon by <a href="https://icons8.jp/">icons8</a></p>
        </el-footer>
    </el-container>
</template>

<script>
import config from '../assets/config.min.json'
import skill_categories from '../assets/skills.min.json'
import effects from '../assets/effects.min.json'

export default {
    name: 'Calc',
    data() {
        return {
            config: config,
            skill_categories: skill_categories,
            effects: effects,
            init_row: {
                skill: {},
                effect: null,
            },
            rows: [],
            active_collapses: [],
        }
    },
    mounted() {
        this.rows.push(Object.assign({}, this.init_row));
    },
    computed: {
        result() {
            let sum = 0;
            let filled_mp = 0;
            let last_index = this.rows.length - 1;
            if (last_index < 0) {
                last_index = 0;
            } else if (last_index != 0 && this.rows[last_index].skill.name == null) {
                last_index--;
            }

            for (const [index, row] of this.rows.entries()) {
                let mp = row.skill.mp;
                if (mp == null) {
                    break;
                }

                // 〆と執念ならなし
                if (row.effect == 'cancel' || row.effect == 'obsess') {
                    continue;
                }

                // 充填なら0
                if (row.effect == 'fill') {
                    filled_mp += mp;
                    continue;
                }

                // 前が半減スキルなら半減する
                if (index != 0 && this.rows[index - 1].skill.halve_next) {
                    mp = Math.ceil(mp / 10 / 2) * 10;
                }

                // 連撃なら起点から数えてマイナスされる
                if (row.effect == 'continue') {
                    mp = mp - index * 100;
                    if (mp < 0) {
                        continue;
                    }
                }

                // 強打で最後なら2倍
                if (row.effect == 'strike' && index == last_index) {
                    mp *= 2;
                }

                // 充填されたMPがあれば引く
                if (filled_mp > 0) {
                    if (filled_mp > mp) { // 充填MPの方が多い
                        filled_mp -= mp;
                        continue;
                    } else { // 充填を使い切る
                        mp -= filled_mp;
                    }
                }

                sum = sum + mp;
            }

            // 最後に充填が残っていたらプラスする
            if (filled_mp > 0) {
                sum += filled_mp;
            }

            return sum;
        },
        point() {
            return this.rows.reduce((sum, row) => {
                if (row.skill.name) {
                    sum++;
                }
                if (row.effect && row.effect != 'none') {
                    sum++;
                }
                return sum;
            }, 0);
        },
    },
    methods: {
        change() {
            this.addRow();
        },
        addRow() {
            if (this.rows[this.rows.length - 1].skill.name) {
                this.rows.push(Object.assign({}, this.init_row));
            }
        },
        deleteRow(row_index) {
            this.rows.splice(row_index, 1)
            if (row_index == 0 && this.rows.length == 0) {
                this.rows.push(Object.assign({}, this.init_row));
            }
        },
        isDisabledSkill(row_index) {
            return this.point >= 20
                && this.rows[row_index].skill.name == null;
        },
        isDisabledEffect(row_index) {
            return this.point >= 20
                && this.rows[row_index].effect == null;
        },
    }
}
</script>

<style scoped lang="scss">
@import "../assets/colors.scss";
.tip {
    border-bottom: 1px $sub-color solid;
    margin-bottom: 20px;
    padding-bottom: 20px;
}
.form {
    .form_title {
        font-size: small;
        .el-col {
            padding-left: 6px !important;
        }
    }
}
.result {
    margin-top: 20px;
    padding-left: 5px;
    .point {
        margin-left: 5px;
    }
}
.el-select {
    width: 100%;
}
.detail {
    border-top: 1px $sub-color solid;
    margin-top: 20px;
}
.license {
    font-size: small;
    text-align: right;
}
</style>
