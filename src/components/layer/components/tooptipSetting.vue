<template>
    <mModal
        :modal="showModal"
        modalTitle="提示信息设置"
        :modalWidth="700"
        :scrollHide="false"
        @listenModal="handleModalClose(modalName)"
        @listenModalOk="handleCreateTextLayer"
    >
        <div class="tooltipSettingWrapper">
           <div class="prototype-item layer-name flex">
                <div class="bold label">字段名:&nbsp;</div>
                <div>
                    <Select v-model="field" style="width:200px">
                        <Option v-for="item in fieldList" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </div>
            </div>
            <Collapse v-model="collapse">
                <Panel name="style">
                    样式
                    <div slot="content">
                        <div class="prototype-item layer-name flex">
                            <div class="bold label">字体:&nbsp;</div>
                            <div>
                                <Select v-model="fontFamily" style="width:100px" placeholder="字体">
                                    <Option v-for="item in fontFamilyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <Select v-model="fontSize" style="width:100px" placeholder="字号">
                                    <Option v-for="item in numberList" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                                <!-- <Select v-model="fontColor" style="width:100px"  placeholder="颜色">
                                    <Option v-for="item in colorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select> -->
                            </div>
                        </div>
                        <div style="font-size: 14px;margin: 6px 6px 6px 24px;display: flex;align-items: center;">字体颜色&nbsp;&nbsp;{{fontColor.hex}}</div>
                        <slider-picker style="margin-left: 64px" v-model="fontColor" />
                        <!-- <div class="prototype-item layer-name flex">
                            <div class="bold label">符号:&nbsp;</div>
                            <div>
                                <Input v-model="symbol" style="width:100px" />
                                <Select v-model="fontSize" style="width:100px" placeholder="字号">
                                    <Option v-for="item in numberList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <Select v-model="fontColor" style="width:100px"  placeholder="颜色">
                                    <Option v-for="item in colorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </div>
                        </div>  -->
                    </div>
                </Panel>
                <Panel name="position">
                    位置
                    <div slot="content" style="text-align: center;">
                        <RadioGroup class="m_radio" v-model="position">
                            <Radio label="左上" border></Radio>
                            <Radio label="上" border></Radio>
                            <Radio label="右上" border></Radio>
                            <Radio label="左" border></Radio>
                            <Radio label="中" border></Radio>
                            <Radio label="右" border></Radio>
                            <Radio label="左下" border></Radio>
                            <Radio label="下" border></Radio>
                            <Radio label="右下" border></Radio>
                        </RadioGroup>
                    </div>
                </Panel>
                <!-- <Panel name="offset">
                    偏移量
                    <div slot="content" class="flex">
                        <div class="prototype-item layer-name flex" style="width: 50%">
                            <div class="bold label">水平偏移:&nbsp;</div>
                            <div>
                                <Input />
                            </div>
                        </div>
                        <div class="prototype-item layer-name flex" style="width: 50%">
                            <div class="bold label">垂直偏移:&nbsp;</div>
                            <div>
                                <Input />
                            </div>
                        </div>
                    </div>
                </Panel>
                <Panel name="lineTip">
                    线提示
                    <div slot="content">
                        <div class="flex">
                            <div class="prototype-item layer-name flex" style="width: 50%">
                                <div class="bold label">符号类型:&nbsp;</div>
                                <div>
                                    <Select v-model="symbolType" style="width:100px">
                                        <Option v-for="item in symbolTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </div>
                            </div>
                            <div class="prototype-item layer-name flex" style="width: 50%">
                                <div class="bold label">符号间距:&nbsp;</div>
                                <div>
                                    <Input />
                                </div>
                            </div>
                        </div>
                        <div class="flex">
                            <div class="prototype-item layer-name flex" style="width: 50%">
                                <div class="bold label">符号方向:&nbsp;</div>
                                <div>
                                    <Select v-model="flexDirection" style="width:100px">
                                        <Option v-for="item in flexDirectionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </div>
                            </div>
                            <div class="prototype-item layer-name flex" style="width: 50%">
                                <div class="bold label">文字间距:&nbsp;</div>
                                <div>
                                    <Input />
                                </div>
                            </div>
                        </div>
                        <div class="prototype-item layer-name flex">
                            <div class="bold label">排列方向:&nbsp;</div>
                            <div>
                                <Select v-model="symbolDirection" style="width:300px">
                                    <Option v-for="item in symbolDirectionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Panel> -->
            </Collapse>
        </div>  
    </mModal>  
