<template>
    <div class='charts' ref='charts'>


    </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
    name: 'progressChart',
    mounted() {
        console.log(1111)
        let lineCharts = echarts.init(this.$refs.charts)
        lineCharts.setOption({
            xAxis: {
                // 隐藏x轴
                show: false,
                // 最小值 最大值的设置
                min: 0,
                max: 100
            },
            yAxis: {
                show: false,
                // 均分
                type: 'category'
            },
            series: [

                {
                    type: 'bar',
                    data: [78],
                    color: 'yellowgreen',
                    // 柱状图的宽度
                    barWidth: 10,
                    // 背景颜色
                    showBackground: true,
                    backgroundStyle: {
                        color: "#eee"
                    },
                    // 文本的设置
                    label: {
                        show: true,
                        // 文本内容
                        formatter: '|',
                        position: "right"
                    }

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