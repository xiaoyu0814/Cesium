import Vue from 'vue'
import Router from 'vue-router'
import Load from '@/pages/load/index'
import Index from '@/pages/Index'
import IndexPage from '@/components/IndexPage'

//测试显示组件用日后删除  
import Classification from '@/components/tools/Classification'
import Left from '@/components/tools/Left'
// import Test from "@/components/layer/components/LineStyle"
import Test from "@/components/layer/HomePage"
import dataSetList from '@/components/dataset/dataSetList'
import CreateVectorLayer from '@/components/layer/CreateVectorLayer'
import AddDataSet from '@/components/layer/dataSet/AddDataSet'//添加数据集
import SqlQuery from '@/components/layer/dataSet/SqlQuery'
Vue.use(Router)

export const appRouter = new Router({
  routes: [
    {
      path: '/login',
      name: 'Load',
      component: Load
    },
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage,
    },
    {
      path: '/Classification',
      name: 'Classification',
      component: Classification
    },
    //显示rn组件用，日后删除
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/dataSetList',
      name: 'dataSetList',
      component: dataSetList
    },
    {
      path: '/Left',
      name: 'Left',
      component: Left
    },
    {
      path: "/CreateVectorLayer",
      name: "CreateVectorLayer",
      component: CreateVectorLayer
    },
    // 添加数据集
    {
      path: '/AddDataSet',
      name: "AddDataSet",
      component: AddDataSet,
    },
    //SQL query
    {
      path:'/SqlQuery',
      name:"SqlQuery",
      component:SqlQuery
    }
  ]
})
