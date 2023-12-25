<template>
    <el-card>
        <div slot="header" class="header">
            <span>销售额类别占比</span>
            <el-radio-group v-model="value">
                <el-radio-button label="全部渠道"></el-radio-button>
                <el-radio-button label="线上"></el-radio-button>
                <el-radio-button label="门店"></el-radio-button>
            </el-radio-group>
        </div>
        <div>
            <div class="charts" ref="charts"></div>
        </div>
    </el-card>
</template>
<script>
import * as echarts from 'echarts'
export default {
    name: 'rBottom',
    data() {
        return {
            value: '全部渠道'
        }
    },
    mounted() {
        let charts = echarts.init(this.$refs.charts)
        charts.setOption({
            title: {
                text: '视频',
                subtext: 1048,
                left: 'center',
                top: 'center'
            },
            tooltip: {
                trigger: 'item'
            },

            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    // 显示文字
                    label: {
                        show: true,
                        position: 'outsize'
                    },
                    //高亮状态的扇区和标签样式
                    // emphasis: {
                    //     label: {
                    //         show: true,
                    //         fontSize: 40,
                    //         fontWeight: 'bold'
                    //     }
                    // },
                    labelLine: {
                        show: true
                    },
                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                    ]
                }
            ]
        });
        // 绑定事件
        charts.on('mouseover', (params) => {
            const { name, value } = params;
            //    重新设置标题
            charts.setOption({
                title: {
                    text: name,
                    subtext: value
                }
            })
        })
    }

}
</script>
<style scoped>
.header {
    display: flex;
    justify-content: space-between;

    border-bottom: 1px solid #eee;
}

.charts {
    width: 100%;
    height: 300px;

}
</style>