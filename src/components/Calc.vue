<template>
    <div>
        <h1>トーラム コンボ計算</h1>
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
                    v-if="row_index != 0"
                    v-model="row.effect"
                    placeholder="特殊効果を選択"
                    :disabled="isDisabledSkill(row_index)">
                    <el-option
                        v-for="(effect, key) in effects"
                        :key="key"
                        :label="effect"
                        :value="key"
                        :disabled="isDisabledEffect(row_index) && key != 'none'">
                    </el-option>
                </el-select>
                <div v-else>なし</div>
            </el-col>
            <el-col :span="2">
                <i v-if="row.skill.name != null" class="el-icon-delete" @click="deleteRow(row_index)"></i>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            消費MP {{ result }}
        </el-row>
        <el-row :gutter="10">
            コンボポイント {{ point }}
        </el-row>
    </div>
</template>

<script>
import skill_categories from '../assets/skills.min.json'
import effects from '../assets/effects.min.json'

export default {
    name: 'Calc',
    data() {
        return {
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
            return this.point >= 20 && this.rows[row_index].skill.name == null;
        },
        isDisabledEffect(row_index) {
            return this.point >= 20 && this.rows[row_index].effect == null;
        },
    }
}
</script>

<style scoped lang="scss">
    .el-select {
        width: 100%;
    }
    h1 {
        font-family: 'DS-kirigirisu';
    }
</style>
