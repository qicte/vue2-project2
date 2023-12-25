<template>
    <div>
        <div class="header">
            <span>搜索用户数</span>
            <svg t="1697195975232" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="4028" width="14" height="14">
                <path
                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                    p-id="4029"></path>
                <path d="M512 336m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="4030"></path>
                <path d="M536 448h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"
                    p-id="4031"></path>
            </svg>
        </div>
        <div class="main">
            <span class="main-title">12321</span>
            <span class="main-content">17.1</span>
            <svg t="1697196900031" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="5340" width="14" height="14">
                <path d="M960 704L512 256l-448 448z" fill="#518897" p-id="5341"></path>
            </svg>
            <svg t="1697197024606" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="6672" width="14" height="14">
                <path d="M64 320l448 448 448-448z" fill="#262626" p-id="6673"></path>
            </svg>
        </div>
        <div class="footer">
            <div class="charts" ref="charts"></div>

        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
    name: 'lineCharts',
    mounted() {
        let chart = echarts.init(this.$refs.charts)
        chart.setOption({
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
                        color: 'blue'
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
.header {
    /* 垂直居中 */
    display: flex;
    align-items: center;

    margin-top: 20px;
}

.header span {
    margin-right: 20px;
}

.main {
    margin: 10px 0px;
}

.main-title {
    margin-right: 30px;
}

.main-title {
    margin-right: 10px;
}

.charts {
    width: 100%;
    height: 50px;
}
</style>