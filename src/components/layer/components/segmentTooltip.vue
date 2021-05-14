<template>
    <mModal
        :modal="showModal"
        modalTitle="分段图设置"
        :modalWidth="700"
        :scrollHide="false"
        @listenModal="handleModalClose(modalName)"
        @listenModalOk="handleRenderSegLayer"
    >
        <div class="segmentTooltipWrapper">
            <div class="prototype-item layer-name flex">
                <div class="bold label">字段:&nbsp;</div>
                <div>
                    <Select style="width: 200px;" v-model="field">
                        <Option v-for="item in fieldList" :key="item" :value="item">{{item}}</Option>
                    </Select>
                </div>
            </div>
            <div class="prototype-item Operation flex">
                <div class="bold label">分段长度:&nbsp;</div>
                <div>
                    <Select style="width: 200px;" v-model="segLength">
                        <Option v-for="item in segLengthList" :key="item" :value="item">{{item}}</Option>
                    </Select>
                </div>
            </div>
            <div class="prototype-item Operation flex">
                <div class="bold label">颜色渐变:&nbsp;</div>
                <div>
                    <Select style="width: 200px;" v-model="colorSecheme">
                        <Option v-for="item in colorSechemeList" :label="`rgb(${item.color[0]})-rgb(${item.color[1]})`" :key="item.value" :value="item.value">
                            <div
                                :style="{height: '20px', background: `linear-gradient(to right, rgb(${item.color[0]}) , rgb(${item.color[1]}))`}"
                            >
                            </div>
                        </Option>
                    </Select>
                </div>
            </div>
            <div class="prototype-item layer-name flex">
                <div class="bold label">分段范围:&nbsp;</div>
            </div>
            <Table
                style="width: 630px;"
                border
                :columns="tableColumns"
                :data="tableData"
            />
        </div>
    </mModal>   
</template>
<script>
import { mapGetters } from 'vuex'
import modalMixins from './modalMixins.js'
import { getFieldMinMax } from "@/api/vector"
import { getFieldListById } from "@/api/dataset"
import { createLayer } from '@/api/layer.js'

