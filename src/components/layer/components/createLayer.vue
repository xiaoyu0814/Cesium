<template>
    <mModal
        :modal="showModal"
        modalTitle="新增图层"
        :modalWidth="550"
        @listenModal="handleModalClose(modalName)"
        @listenModalOk="handleCreateLayer"
    >
        <div class="createLayerWrapper">
            <!-- <RadioGroup style="width: 100%;margin: 10px auto;text-align: center;" v-model="createType" type="button">
                <Radio label="customer" :type="createType == 'customer' ? 'primary' : 'normal'">创建新图层</Radio>
                <Radio label="exist" :type="createType == 'exist' ? 'primary' : 'normal'">引用云图层</Radio>
            </RadioGroup> -->
            <createCustomerLayer
                v-if="createType == 'customer'"
                ref="createCustomerLayer"
            />
            <createLayerFromExist
                v-if="createType == 'exist'"
                ref="createLayerFromExist"
            />
        </div>
    </mModal>   
</template>
<script>
import { createLayer, getDataSetList } from '@/api/layer.js'
import modalMixins from './modalMixins.js'
import PointLayer from '@/utils/Layers/PointLayer.js'
import createCustomerLayer from './createLayerComs/createCustomerLayer';
import createLayerFromExist from './createLayerComs/createLayerFromExist';

export default {
    mixins: [modalMixins],
    components: {
        createCustomerLayer,
        createLayerFromExist
    },
    data() {
        return {
           createType: 'customer' 
        }
    },
    methods: {
        handleCreateLayer() {
            // 创建图层   考虑两种情况
            let params = {};
            if(this.createType == 'customer') {
                params = this.$refs.createCustomerLayer.getParams();
            } else {
                params = this.$refs.createLayerFromExist.getParams();
            }
            createLayer({
                ...params,
                data_type: params.type == 'raster' ? 'Imagery' : 'GeoJson'
            }).then((res) => {
                if(res.code == 0) {
                    this.$Message.success('创建成功!')
                    this.handleModalClose(this.modalName);
                    this.$emit('handleCreateOk', {
                        ...params,
                        data_type: params.type == 'raster' ? 'Imagery' : 'GeoJson',
                        id: res.data.layerId || '',
                        show: true,
                    })
                } else {
                    this.$Message.error('创建失败!')
                }
            }).catch(err => {
                this.$Message.error('创建失败!')
            })
        }
    },
    mounted() {
    }
}
</script>
<style lang="less">
.createLayerWrapper {
    padding: 0 20px;
    
}
</style>