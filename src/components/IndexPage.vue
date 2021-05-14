<style scoped>
	.layout{
	   width:100%;
	   height:100%;
	}
	.layout_header{
		width:100%;
		padding:0px;
	    height:auto;
	    line-height:auto;
	}
	.add_div{
		width:100%;
		height:450px;
	}
	.layout-footer-center{
		text-align: center;
	}
</style>
<template>
  <div class="layout">  
     <!-- 头部导航 -->
	 <Layout>
	   <Header class='layout_header'>
         <HeaderNav :addTable="fcz" v-on:success="success($event)"></HeaderNav>
	   </Header>
	   <Content>
	     <div class="add_div">
			<ul>
				<Row>
					<Col span="12"><li :is="addtable"></li></Col>
					<Col span="12"><li :is="addechart"></li></Col>
				</Row>
			</ul>
		 </div>
	   </Content>
       <Footer class="layout-footer-center">北京航天宏图股份有限公司&copy; TalkingData</Footer>
	 </Layout>
  </div>
</template>
<script>
//  面包屑导航应该是在每个页面下
import HeaderNav from '@/components/header/HeaderNav'
import Newtable from '@/components/table/table'
import Chart from '@/components/echart/echart'
export default {
  name: 'IndexPage',
  data () {
    return {
       addtable:'',
	   addechart:'',
	   fcz:'1234567'
    }
  },
  computed: {
      
  },
  methods:{
    success(res){
		//console.log(res);
		if(res){
			if(res=='Chart'){
				this.addechart= res;
			}else if(res=='Newtable'){
				this.addtable= res;
			}else if(res=='delt'){
				this.addtable='';
			}else if(res=='dele'){
				this.addechart='';
			}
		}else{
			this.addtable='';
			this.addechart='';
		}
       
    }       
  },
  components: {
		HeaderNav: HeaderNav,
		Newtable:Newtable,
		Chart:Chart
  }
}
</script>

