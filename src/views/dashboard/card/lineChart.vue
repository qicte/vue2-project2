<template>
    <div class='charts' ref='charts'>


    </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
    name: 'lineChart',
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
                    type: 'line',
                    data: [10, 3, 4, 9, 12],
                    // 拐点样式设置
                    itemStyle: {
                        opacity: 0,
                    },
                    // 线条样式设置
                    lineStyle: {
                        color: 'purple'
                    },
                    // 填充样式
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'purple' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'white' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    }
                }
            ],
            // 布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
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