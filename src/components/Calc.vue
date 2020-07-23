<template>
    <div>
        <h1>コンボMP計算</h1>
        <el-row v-for="(row, row_index) in rows" :key="row_index" :gutter="10">
            <el-col :span="16">
                <el-select placeholder="スキルを選択" v-model="row.skill_number" @change="addRow()">
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
    </div>
</template>

<script>
import skill_categories from '../assets/skills.json'

export default {
    name: 'Calc',
    data() {
        return {
            skill_categories: skill_categories,
            effects: [
                "なし", "連撃", "心眼", "充填", "迅速", "強打", "執念"
            ],
            point: 20,
            init_row: {
                skill_number: null,
                mp: null,
                effect: null,
            },
            rows: [],
        }
    },
    mounted() {
        this.rows.push(Object.assign({}, this.init_row))
    },
    methods: {
        addRow() {
            if (this.rows[this.rows.length - 1].skill_number != null) {
                this.rows.push(Object.assign({}, this.init_row))
            }
        },
        deleteRow(row_index) {
            this.rows.splice(row_index, 1)
            if (row_index == 0) {
                this.rows.push(Object.assign({}, this.init_row))
            }
        },
    }
}
</script>

<style scoped lang="scss">
    .el-select {
        width: 100%
    }
</style>
