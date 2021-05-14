<template>
    <mModal
        :modal="showModal"
        :headerSlot="true"
        :modalWidth="700"
        @listenModal="handleModalClose(modalName)"
    >
        <div slot="title">
            <span class="bold">图层数据:</span>
            <span>&nbsp;&nbsp;Name</span>
        </div>
        <div class="dataSetWrapper">
            <div class="edit-bts">
                <Button class="basic-button">数据结构编辑</Button>
                <span>注: 点击下方行号可定位到此行几何对象中心</span>
            </div>
            <pagedTable style="margin-top: 20px;" border :tableHeader="getColumns" :tableCon="tableData"></pagedTable>
        </div>  
    </mModal>  
</template>
<script>
import modalMixins from './modalMixins.js'

export default {
    name: 'dataSet',
    mixins: [modalMixins],
    data() {
        return  {
            tableData: [
                {id: '1', userid: '11', name: '111', dataid: '1111' },
                {id: '1', userid: '11', name: '111', dataid: '1111' },
                {id: '1', userid: '11', name: '111', dataid: '1111' },
                {id: '1', userid: '11', name: '111', dataid: '1111' },
                {id: '1', userid: '11', name: '111', dataid: '1111' },
                {id: '1', userid: '11', name: '111', dataid: '1111' },
                {id: '1', userid: '11', name: '111', dataid: '1111' },
                {id: '1', userid: '11', name: '111', dataid: '1111' },
                {id: '1', userid: '11', name: '111', dataid: '1111' },
            ]
        }
    },
    computed: {
        getColumns() {
            return [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'ID',
                    key: 'id',
                    align: 'center',
                    tooltip: true,
                },
                {
                    title: '用户ID',
                    key: 'userid',
                    align: 'center',
                    tooltip: true,
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'center',
                    tooltip: true,
                },
                {
                    title: '数据ID',
                    key: 'dataid',
                    align: 'center',
                    tooltip: true,
                },
                {
                    title: ' ',
                    key: 'ops',
                    align: 'right',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'span',
                                {
                                class: 'op-item',
                                on: {
                                    click: () => {
                                    }
                                }
                                },
                                '编辑'
                            )
                        ])
                    }
                },
            ]
        }
    },
    methods: {

    },
    mounted() {

    }
}
</script>
<style lang="less">
.dataSetWrapper {

}
</style>