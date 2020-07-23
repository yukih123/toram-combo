<template>
    <div>
        <h1>コンボMP計算</h1>
        <el-row v-for="(row, row_index) in rows" :key="row_index" :gutter="10">
            <el-col :span="16">
                <el-select placeholder="スキルを選択" v-model="row.skill_number" @change="change(row_index)">
                    <el-option-group
                        v-for="(category, category_index) in skill_categories"
                        :key="category_index"
                        :label="category.name">
                        <el-option
                            v-for="(skill, skill_index) in category.skills"
                            :key="skill_index"
                            :label="category_index + '-' + skill_index + ' ' + skill.name + ' ' + skill.mp"
                            :value="category_index + '-' + skill_index">
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
import skill_categories from '../assets/skills.json'

export default {
    name: 'Calc',
    data() {
        return {
            skill_categories: skill_categories,
            effects: [ "なし", "連撃", "心眼", "充填", "迅速", "強打", "執念", "〆" ],
            point: 20,
            init_row: {
                skill_number: null,
                category_index: null,
                skill_index: null,
                mp: null,
                halve_next: null,
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
                if (row.mp == null) {
                    return sum;
                }

                let mp = row.mp;
                let last_index = rows.length - 1;
                if (rows[last_index].skill_number == null) {
                    last_index--;
                }

                // 前が半減スキルなら半減する
                if (index != 0 && rows[index - 1].halve_next) {
                    mp = Math.ceil(mp / 10 / 2) * 10;
                }

                // 連撃 後で考える

                // 充填ならマイナス
                if (row.effect == 3) {
                    return sum - mp;
                }

                // 強打で最後なら2倍
                if (row.effect == 5 && index == last_index) {
                    return sum + mp * 2;
                }

                // 〆ならなし
                if (row.effect == 7) {
                    return sum;
                }

                return sum + mp;
            }, 0);
        },
    },
    methods: {
        change(row_index) {
            this.setRowData(row_index);
            this.addRow();
        },
        setRowData(index) {
            let row = this.rows[index];
            let number = row.skill_number.split('-');

            row.category_index = number[0];
            row.skill_index = number[1]
            row.mp = this.skill_categories[row.category_index]
                         .skills[row.skill_index]
                         .mp;
            row.halve_next = this.skill_categories[row.category_index]
                         .skills[row.skill_index]
                         .halve_next;
        },
        addRow() {
            if (this.rows[this.rows.length - 1].skill_number != null) {
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
