<template>
    <div>
        <el-form ref="form" label-width="80px" :model="spu">
            <el-form-item label="SPU名称">
                <el-input placeholder='SPU名称' v-model="spu.spuName"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select placeholder="请选择品牌" v-model="spu.tmId">
                    <el-option :label="trademark.tmName" :value="trademark.id" v-for="(trademark, index) in tradeMarkList"
                        :key="trademark.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input type='textarea' row="4" placeholder='SPU描述' v-model="spu.description"></el-input>
            </el-form-item>
            <el-form-item label='spu图片'>
                <!-- 上传图片 file-list:上传的文件列表：必须是数组类型，且要有name  url的字段
                     list-type：文件列表的类型-->
                <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :file-list="spuImageList"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-select :placeholder="`还有${unSelectSaleAttr.length}未选中`" v-model="attrIdAndName">
                    <el-option :label="sale.name" :value="`${sale.id}:${sale.name}`"
                        v-for="(sale, index) in unSelectSaleAttr" :key="sale.id"></el-option>
                </el-select>
                <el-button @click="addSaleAttr" type='primary' icon="el-icon-plus"
                    :disabled="!attrIdAndName">添加销售属性</el-button>
                <el-table style="width: 100%;" border :data="spu.spuSaleAttrList">
                    <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
                    <el-table-column prop="prop" label="属性名称列表" width="width">
                        <template slot-scope="{row,$index}">
                            <el-tag :key="tag.id" v-for="tag in row.spuSaleAttrValueList" closable
                                :disable-transitions="false" @close="row.spuSaleAttrValueList.splice($index, 1)">
                                {{ tag.saleAttrValueName }}
                            </el-tag>
                            <!-- 下面两个结构就是input与button互相切换 -->
                            <!--  @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" -->
                            <el-input ref="input" class="input-new-tag" v-if="row.inputVisible"
                                v-model.trim="row.inputValue" @keyup.enter.native="handleInputConfirm($event, row)"
                                size="small">
                            </el-input>
                            <!-- @click="showInput" -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <el-button type="danger" icon="el-icon-delete"
                                @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveSale">保存</el-button>
                <el-button @click.native="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

