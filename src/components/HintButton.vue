<template>
    <div>
        <!-- 可以巧妙利用a标签实现按钮带有提示功能 -->
        <a :title="title" margin="10px">
            <!-- 绑定$attrs的全部属性 注意：此种写法v-bind不能用简写：v-on不能用@-->
            <el-button v-bind="$attrs" v-on="$listeners"></el-button>
        </a>
    </div>
</template>
<script>
export default {
    name: 'HintButton',
    props: ['title'],
    mounted() {
        // $attrs属于组件的一个属性，可以获取父组件传递过来的props参数
        // 对于子组件而言，父组件给的数据可以用props接收，$attrs接收的是除了props接收了的数据
        console.log(this.$attrs)
        //$listeners  组件实例自身的一个属性，可以获取到父组件欸子组件的自定义事件
        console.log(this.$listeners)
    }
}
</script>
<style></style>