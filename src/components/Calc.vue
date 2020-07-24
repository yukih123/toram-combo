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
        </el-main>
        <el-footer height="auto">
            <h2><i class="el-icon-info"></i> お問い合わせ・バグ報告</h2>
            <p>Twitter <a :href="'https://twitter.com/' + config.account">@{{ config.account }}</a> までご連絡ください。</p>
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
        }
    },
    mounted() {
        this.rows.push(Object.assign({}, this.init_row));
    },
    computed: {
        result() {
            let sum = this.rows.reduce((sum, row, index, rows) => {
                if (row.skill.mp == null) {
                    return sum;
                }

                let mp = row.skill.mp;
                let last_index = rows.length - 1;
                if (rows[last_index].skill_number == null) {
                    last_index--;
                }

                // 前が半減スキルなら半減する
                if (index != 0 && rows[index - 1].skill.halve_next) {
                    mp = Math.ceil(mp / 10 / 2) * 10;
                }

                // 連撃なら起点から数えてマイナスされる
                if (row.effect == 'continue') {
                    mp = mp - index * 100;
                    return (mp < 0) ? sum : sum + mp;
                }

                // 充填ならマイナス
                if (row.effect == 'fill') {
                    return sum - mp;
                }

                // 強打で最後なら2倍
                if (row.effect == 'strike' && index == last_index) {
                    return sum + mp * 2;
                }

                // 〆ならなし
                if (row.effect == 'cancel') {
                    return sum;
                }

                return sum + mp;
            }, 0);

            // 最後にマイナスだったら充填の残りなのでプラスにする
            return (sum < 0) ? Math.abs(sum) : sum;
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
    h1, h2, p {
        margin: 0;
    }
    a {
        color: #551a8b;
    }
    header {
        padding: 5px 10px;
        background-color: #AAABD3;
        h1 {
            color: #F8FAFF;
            font-family: 'DS-kinshichi';
            letter-spacing: -0.1em;
            text-align: center;
            &:before, &:after {
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
        border-top: 1px #CBA6C3 solid;
        margin: 0 20px;
        padding: 20px 0;
        h2 {
            font-size: medium;
        }
        .license {
            margin-top: 20px;
        }
    }
    .tip {
        border-bottom: 1px #CBA6C3 solid;
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
</style>
