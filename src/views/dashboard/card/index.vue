<template>
    <div>
        <el-row :gutter="10">
            <!-- 总共24栏 -->
            <el-col :span='6'>
                <el-card>
                    <Detail title="总销售额" count="￥123844">
                        <template slot='charts'>

                            <span>周同比&nbsp;&nbsp;&nbsp;56.67%<svg t="1697196900031" class="icon" viewBox="0 0 1024 1024"
                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5340" width="14" height="14">
                                    <path d="M960 704L512 256l-448 448z" fill="#518897" p-id="5341"></path>
                                </svg></span>&nbsp;&nbsp;&nbsp;
                            <span>日同比&nbsp;&nbsp;&nbsp;56.67%<svg t="1697197024606" class="icon" viewBox="0 0 1024 1024"
                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6672" width="14" height="14">
                                    <path d="M64 320l448 448 448-448z" fill="#262626" p-id="6673"></path>
                                </svg></span>

                        </template>
                        <template slot='footer'>
                            <span>日销售额￥44545</span>
                        </template>

                    </Detail>
                </el-card>
            </el-col>
            <el-col :span='6'>
                <el-card>
                    <Detail title="访问量" count="￥123844">
                        <template slot='charts'>
                            <lineChart />
                        </template>

                        <template slot='footer'>
                            <span>日访问量44545</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span='6'>
                <el-card>
                    <Detail title="支付笔数" count="￥123844">
                        <template slot='charts'>
                            <barChart />
                        </template>
                        <template slot='footer'>
                            <span>转换率60%</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span='6'>
                <el-card>
                    <Detail title="运营活动效果" count="78%">
                        <template slot='charts'>
                            <progressChart />
                        </template>
                        <template slot='footer'>

                            <span>周同比&nbsp;&nbsp;&nbsp;56.67%<svg t="1697196900031" class="icon" viewBox="0 0 1024 1024"
                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5340" width="14" height="14">
                                    <path d="M960 704L512 256l-448 448z" fill="#518897" p-id="5341"></path>
                                </svg></span>&nbsp;&nbsp;&nbsp;
                            <span>日同比&nbsp;&nbsp;&nbsp;56.67%<svg t="1697197024606" class="icon" viewBox="0 0 1024 1024"
                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6672" width="14" height="14">
                                    <path d="M64 320l448 448 448-448z" fill="#262626" p-id="6673"></path>
                                </svg></span>

                        </template>

                    </Detail>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Detail from './Detail'
import lineChart from './lineChart.vue'
import barChart from './barChart.vue'
import progressChart from './progressChart.vue'


export default {
    name: 'Card',
    components: {
        Detail,
        lineChart,
        barChart,
        progressChart
    }
}
</script>
<style></style>