<template>
    <div>
        <h1>コンボMP計算</h1>
        <el-row v-for="(row, row_index) in rows" :key="row_index" :gutter="10">
            <el-col :span="16">
                <el-select
                    placeholder="スキルを選択"
                    v-model="row.skill"
                    value-key="name"
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
                    placeholder="特殊効果を選択">
                    <el-option
                        v-for="(effect, key) in effects"
                        :key="key"
                        :label="effect"
                        :value="key">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <i v-if="row.skill_number != null" class="el-icon-delete" @click="deleteRow(row_index)"></i>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            消費MP {{ result }}
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
            point: 20,
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
            return this.rows.reduce((sum, row, index, rows) => {
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
    }
}
</script>

<style scoped lang="scss">
    .el-select {
        width: 100%;
    }
</style>
