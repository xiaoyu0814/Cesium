<template>
    <Menu mode="horizontal" :theme="theme1"  @on-select="onMenuSelect">
        <MenuItem name="1"><Icon type="ios-paper" />新建界面</MenuItem>
        <MenuItem name="2"><Icon type="ios-people" />添加table</MenuItem>
		<MenuItem name="5"><Icon type="ios-people" />删除table</MenuItem>
        <MenuItem name="4"><Icon type="ios-construct" />添加echart</MenuItem>
		<MenuItem name="6"><Icon type="ios-people" />删除echart</MenuItem>
		 <Submenu name="3">
            <template slot="title"><Icon type="ios-stats" />测试菜单</template>
            <MenuGroup title="使用">
                <MenuItem name="3-1">新增和启动</MenuItem>
                <MenuItem name="3-2">活跃分析</MenuItem>
                <MenuItem name="3-3">时段分析</MenuItem>
            </MenuGroup>
            <MenuGroup title="留存">
                <MenuItem name="3-4">用户留存</MenuItem>
                <MenuItem name="3-5">流失用户</MenuItem>
            </MenuGroup>
        </Submenu>
    </Menu>
</template>
<script>
export default {
  name: 'AllMenu',
  porps:{
      addtable: String,
	  required: true
    },
  data: function () {
    return {
      theme1: 'light'
    }
  },
  methods: {
	onMenuSelect:function(name){
		if(name=='1'){
			this.$router.push("/newpage");
		}else if(name=='2'){
			console.log(this.addtable);
			this.$emit('success','Newtable');
		}else if(name=='5'){
			this.$emit('success','delt');
		}else if(name=='4'){
			this.$emit('success','Chart');
		}else if(name=='6'){
			this.$emit('success','dele');
		}
	}
  }
}
</script>