export default {
    name: 'segmentTooltip',
    props: ['currentLayer'],
    mixins: [modalMixins],
    data() {
        let segList = []
        for(let i=2;i<33;i++) {
            segList.push(i)
        }
        return  {
           field: '',
           fieldList: [],
            segLength: 2,
            segLengthList: segList,
           colorSecheme: '0',
           colorSechemeList: [
               // 配色方案将来应该是作为常量保存在前端,因为在后台获取到图层渲染的时候也是需要的
               { value: '0', color: [ '255,255,255', '0,0,0'] },
               { value: '1', color: [ '238,32,214', '10,47,182'] },
               { value: '2', color: [ '240,218,75', '255,0,94'] },
               { value: '3', color: [ '108,232,253', '13,1,91'] },
           ],
           tableData: [], 
           fieldRange: { min: 0, max: 0 },
        }
    },
    computed: {
        ...mapGetters(['currentMapId']),
        tableColumns() {
            return [
                {
                    title: ' ',
                    type: 'index',
                    align: 'center',
                    width: 50
                },
                {
                    title: '显示',
                    type: 'selection',
                    align: 'center',
                    width: 60
                },
                {
                    title: '颜色',
                    key: 'color',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                width: '40px',
                                height: '40px',
                                margin: '0 auto',
                                border: '1px solid black',
                                background: params.row.color
                            }
                        });
                    }
                },
                {
                    title: '分割值',
                    key: 'segment',
                    align: 'center'
                },
                {
                    title: '标题',
                    key: 'title',
                    align: 'center'
                }
            ]
        }
    },
    methods: {
        getStructure() {
            let param = {
                dataId: this.currentLayer.data_id,
                isNumberValue: true,
            };
            let _this = this;
            getFieldListById(param).then(data => {
                if (data.code == 0) {
                    const fieldList = data.data;
                    if(Array.isArray(fieldList)) {
                        let list = [];
                        fieldList.forEach((item) => {
                                list.push(item.name);
                        })
                        this.fieldList = list;
                        this.field = list[0]
                        if(this.field) this.getRange();
                    }
                } else {
                }
            });
        },
        // 获取css差值列表
        getColorList() {
            let colorsList = [];
            for(let i=0;i<this.colorSechemeList.length;i++) {
                if(this.colorSecheme == this.colorSechemeList[i].value) {
                    colorsList = this.colorSechemeList[i].color;
                    break;
                }
            }
            let startList = colorsList[0].split(','), endList = colorsList[1].split(',')
            // 进行差值计算
            let step1 = (endList[0] - startList[0]) / this.segLength
            let step2 = (endList[1] - startList[1]) / this.segLength
            let step3 = (endList[2] - startList[2]) / this.segLength
            let finalColorList = [];
            for(let i=0;i<this.segLength;i++) {
                finalColorList.push(`${parseInt(Number(startList[0]) + i * step1)},${parseInt(Number(startList[1]) + i * step2)},${parseInt(Number(startList[2]) + i * step3)}`)
            }
            return finalColorList;
        },
        // 生成列表数据
        renderTableData() {
            const { min, max } = this.fieldRange;
            const step = (max - min )/ this.segLength
            if(step <= 0) {
                this.tableData = [];
                return;
            }
            const colorsList = this.getColorList();
            const tableData = [];
            for(let i=0;i<this.segLength;i++) {
                let segment = Number(min + (i + 1) * step) || 0;
                let nowMin = Number(min + i * step) || 0;
                tableData.push({
                    color: `rgb(${colorsList[i]})`,
                    segment: segment.toFixed(4),
                    title: `${nowMin.toFixed(1)} < X < ${segment.toFixed(1)}`
                })
            }
            this.tableData = tableData;
        },
        // 获取分段数值范围
        getRange() {
            getFieldMinMax({
                datasetId: this.currentLayer.data_id,
                fieldName: this.field
            }).then(res => {
                if(res.code == 0) {
                    const { values_min = [], values_max = [] } = res.data || {};
                    const min = Number(values_min[0].value);
                    const max = Number(values_max[0].value);
                    this.fieldRange = { min, max };
                    this.renderTableData()
                }
            })
        },
        // 生成分割图图层
        handleRenderSegLayer() {
            if(!this.tableData.length) return;
            let colorList = this.tableData.map((item) => {
                return {
                    endValue: Number(item.segment),
                    color: item.color
                }
            })
            const { dataset_id = '', name = '', type = ''  } = this.currentLayer;
            createLayer({
                "map_id": this.currentMapId,
                "dataset_id": dataset_id,
                "is_public": 0,
                "name": name + '_Segmented_' + this.field,
                "type": type,
                data_type: 'GeoJson',
                "user_id": Number(window.localStorage.getItem('userId')),
                style: {
                    colorProperity: this.field,
                    colorList
                }
            }).then((res) => {
                if(res.code == 0) {
                    this.$Message.success('创建成功!')
                    this.$store.dispatch('addLayer', {
                        ...this.currentLayer,
                        id: res.data.layerId,
                        name: name + '_Segmented_' + this.field,
                        show: true,
                        type: type,
                        data_type: 'GeoJson',
                        style: {
                            colorProperity: this.field,
                            colorList
                        }
                    })
                    this.handleModalClose(this.modalName);
                } else {
                    this.$Message.error('创建失败!')
                }
            }).catch(err => {
                this.$Message.error('创建失败!')
            })
        }
    },
    mounted() {
        this.getStructure()
    },
    watch: {
        colorSecheme() {
            if(this.tableData.length) {
                this.renderTableData();
            }
        },
        segLength() {
            if(this.tableData.length) {
                this.renderTableData();
            }
        },
        field(val) {
            if(val) this.getRange();
        }
    }
}
</script>
<style lang="less">
.segmentTooltipWrapper {
    padding: 0 20px;
    font-size: 14px;
    .prototype-item {
        padding: 12px 0;
        align-items: center;
        .layer-name {
            border-bottom: 1px solid #000000;
        }
        .label {
            width: 90px;
            min-width: 90px;
            text-align: right;
            padding-right: 5px;
        }
        
    }
    .ivu-table-wrapper {
        .ivu-table-header {
            table {
                width: 100%!important;
            }
        }
    }
}
</style>