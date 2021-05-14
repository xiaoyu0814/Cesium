<template>
  <div class="iview-bg">
    <!-- 账号登录 -->
    <div class="iview-loginwrap" v-show="numberLoad">
      <div class="title">
        <b>账号登陆</b>
      </div>
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="user" class="iview-formitem">
          <i-input
            type="text"
            v-model="formInline.user"
            placeholder="请输入用户名"
            class="iview-form-inp"
            size="large"
          >
            <Icon type="ios-person" slot="prepend" size="22"></Icon>
          </i-input>
        </FormItem>
        <FormItem prop="password" class="iview-formitem">
          <i-input
            type="password"
            v-model="formInline.password"
            placeholder="请输入密码"
            class="iview-form-inp"
            size="large"
          >
            <Icon type="ios-lock" slot="prepend" size="22"></Icon>
          </i-input>
        </FormItem>
        <FormItem class="iview-formitem">
          <Button type="primary" @click="handleSubmit('formInline')" long class="iview-loginbtn">登录</Button>
        </FormItem>
      </Form>
      <div class="chooseways">
        <small>选择其他方式登录</small>
      </div>
      <div class="phone_load" @click="numberLoadingShow">
        <button>
          <span class="icon">
            <Icon type="md-phone-portrait" style="color:yellow;font-size:22px;" />
          </span>
          <span class="phone">手机登录</span>
        </button>
      </div>
    </div>
    <!-- 手机登录 -->
    <div class="iview_login" v-show="phoneLoaded">
      <div class="title">
        <b>手机登陆</b>
      </div>
      <div class="phonenumber">
        <span class="phone_img">
          <Icon type="md-phone-portrait" size="22" />
        </span>
        <input type="text" placeholder="请输入手机号" v-model="getPhoneValue" />
      </div>
      <div class="code_content">
        <div class="code">
          <input type="text" placeholder="请输入验证码" v-model="getVerificCode" />
        </div>
        <div class="getcode" @click="getVerificationCode">获取验证码</div>
      </div>
      <div class="loading" @click="VerificationCodeLoading">登录</div>
      <div class="chooseways_two">
        <small>选择其他方式登录</small>
      </div>
      <div class="account_login" @click="phoneLoadingShow">
        <button>
          <span class="icon">
            <Icon type="ios-person" slot="prepend" color="#007aff" size="22"></Icon>
          </span>
          <span class="phone">账号登录</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { get, post } from "../../api/load.js";
