<template>
    <div class='charts' ref='charts'>


    </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
    name: 'barChart',
    mounted() {
        console.log(1111)
        let lineCharts = echarts.init(this.$refs.charts)
        lineCharts.setOption({
            xAxis: {
                // 隐藏x轴
                show: false,
                type: 'category'
            },
            yAxis: {
                show: false
            },
            series: [

                {
                    type: 'bar',
                    data: [10, 3, 4, 9, 12],
                    color: 'skyblue',

                }
            ],
            // 布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            },
            tooltip: {

            }
        })
    }
}
</script>
<style scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>