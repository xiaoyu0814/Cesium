<template>
<mModal
        :modal="showModal"
        modalTitle="重命名"
        :modalWidth="550"
        @listenModal="handleModalClose(modalName)"
        @listenModalOk="changeName"
    >
    <div>
        <div class="container">
            <div style="width: 80px;">图层名称:</div>
            <Input v-model="rename" placeholder="请输入新的图层名称" style="width: 200px;" />
        </div>
    </div>
</mModal>
</template>
<script>
import { updateLayer } from '@/api/layer.js'
import modalMixins from './modalMixins.js'
export default {
   mixins: [modalMixins], 
   props:[
       "currentLayer"
   ],
   data(){
       return{
           rename: this.currentLayer.name
       }
   },
   mounted(){
       console.log(this.currentLayer)
   },
   methods:{
       changeName(){
           console.log(this.rename)
           const params={
                name: this.rename,
                id: this.currentLayer.id,
           }
           updateLayer(params).then((res)=>{
               if(res.code==0){
                   this.$store.dispatch('updateLayer', {...this.currentLayer, name: this.rename})
                   this.handleModalClose(this.modalName)
               }else{
                   console.log("修改失败")
               }
           }).catch(err => {
                this.$Message.error('修改失败!')
            })
       }
   }
   
}
</script>
<style scoped>
    .container{
        display: flex;
        margin: 20px auto;
        justify-content: center;
        align-items: center;
        font-size:13px;
        color:black;
    }
    .container>div{
        margin-top:10px;
    }
    .container>div>input{
        width:250px;
    }
</style>
