<template>
  <div class="Atree" v-show="hide" v-drag>
    <div >

    
    <div id="title">
      <div>
        <Icon type="logo-buffer"></Icon>图层
      </div>
      <div @click="hidePanel">X</div>
    </div>
    <div  class="outer">
      <Tree
        :data="list"
        show-checkbox
        multiple
        id="tree"
        :on-reach-bottom="handleReachBottom"
      ></Tree>
    </div></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hide:true,
      list: [
        {
          title: "三维模型",
          expand: true,
          selected: false,
          children: [
            {
              title: "倾斜摄影",
              expand: true,
              children: [
                {
                  title: "厂房",
                  disabled: false
                },
                {
                  title: "文庙",
                  disabled: false
                },
                {
                  title: "学校",
                  disabled: false
                },
                {
                  title: "县城社区",
                  disabled: false
                },
                {
                  title: "工业园区",
                  disabled: false
                }
              ]
            },
            {
              title: "点云数据",
              expand: true,
              children: [
                {
                  title: "高压电线",
                  disabled: false
                }
              ]
            },
            {
              title: "人工建模",
              expand: true,
              children: [
                {
                  title: "水利闸门",
                  expand: true,
                  children: [
                    {
                      title: "整体",
                      disabled: false
                    },
                    {
                      title: "闸门",
                      disabled: false
                    }
                  ]
                },
                {
                  title: "油田联合站",
                  disabled: false
                },
                {
                  title: "储油厂",
                  disabled: false
                },
                {
                  title: "检查站",
                  disabled: false
                },
                {
                  title: "学校宿舍",
                  disabled: false
                },
                {
                  title: "地下网管",
                  disabled: false
                }
              ]
            },
            {
              title: "BIM模型",
              expand: true,
              children: [
                {
                  title: "教学楼",
                  expand: true,
                  children: [
                    {
                      title: "机电",
                      disabled: false
                    },
                    {
                      title: "建筑",
                      disabled: false
                    }
                  ]
                },
                {
                  title: "BIM分层",
                  expand: true,
                  children: [
                    {
                      title: "F4结构",
                      disabled: false
                    },
                    {
                      title: "F4建筑",
                      disabled: false
                    },
                    {
                      title: "F3结构",
                      disabled: false
                    },
                    {
                      title: "F3建筑",
                      disabled: false
                    },
                    {
                      title: "F2结构",
                      disabled: false
                    },
                    {
                      title: "F2建筑",
                      disabled: false
                    },
                    {
                      title: "F1结构",
                      disabled: false
                    },
                    {
                      title: "F1建筑",
                      disabled: false
                    }
                  ]
                },
                {
                  title: "桥梁",
                  disabled: false
                },
                {
                  title: "地铁口",
                  disabled: false
                },
                {
                  title: "幼儿园建筑",
                  disabled: false
                },
                {
                  title: "科技大楼",
                  disabled: false
                },
                {
                  title: "桥地下管网梁",
                  disabled: false
                }
              ]
            },
            {
              title: "城市白模",
              expand: true,
              children: [
                {
                  title: "上海市区",
                  disabled: false
                },
                {
                  title: "合肥市区",
                  disabled: false
                },
                {
                  title: "青岛市",
                  disabled: false
                }
              ]
            },
            {
              title: "gltf模型",
              expand: true,
              children: [
                {
                  title: "光伏电场",
                  disabled: false
                },
                {
                  title: "电线塔",
                  disabled: false
                }
              ]
            }
          ]
        },
        {
          title: "矢量数据",
          expand: true,
          selected: false,
          children: [
            {
              title: "KML数据",
              expand: true,
              children: [
                {
                  title: "省界线",
                  disabled: false
                },
                {
                  title: "国境线",
                  disabled: false
                },
                {
                  title: "海上安全警告",
                  disabled: false
                }
              ]
            },
            {
              title: "CZML数据",
              expand: true,
              children: [
                {
                  title: "船舶编队",
                  disabled: false
                },
                {
                  title: "飞行编队",
                  disabled: false
                },
                {
                  title: "汽车",
                  disabled: false
                }
              ]
            },
            {
              title: "ArcGIS Feature",
              expand: true,
              children: [
                {
                  title: "建筑物面",
                  disabled: false
                },
                {
                  title: "道路",
                  disabled: false
                },
                {
                  title: "兴趣点",
                  disabled: false
                }
              ]
            },
            {
              title: "GeoServer WFS",
              expand: true,
              children: [
                {
                  title: "教育设施点",
                  disabled: false
                },
                {
                  title: "建筑物面",
                  disabled: false
                }
              ]
            },
            {
              title: "GeoJSON数据",
              expand: true,
              children: [
                {
                  title: "体育设施点",
                  disabled: false
                },
                {
                  title: "省界线",
                  disabled: false
                },
                {
                  title: "安徽各市",
                  disabled: false
                },
                {
                  title: "建筑物面",
                  disabled: false
                }
              ]
            },
            {
              title: "平台标绘JSON",
              expand: true,
              children: [
                {
                  title: "示例数据",
                  disabled: false
                },
                {
                  title: "规划单元",
                  disabled: false
                }
              ]
            }
          ]
        },
        {
          title: "栅格数据",
          expand: true,
          selected: false,
          children: [
            {
              title: "ArcGIS Dynamic",
              expand: true,
              children: [
                {
                  title: "规划",
                  disabled: false
                },
                {
                  title: "建筑物",
                  disabled: false
                },
                {
                  title: "主要道路",
                  disabled: false
                }
              ]
            },
            {
              title: "ArcGIS 瓦片",
              expand: true,
              children: [
                {
                  title: "合肥规划图",
                  disabled: false
                }
              ]
            },
            {
              title: "OGC WMS服务",
              expand: true,
              children: [
                {
                  title: "规划面",
                  disabled: false
                },
                {
                  title: "建筑物面",
                  disabled: false
                },
                {
                  title: "道路线",
                  disabled: false
                },
                {
                  title: "教育设施点",
                  disabled: false
                }
              ]
            }
          ]
        },
        {
          title: "辅助图层",
          expand: true,
          selected: false,
          children: [
            {
              title: "经纬网",
              expand: true
            }
          ]
        },
        {
          title: "地形",
          expand: true,
          selected: false,
          children: [
            {
              title: "无地形",
              disabled: false
            },
            {
              title: "MarsGIS地形",
              disabled: false
            },
            {
              title: "官方全球地形",
              disabled: false
            }
          ]
        },
        {
          title: "地图底图",
          expand: true,
          selected: false,
          children: [
            {
              title: "天地图注记",
              disabled: false
            },
            {
              title: "单张图片",
              disabled: false
            },
            {
              title: "离线地图",
              disabled: false
            },
            {
              title: "灰色底图",
              disabled: false
            },
            {
              title: "黑色底图",
              disabled: false
            },
            {
              title: "街道图",
              disabled: false
            },
            {
              title: "OSM地图",
              disabled: false
            },
            {
              title: "天地图地形",
              disabled: false
            },
            {
              title: "天地图电子",
              disabled: false
            },
            {
              title: "天地图卫星",
              disabled: false
            },
            {
              title: "微软卫星",
              disabled: false
            },
            {
              title: "ArcGIS卫星",
              disabled: false
            },
            {
              title: "谷歌卫星",
              disabled: false
            }
          ]
        }
      ]
    };
  },
  methods: {
   hidePanel(){
     this.hide=false
   },
    handleReachBottom() {
      const last = this.list[this.list.length - 1];
      for (let i = 1; i < list.length; i++) {
        this.list.push(last + i);
      }
    }
  },
  directives:{
        drag(el){
            el.onmousedown = function(e){
                var disx = e.clientX - el.offsetLeft;
                var disy = e.clientY - el.offsetTop;
                document.onmousemove = function (e){
                    el.style.left = e.clientX - disx+'px';
                    el.style.top = e.clientY - disy+'px';
                }
                document.onmouseup = function(){
                    document.onmousemove = document.onmouseup = null;
                }
            }
        },
    }
};
</script>
<style scoped>
.Atree{
  border:1px solid rgb(126, 169, 224)   ;
  background-color:gray; 
  background-color: rgba(0, 0, 0, 0.5); 
   width:260px;
}
/* 顶部样式 */
#title {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  border-bottom: 1px solid rgb(126, 169, 224);
  width: 260px;
  padding: 5px;
  color:#fff;
  cursor: pointer;
}
/* 树结构的样式 */
#tree {
  overflow-y: scroll;
  height:800px;
  width:260px;
  color: #fff
}
/* 外层div的样式 */
.outer{
    overflow: hidden;
    width: 240px; color:#fff
}
 
 /* 字体颜色修改 */
 /deep/ .ivu-tree-title{
   color:#fff !important
 }
</style>