export default {
    name: 'SpuForm',
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            spu: {
                "category3Id": 0,
                "description": "",
                "spuName": "",
                "tmId": '',
                "spuImageList": [],
                "spuSaleAttrList": [],
            },
            tradeMarkList: [],
            spuImageList: [],
            saleAttrList: [],
            attrIdAndName: '',//收集未选择销售属性id （注意 发送保存请求之前要收集好数据
        }
    },
    methods: {
        // 照片墙照片移除回调
        handleRemove(file, fileList) {
            // file：删除的那张图片
            // filelist：剩下的照片墙图片
            // 暂时将数据收集到spuIMageLIst  最后整理发送给服务器的数据到spu  注意：要移除字段name 和url（这两用来显示照片墙）
            this.spuImageList = fileList
        },
        // 照片墙预览回调
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 照片墙上传成功回调
        handleSuccess(response, file, filelist) {
            // response图片请求上传的结果
            // file上传的图片地址
            // filelist：上传之后照片墙图片列表数组  返回的新增的数据带有name和url字段
            this.spuImageList = filelist
        },
        // 初始化spuForm数据
        async initSpuData(spu) {
            if (spu.id) {
                // 修改信息
                let spuResult = await this.$API.spu.reqSpuInfo(spu.id);
                if (spuResult.code = 200) {
                    // 整理数据  将销售属性添加inputVisable可见性  方便button与input切换
                    spuResult.data.spuSaleAttrList.forEach(item => {
                        item.inputVisible = false;
                        item.inputValue = ''
                    })
                    this.spu = spuResult.data
                }
                // 图片
                let ImageResult = await this.$API.spu.reqSpuImageList(spu.id);
                if (ImageResult.code == 200) {
                    let listArr = ImageResult.data;
                    // 新增name url  方便照片墙展示
                    listArr.forEach(item => {
                        item.name = item.imgName;
                        item.url = item.imgUrl;
                    })
                    this.spuImageList = listArr
                }
            } else {
                this.spu.category3Id = spu;

            }
            // 品牌
            let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
            if (tradeMarkResult.code == 200) {
                this.tradeMarkList = tradeMarkResult.data;
            }

            // 全部销售属性
            let SaleResult = await this.$API.spu.reqBaseSaleAttrList();
            if (SaleResult.code == 200) {
                this.saleAttrList = SaleResult.data
            }
        },
        // 添加销售属性
        addSaleAttr() {
            console.log(this.$refs.optionSaleAttr)
            const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(':')

            this.spu.spuSaleAttrList.push(
                {
                    baseSaleAttrId,
                    saleAttrName,
                    spuSaleAttrValueList: [],
                    spuId: this.spu.id,
                    inputVisible: false,//添加属性值的input框可见性  false即展示button添加按钮
                    inputValue: '',//收集输入的销售属性值
                }
            );
            // 清除选择销售属性的input上的文字
            this.attrIdAndName = ''

        },

        // 展示输入框添加属性值
        showInput(row) {
            // 显示输入框
            row.inputVisible = true;
            // 获取input焦点
            this.$nextTick(() => {
                this.$refs.input.focus()
            })
        },
        // 输入框点击确认后回调
        handleInputConfirm(event, row) {
            // 若输入的为空不添加
            if (!row.inputValue) {
                row.inputVisible = false;
                return;
            }
            // 若输入的重复  不添加  并提示
            let isSame = row.spuSaleAttrValueList.some(item => {
                return item.saleAttrValueName === row.inputValue
            })
            console.log(isSame)
            if (isSame) {
                this.$message('不可输入重复的属性值')
                return;
            }
            const { inputValue, baseSaleAttrId } = row

            // 将数据收集到this.spu.spuSaleAttrList.spuSaleAttrValueList
            row.spuSaleAttrValueList.push(
                {
                    baseSaleAttrId,
                    saleAttrValueName: inputValue,
                }
            )
            // 回到添加按钮状态
            row.inputVisible = false;
            // 清空输入数据 避免下次点击添加还存留数据
            row.inputValue = '';
        },
        // 保存操作
        async saveSale() {
            // 整理参数

            console.log(this.spu)
            // 照片墙参数整理 携带imageName和imageUrl
            this.spu.spuImageList = this.spuImageList.map(item => {
                return {
                    imgName: item.name,
                    imgUrl: (item.response && item.response.data) || item.url
                }
            })
            // 删除销售属性列表的inputvalue和inputvisible字段
            this.spu.spuSaleAttrList.filter(item => {
                delete item.inputValue,
                    delete item.inputVisible
            })
            console.log(this.spu)

            // 修改|添加
            let result = await this.$API.spu.reqSaveSpuSaleAttr(this.spu)
            if (result.code === 200) {
                this.$message({
                    type: 'success',
                    message: '保存成功'
                })
            }

            // 返回
            this.$emit('changeScene', this.spu.id ? 'update' : 'add')

            //    清除数据
            Object.assign(this._data, this.$options.data());

        },
        cancel() {
            // 返回
            this.$emit('changeScene', this.spu.id ? 'update' : 'add');
            // 清除数据
            // Object.assign 合并对象
            // _data：响应式数组
            //$options.data()  $options可用获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
            Object.assign(this._data, this.$options.data());

        }

    },
    computed: {
        // 计算出还没选中的销售属性.
        unSelectSaleAttr() {
            return this.saleAttrList.filter(item => {
                return this.spu.spuSaleAttrList.every(item1 => {
                    // every  每一项都符合条件 true  否则 false
                    // some   只要有一项符合条件  true 否则 false
                    return item.id != item1.baseSaleAttrId
                })
            })

        }
    }
}
</script>
<style></style>
