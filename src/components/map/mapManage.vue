<template>
  <div id="mapManage">
    <div class="creatBtn">
      <Button type="primary" @click="modal_show=true">新建地图</Button>
    </div>
    <div class="second">
      <Input v-model="searchText" placeholder="关键字搜索" />
    </div>
    <div class="map_list">
      <ul id="ul">
        <li
          v-for="(item,index) in typeList"
          :key="index"
          @click.self="selectMap(item)"
          :class="{active: item.id == currentMapId}"
        >
          {{item.name}}
          <Poptip content="content" placement="right" class="Poptip" trigger="hover">
            <Button class="more">
              <Icon type="ios-more" />
            </Button>
            <div
              class="tips-item"
              slot="content"
              v-for="(more_item,index) in more_list"
              :key="index"
              @click.stop.prevent="showComponents(more_item.value, item)"
            >
              <div>{{more_item.name}}</div>
            </div>
          </Poptip>
        </li>
      </ul>
    </div>
    <Modal
      v-model="modal_show"
      title="新建地图"
      @on-ok="createMapORsaveMap"
      @on-cancel="cancel"
      width="300"
    >
      <table class="createMap_table">
        <tr>
          <td>地图名称</td>
          <td>
            <Input v-model="mapName" placeholder="请输入" />
          </td>
        </tr>
        <tr>
          <td>公开</td>
          <td>
            <Checkbox v-model="publicly"></Checkbox>
          </td>
        </tr>
        <tr>
          <td>描述</td>
          <td>
            <Input
              v-model="describe"
              :maxlength="100"
              show-word-limit
              type="textarea"
              placeholder="请输入"
            />
          </td>
        </tr>
      </table>
    </Modal>
  </div>
</template>
<script>
import { get, post } from "@/api/load";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      mapName: "",
      publicly: false,
      describe: "",
      setUp: false,
      modal_show: false,
      searchText: "",
      typeList: [
        {
          name: "暂无数据"
        }
      ],
      more_list: [
        {
          name: "移除",
          value: "delete"
        },
        {
          name: "设置",
          value: "setup"
        }
        // {
        //   name: "分享",
        //   value: "share"
        // }
      ]
    };
  },
  computed: {
    ...mapGetters(['currentMapId'])
  },
  mounted() {
    this.getMapInfo();
    $("#ul").niceScroll({
            cursorcolor: "#424242", // 改变滚动条颜色，使用16进制颜色值
            cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
            cursoropacitymax: 1, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
            cursorwidth: "7px", // 滚动条的宽度，单位：便素
            cursorborder: "1px solid #006DE4", // CSS方式定义滚动条边框
            cursorborderradius: "5px", // 滚动条圆角（像素）
            scrollspeed: 60, // 滚动速度
            mousescrollstep: 40, // 鼠标滚轮的滚动速度 (像素)
            touchbehavior: false, // 激活拖拽滚动
            hwacceleration: true, // 激活硬件加速
            boxzoom: false, // 激活放大box的内容
            dblclickzoom: true, // (仅当 boxzoom=true时有效)双击box时放大
            gesturezoom: true, // (仅 boxzoom=true 和触屏设备时有效) 激活变焦当out/in（两个手指外张或收缩）
            grabcursorenabled: true, // (仅当 touchbehavior=true) 显示“抓住”图标display "grab" icon
            autohidemode: true, // 隐藏滚动条的方式, 可用的值:
        });
  },
  watch: {
    searchText() {
      this.search();
    }
  },
  methods: {
    ...mapActions(["setCurrentMapId"]),
    cancel() {
      this.mapId = "";
      this.mapName = "";
      this.publicly = false;
      this.describe = "";
    },
    selectMap(item) {
      this.setCurrentMapId(item.id);
      this.$store.state.mapName = item.name;
      this.$parent.Selection("layer");
    },
    showComponents(value, item) {
      switch (value) {
        case "delete":
          this.deleteMap(item);
          break;
        case "setup":
          this.setUpMap(item);
          break;
        case "share":
          break;
        case "detail":
          break;
        default:
          break;
      }
    },
    search() {
      if (this.searchText != "") {
        var num = 0;
        for (var i = 0; i < this.typeList.length; i++) {
          if (this.typeList[i].name.indexOf(this.searchText) == -1) {
            $(".map_list li")
              .eq(i)
              .hide();
            num++;
            if (num == this.typeList.length) {
              this.$Message.error("未查询出结果");
            }
          }
        }
      } else {
        for (var i = 0; i < this.typeList.length; i++) {
          $(".map_list li")
            .eq(i)
            .show();
        }
      }
    },
    getMapInfo() {
      let self = this;
      let url = this.$interfacePath.map.getMapInfoByUserID;
      let param = {
        userID: window.localStorage.getItem("userId")
      };
      if (!window.localStorage.getItem("userId")) {
        this.$Message.error("请登录后再试");
      }
      get(url, param).then(data => {
        if (data.code === 0) {
          self.typeList = data.data;
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    createMapORsaveMap() {
      let self = this;
      let url;
      if (this.setUp) {
        url = this.$interfacePath.map.saveMap+`/${this.mapId}`;
      } else {
        url = this.$interfacePath.map.createMap;
      }
      let param = {
        description: this.describe,
        is_public: this.publicly ? 1 : 0,
        name: this.mapName,
        user_id: window.localStorage.getItem("userId")
      };
      post(url, param).then(data => {
        if (data.code === 0) {
          self.getMapInfo();
          self.setUp = false;
          self.mapId = "";
          self.mapName = "";
          self.publicly = false;
          self.describe = "";
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    deleteMap(item) {
      let self = this;
      let url = this.$interfacePath.map.deleteMap;
      let param = {
        mapID: item.id
      };
      get(url, param).then(data => {
        if (data.code === 0) {
          this.$Message.info(data.message);
          self.getMapInfo();
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    setUpMap(item) {
      let self = this;
      let url = this.$interfacePath.map.getMapInfoByMapID;
      let param = {
        mapID: item.id
      };
      get(url, param).then(data => {
        if (data.code === 0) {
          self.modal_show = true;
          self.setUp = true;
          self.mapId = item.id;
          self.mapName = data.data.name;
          self.publicly = data.data === 1 ? true : false;
          self.describe = data.data.description;
        } else {
          this.$Message.error(data.message);
        }
      });
    }
  }
};
</script>
<style scoped>
#mapManage {
  position: absolute;
  top: 0;
  left: 80px;
  height: 100%;
  background-color: #00000099;
  padding: 10px;
  border-left: 2px solid #fff;
  color: #fff;
}
.creatBtn {
  height: 50px;
  padding: 10px;
}
.second {
  padding: 0 10px;
}
.map_list {
  padding: 10px;
  height: calc(100% - 90px);
}
.map_list ul {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.map_list ul .active {
  background: #007AFF;
}
.map_list ul li {
  padding: 5px;
  border-bottom: 1px solid #ccc;
  /* width: 300px; */
  height: 50px;
  line-height: 50px;
}
.map_list .more {
  font-size: 20px;
  padding: 0;
  height: 0;
  border: none;
  color: #fff;
  vertical-align: baseline;
}
.map_list .more:focus {
  box-shadow: none;
}
.Poptip {
  float: right;
  height: 20px;
}
.tips-item {
  color: #000;
  padding: 5px;
  cursor: pointer;
}
.createMap_table {
  width: 100%;
}
.createMap_table tr td:first-child {
  text-align: right;
  padding-right: 10px;
  width: 70px;
}
</style>
<style>
#mapManage .ivu-poptip-popper {
  min-width: auto;
}
</style>