export default {
  name: "Load",
  data() {
    // var Usernamerule = /^[a-zA-Z0-9_-]{4,8}$/;   //用户名正则，4到16位（字母，数字，下划线，减号)
    const validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("用户名不能为空"));
      }
      // else if (Usernamerule.test(value)==false) {
      //     callback(new Error('用户名格式不正确'));
      // }
      else {
        callback();
      }
    };
    // var Passwordrule=/^(\w){6,20}$/;    //密码强度正则，只能输入6-20个字母、数字、下划线
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      }
      //  else if (Passwordrule.test(value)==false) {
      //     callback(new Error('密码格式不正确'));
      // }
      else {
        callback();
      }
    };
    return {
      formInline: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [{ validator: validateUser, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }]
      },
      numberLoad: false,
      phoneLoaded: true,
      getPhoneValue: "", //获取手机号input值
      getVerificCode: "" //获取验证码的值
    };
  },
  methods: {
    //  登录方法没有用vuex触发
    handleSubmit(name) {
      let url = "http://cloud.piesat.cn/dev/account/api/auth/login";
      let param = {
        username: this.formInline.user,
        password: this.formInline.password
      };
      get(url, param).then(data => {
        if (data.success) {
          let res = data.data;
          window.localStorage.setItem("token", res.token);
          window.localStorage.setItem("userName", res.userData.userName);
          window.localStorage.setItem("userId", res.userData.userId);
          this.$router.push("/");
        } else {
          this.$Message.info(data.message);
        }
      });
    },
    // 账号登录界面变为手机多么登录界面
    numberLoadingShow() {
      this.phoneLoaded = !this.phoneLoaded;
      this.numberLoad = !this.numberLoad;
    },
    // 手机登录界面变为账号登录界面
    phoneLoadingShow() {
      this.phoneLoaded = !this.phoneLoaded;
      this.numberLoad = !this.numberLoad;
    },
    //获取验证码
    getVerificationCode() {
      let url = "http://cloud.piesat.cn/dev/account/api/auth/checkExists";
      let param = {
        tel: this.getPhoneValue
      };
      get(url, param).then(data => {
        if (data.success) {
          this.$Message.info(data.message);
          let path = "http://cloud.piesat.cn/dev/account/api/auth/getCodeByTel";
          get(path, param).then(data => {
            if (data.success) {
              this.$Message.info(data.message);
            } else {
              this.$Message.error("系统报错" + data.message);
            }
          });
        } else {
          this.$Message.error("不能获取验证码的原因是：" + data.message);
        }
      });
    },
    //手机号码登录
    VerificationCodeLoading() {
      let url = "http://cloud.piesat.cn/dev/account/api/auth/checkTelWithCode";
      let param = {
        tel: this.getPhoneValue,
        captcha: this.getVerificCode
      };
      console.log(param);
      get(url, param).then(data => {
        if (data.success) {
          console.log("手机号和验证码匹配成功");
          this.$router.push("/");
        } else {
          this.$Message.error("验证码已过期");
        }
      });
    }
  },
  mounted: function() {}
};
</script>
<style scoped>
html,
body {
  height: 100%;
}
.iview-bg {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/bg2.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}
.iview-loginwrap,
.iview_login {
  width: 450px;
  height: 400px;
  padding: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -225px;
  border: 1px solid #cccccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.8);
}
.iview-loginwrap .title,
.iview_login .title {
  width: 100%;
  text-align: center;
  font-weight: 300;
  line-height: 1.7;
  font-size: 16px;
  margin-bottom: 16px;
}
.title b {
  font-size: 18px;
}
.iview-loginbtn {
  width: 200px;
  height: 40px;
  font-size: 16px;
  text-align: center;
  letter-spacing: 50px;
  padding-left: 65px;
  margin: 20px 100px 0px 100px;
}
.chooseways,
.chooseways_two {
  width: 100%;
  text-align: center;
  font-weight: 300;
  line-height: 1.5;
  font-size: 16px;
  margin-bottom: 16px;
}
.phone_load,
.account_login {
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-radius: 0.25rem;
}
.phone_load button,
.account_login button {
  display: block;
  text-align: center;
  width: 100%;
  height: 50px;
  line-height: 40px;
  padding: 5px 20px;
  border-radius: 0.25rem;
  background-color: #fff;
  border: 1px solid #fff;
}
.phone_load span,
.account_login span {
  display: inline-block;
}
.phone_load .icon,
.account_login .icon {
  width: 20px;
  height: 20px;
  margin-right: 7px;
}
.phone_load .phone,
.account_login .phone {
  font-size: 16px;
  color: #007aff;
}
.phonenumber {
  width: 100%;
  height: 40px;
  /* padding: 5px 0px 5px 3px; */
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 0.25rem;
  transition: all 0.2s;
}
.phone_img {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 10px;
}
.phonenumber input {
  float: right;
  width: 90%;
  height: 40px;
  line-height: 30px;
  color: #8898aa;
  font-size: 14px;
  border: #fff;
  border-radius: 0.25rem;
}
.code_content {
  position: relative;
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  border-radius: 0.25rem;
}
.code {
  width: 62%;
  height: 40px;
  background-color: #fff;
  border-radius: 0.25rem;
  transition: all 0.2s;
}
.code input {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #8898aa;
  font-size: 14px;
  border: #fff;
  border-radius: 0.25rem;
}
.getcode {
  position: absolute;
  right: 0px;
  top: 1px;
  float: right;
  width: 35%;
  height: 38px;
  line-height: 38px;
  font-size: 14px;
  text-align: center;
  color: white;
  background-color: #007aff;
  border-radius: 0.25rem;
  cursor: pointer;
}
.loading {
  width: 50%;
  height: 40px;
  padding-left: 50px;
  line-height: 40px;
  text-align: center;
  letter-spacing: 50px;
  font-size: 16px;
  margin-top: 40px;
  margin-left: 25%;
  background-color: #007aff;
  border-radius: 0.25rem;
  color: white;
  cursor: pointer;
}
.chooseways_two {
  margin-top: 24px;
}
</style>
