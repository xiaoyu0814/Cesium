<template>
      <Layout>
          <i-header class="layout-header-bar iview_header">
               <div class="iview_header_inner">
                  <img src="../../assets/logo1.png" alt="">
               </div>
               <!-- 这个线应该是用伪类做的 -->
               <b class="iview_scoreline"></b>
			   <AllMenu v-bind:addtable="addtable1" v-on:success="success($event)"></AllMenu>
          </i-header>
      </Layout>
</template>
<script>
import AllMenu from '@/components/menu/menu'
export default {
  name: 'HeaderNav',
  props:[
	'addTable'
  ],
  data: function () {
    return {
      name: 'zs',
	   addtable1:'1234'
    }
  },
  created(){
        this.addtable1=this.addTable  //初始化时候的赋值
		console.log(this.addtable1);
  },
  methods:{
    success(res){
		//console.log(this.addtable1);
        this.$emit('success',res);
    }       
  },
  components: {
		AllMenu:AllMenu
  }
}
</script>
<style scoped>

</style>
