<template>
  <div id="app">
    <Spin class="m_global_loading" v-if="loadCount > 0">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>加载中...</div>
    </Spin>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['loadCount']),
  },
}


</script>

<style>
#app {
  width:100%;
  height: 100%;
  
}
.m_global_loading {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
</style>
