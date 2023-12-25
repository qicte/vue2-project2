<template>
    <div>
        <el-card class="box-card" style="margin: 10px 0px;">
            <div slot="header" class="clearfix">
                <!-- @tab-click="handleClick" -->
                <!-- 头部左侧内容 -->
                <el-tabs class="tab" v-model="activeName">
                    <el-tab-pane label="销售额" name="销售额">

                    </el-tab-pane>
                    <el-tab-pane label="访问量" name="访问量">

                    </el-tab-pane>
                </el-tabs>
                <!-- 头部右侧内容 -->
                <div class="right">
                    <span>今日</span>
                    <span>本周</span>
                    <span>本月</span>
                    <span>本年</span>
                    <!--  v-model="value1" -->
                    <el-date-picker size="mini" class="date" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>
            <div>
                <el-row :gutter="10">
                    <el-col :span="18">
                        <!-- 柱状图 -->
                        <div class="charts" ref="charts"></div>
                    </el-col>
                    <el-col :span="6">
                        <h3>门店销售额排名</h3>
                        <ul>
                            <li>
                                <span class="lindex">0</span>
                                <span>kdj</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span class="lindex">0</span>
                                <span>kdj</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span class="lindex">0</span>
                                <span>kdj</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>0</span>
                                <span>kdj</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>0</span>
                                <span>kdj</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>0</span>
                                <span>kdj</span>
                                <span class="rvalue">123456</span>
                            </li>
                        </ul>
                    </el-col>

                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'
export default {
    name: 'Sale',
    data() {
        return {
            activeName: '销售额',
            charts: ''
        }
    },
    mounted() {
        this.charts = echarts.init(this.$refs.charts);
        this.charts.setOption({
            title: {
                text: this.title + '趋势'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: [],
                    color: 'yellowgreen'
                }
            ]
        })
    },
    computed: {
        title() {
            return this.activeName
        },
        ...mapState('home', ['list'])
    },
    watch: {
        title() {
            console
            // 重新修改图标配置数据
            this.charts.setOption({
                title: {
                    text: this.title + '趋势'
                },
                // 修改配置数组
                xAxis: {
                    data: this.title === '销售额' ? this.list.orderFullYearAxis : this.list.userFullYearAxis
                },
                series: [
                    {
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.title === '销售额' ? this.list.orderFullYear : this.list.userFullYear,
                        color: 'yellowgreen'
                    }
                ]
            })
        },
        list() {
            this.charts.setOption({
                title: {
                    text: this.title + '趋势'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.list.orderFullYearAxis,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.list.orderFullYear,
                        color: 'yellowgreen'
                    }
                ]
            })
        }
    }

}
</script>

<style  scoped>
.clearfix {
    position: relative;
    display: flex;
    justify-content: space-between;
}

.tab {
    width: 100%;
}

.right {
    position: absolute;
    right: 0px
}

.date {
    width: 200px;
    margin: 0px 20px;
}

.right span {
    margin: 0px 10px;
}

.charts {
    /* width: 100%; */
    height: 300px;
}

ul {
    padding: 0px;
    list-style: none;
    width: 100%;
    height: 300px;
}

ul li {
    height: 8%;
    margin: 10px 0px;
}

ul li span:nth-child(2) {
    margin-left: 20px;

}

.lindex {
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: black;
    color: white;
    text-align: center;
}

.rvalue {
    float: right;
}
</style>