</template>
<script>
import { mapGetters } from 'vuex'
import { createLayer, findDataSetDetail } from '@/api/layer.js'
import modalMixins from './modalMixins.js'
import { getDataSetFieldList } from "@/api/load";

export default {
    name: 'tooltipSetting',
    mixins: [modalMixins],
    props: ['currentLayer'],
    computed: {
        ...mapGetters(['currentMapId'])
    },
    data() {
        return  {
            fontColor: { hex: '#000000' },
            fieldList: [],
            fontFamilyList: [
                { value: '微软雅黑', label: '微软雅黑' },
                { value: '黑体', label: '黑体' },
                { value: '宋体', label: '宋体' },
            ],
            numberList: [2,4,6,8,10,12,14,16,18,20,22,24],
            colorList: [
               { value: 'black', label: 'black' },
                { value: 'field2', label: 'field2' },
                { value: 'field3', label: 'field2' }, 
            ],
            symbolTypeList: [
                { value: 'simple', label: '简单' },
                { value: 'complex', label: '复杂' },
            ],
            flexDirectionList: [
                { value: 'Horizontal', label: '水平' },
                { value: 'Vertical', label: '垂直' },
            ],
            symbolDirectionList: [
                { value: '1', label: '从上到下, 从左到右' },
                { value: '2', label: '从下到上, 从右到左' },
            ],
            field: '',
            collapse: '',
            fontFamily: '',
            fontSize: '2',
            symbol: '',
            position: '左上',
            symbolType: '',
            flexDirection: '',
            symbolDirection: ''
        }
    },
    mounted() {
        this.getStructure();
    },
    methods: {
        getStructure() {
            let param = {
                datasetId: this.currentLayer.data_id
            };
            console.log(this.currentLayer);
            let url =
                "http://piecloud.piesat.cn/api/v1/spatiotemporal/datasets/findDatasetInfoById";
            let _this = this;
            getDataSetFieldList(url, param).then(data => {
                if (data.code == 0) {
                    const fieldList = data.data.field_list;
                    if(Array.isArray(fieldList)) {
                        let list = [];
                        fieldList.forEach((item) => {
                            list.push(item.name);
                        })
                        this.fieldList = list;
                    }
                } else {
                }
            });
        },
        handleCreateTextLayer() {
            if(!this.field) {
                this.$Message.error('请选择字段');
                return;
            }
            let finalPosition = [0, 0];
            switch(this.position) {
                case '左上': 
                    finalPosition = [-40, -40]
                    break;
                case '上': 
                    finalPosition = [0, -40]
                    break;
                case '右上': 
                    finalPosition = [40, -40]
                    break;
                case '左': 
                    finalPosition = [-40, 0]
                    break;
                case '中': 
                    finalPosition = [0, 0]
                    break;
                case '右': 
                    finalPosition = [40, 0]
                    break;
                case '左下': 
                    finalPosition = [-40, 40]
                    break;
                case '左上': 
                    finalPosition = [-40, 40]
                    break;
                case '下': 
                    finalPosition = [0, 40]
                    break;
                case '右下': 
                    finalPosition = [40, 40]
                    break;

            }
            const { dataset_id = '', name = '', type = ''  } = this.currentLayer;
            createLayer({
                "map_id": this.currentMapId,
                "dataset_id": dataset_id,
                "is_public": 0,
                "name": name + '_Tooltip_' + this.field,
                "type": 'text',
                data_type: 'GeoJson',
                "user_id": Number(window.localStorage.getItem('userId')),
                style: {
                    text: this.field,
                    offset: finalPosition,
                    fontSize: this.fontSize,
                    fillColor: this.fontColor.hex, 
                }
            }).then((res) => {
                if(res.code == 0) {
                    this.$Message.success('创建成功!')
                    this.$store.dispatch('addLayer', {
                        ...this.currentLayer,
                        id: res.data.layerId,
                        name: name + '_Tooltip_' + this.field,
                        show: true,
                        type: 'text',
                        data_type: 'GeoJson',
                        style: {
                            text: this.field,
                            offset: finalPosition,
                            fontSize: this.fontSize,
                            fillColor: this.fontColor.hex,
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
}
</script>
<style lang="less">
.tooltipSettingWrapper {
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
    .m_radio {
        .ivu-radio-wrapper {
            width: 20%;
            border: 1px solid #ccc;
            padding: 6px;
            text-align: center;
            display: inline-flex;
            justify-content: space-around;
            margin: 2% 5%;
            align-items: center;
            font-size: 14px;
            border-radius: 4px;
        }
        .ivu-radio-wrapper-checked {
            border: 1px solid @main-blue;
        }
    }
}
</style>