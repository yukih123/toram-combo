<template>
    <form class="form">
        <el-row :gutter="5" class="form_title" type="flex">
            <el-col :span="17"><label for="select_skill">スキル</label></el-col>
            <el-col :span="6">特殊効果</el-col>
        </el-row>
        <template v-for="(row, row_index) in rows">
            <el-row :gutter="5" align="middle" type="flex" :key="'form-input-row-' + row_index" class="form_input_row">
                <el-col :span="17">
                    <el-select
                        placeholder="スキルを選択"
                        v-model="row.skill"
                        value-key="name"
                        :id="(row_index == 0) ? 'select_skill' : ''"
                        :disabled="isDisabledSkill(row_index)"
                        @change="change()">
                        <el-option-group
                            v-for="(category, category_index) in skill_categories"
                            :key="category_index"
                            :label="category.name">
                            <el-option
                                v-for="(skill, skill_index) in category.skills"
                                :disabled="! skill.can_start && row_index == 0"
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
                        :disabled="isDisabledSkill(row_index) || row_index == 0">
                        <el-option
                            v-for="(effect, key) in effects"
                            :key="key"
                            :label="effect"
                            :value="key"
                            :disabled="isDisabledEffect(row_index) && key != 'none'">
                        </el-option>
                    </el-select>
                    <div class="first-effect" v-else>なし</div>
                </el-col>
                <el-col :span="1">
                    <i v-if="row.skill.name != null" class="el-icon-delete-solid" @click="deleteRow(row_index)"></i>
                </el-col>
            </el-row>
            <p class="error" v-if="row.duplicate_error" :key="'error-' + row_index">
                <i class="el-icon-error"></i> 既に使われています
            </p>
        </template>
        <ul class="result">
            <li>消費MP <span class="point">{{ result }}</span></li>
            <li>コンボポイント <span class="point">{{ point }}</span></li>
        </ul>
    </form>
</template>

<script>
import skill_categories from '../assets/json/skills.json'
import effects from '../assets/json/effects.json'

export default {
    name: 'Calc',
    data() {
        return {
            skill_categories: skill_categories,
            effects: effects,
            init_row: {
                skill: {},
                effect: null,
                duplicate_error: false,
            },
            rows: [],
        }
    },
    mounted() {
        this.rows.push(Object.assign({}, this.init_row));
    },
    computed: {
        env() {
            return process.env;
        },
        result() {
            const rows = this.rows;
            let sum = 0;
            let filled_mp = 0;
            let last_index = rows.length - 1;
            if (last_index < 0) {
                last_index = 0;
            } else if (last_index != 0 && rows[last_index].skill.name == null) {
                last_index--;
            }

            for (const [index, row] of rows.entries()) {
                let mp = row.skill.mp;
                if (mp == null) {
                    break;
                }

                // 〆と執念ならなし
                if (row.effect == 'cancel') {
                    // 充填されたMPも消費されない
                    filled_mp = 0;
                    continue;
                }
                if (row.effect == 'obsess') {
                    continue;
                }

                // 充填なら0
                if (row.effect == 'fill') {
                    filled_mp = mp;
                    mp = 0;
                    continue;
                }

                // 強打で最後なら2倍
                if (row.effect == 'strike' && index == last_index) {
                    mp *= 2;
                }

                // 前が半減スキルなら半減する
                if (index != 0 && rows[index - 1].skill.halve_next) {
                    mp = Math.ceil(mp / 100 / 2) * 100;
                }

                // 前が反射(成功)なら-100
                if (index != 0 && rows[index - 1].effect == "reflexion_success") {
                    mp = mp - 100;
                }

                // 連撃なら起点から数えてマイナスされる
                if (row.effect == 'continue') {
                    mp = mp - index * 100;
                    if (mp < 0) {
                        continue;
                    }
                }

                // 充填されたMPがあれば引く
                if (filled_mp > 0) {
                    if (filled_mp > mp) { // 充填MPの方が多い
                        filled_mp -= mp;
                        continue;
                    } else { // 充填を使い切る
                        mp -= filled_mp;
                        filled_mp = 0;
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
                if (row.effect && (row.effect != 'none' && row.effect != 'cancel')) {
                    sum++;
                }
                if (sum < 0) {
                    sum = 0;
                }
                return sum;
            }, -1);
        },
    },
    methods: {
        change() {
            this.checkDuplicationAll();
            this.addRow();
        },
        checkDuplicationAll() {
            let length = this.rows.length;
            for (let i = 0; i < length; i++) {
                this.checkDuplication(i);
            }
        },
        checkDuplication(row_index) {
            const rows = this.rows;
            rows[row_index].duplicate_error = false;
            if (rows[row_index].skill.mp == 0) {
                return;
            }
            if (row_index == 0 || Object.keys(rows[row_index].skill).length == 0) {
                return;
            }
            const name = rows[row_index].skill.name.replace(/\(.+\)/, "");
            for (const [index, row] of rows.entries()) {
                if (index == row_index || row.skill.name == null) {
                    continue;
                }
                if (name == row.skill.name.replace(/\(.+\)/, "")) {
                    rows[row_index].duplicate_error = true;
                    return;
                }
            }
        },
        addRow() {
            if (this.rows[this.rows.length - 1].skill.name) {
                this.rows.push(Object.assign({}, this.init_row));
            }
        },
        deleteRow(row_index) {
            // Delete
            this.rows.splice(row_index, 1)
            let length = this.rows.length;
            if (row_index == 0 && length == 0) {
                this.rows.push(Object.assign({}, this.init_row));
            }

            // Reset first effect
            this.rows[0].effect = null;

            // Duplication check
            this.checkDuplicationAll();
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
