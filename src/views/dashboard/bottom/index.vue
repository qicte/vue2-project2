<template>
    <div class="context">

        <el-row :gutter="10">
            <el-col :span="12">
                <lBottom />
            </el-col>
            <el-col :span="12">
                <rBottom />
            </el-col>

        </el-row>
    </div>
</template>
<script>
import lBottom from './lBottom.vue';
import rBottom from './rBottom.vue';
export default {
    name: 'Bottom',
    components: {
        lBottom,
        rBottom

    }
}
</script>
<style></style>