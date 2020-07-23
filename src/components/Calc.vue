<template>
    <div>
        <h1>コンボMP計算</h1>
        <ul>
            <li v-for="(row, key) in rows" :key="key">
                <el-select v-model="row.category" placeholder="カテゴリーを選択">
                    <el-option
                        v-for="(category, key) in skill_categories"
                        :key="key"
                        :label="key + ' ' +  category.name"
                        :value="key">
                    </el-option>
                </el-select>
                <el-select
                    v-if="row.category != null"
                    v-model="row.mp"
                    placeholder="スキルを選択"
                    @change="addRow()">
                    <el-option
                        v-for="(skill, key) in skill_categories[row.category].skills"
                        :key="key"
                        :label="key + ' ' +  skill.name + ' ' + skill.mp"
                        :value="key">
                    </el-option>
                </el-select>
                <el-select
                    v-if="row.mp != null"
                    v-model="row.effect"
                    placeholder="特殊効果を選択">
                    <el-option
                        v-for="(effect, key) in effects"
                        :key="key"
                        :label="key + ' ' +  effect"
                        :value="key">
                    </el-option>
                </el-select>
                <i v-if="row.mp != null" class="el-icon-delete" @click="deleteRow(key)"></i>
            </li>
        </ul>
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
                category: null,
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
            if (this.rows[this.rows.length - 1].mp != null) {
                this.rows.push(Object.assign({}, this.init_row))
            }
        },
        deleteRow(key) {
            this.rows.splice(key, 1)
            if (key == 0) {
                this.rows.push(Object.assign({}, this.init_row))
            }
        },
    }
}
</script>

<style scoped lang="scss">
</style>
