<template>
  <div id="login" class="login-container">
    <div class="logintop">
      <!-- <div class="title">新冠疫情多尺度智能监测预警系统</div> -->
      <div class="title">传染疾病精准防控与智能分析系统</div>
      <!-- <div class="titleEng">Epidemic Big Data Monitoring Intelligent Analysis system</div> -->
      <div class="titleEng">
        Precise prevention and control of infectious diseases and intelligent
        analysis system
      </div>
      <div class="titleButton" @click="login()">进 入</div>
    </div>
    <div class="loginbody">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <i class="el-icon-back back" @click="back()" />
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="off"
          />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="off"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
        <el-button type="primary" class="public" @click="handleLogin(0)"
          >登录</el-button
        >
      </el-form>
    </div>
    <video id="bgvid" muted autoplay loop>
      <source src="./public/LoginBackground.mp4" type="video/mp4" />
    </video>
  </div>
</template>

<script>
import {
  validUsername,
  validEmail,
  validTelephone,
  validLetter,
  validPassword,
} from "@/utils/validate";
import { Message } from "element-ui";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (
        !validUsername(value) &&
        !validEmail(value) &&
        !validTelephone(value) &&
        !validLetter(value)
      ) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin@admin.com",
        password: "aaaaaa",
        system: 0,
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  mounted() {
    const lis = document.querySelectorAll(".login li");
    for (var i = 0; i < lis.length; i++) {
      lis[i].addEventListener("mouseover", function () {
        for (var j = 0; j < lis.length; j++) {
          lis[j].classList.remove("xuan");
        }
        this.classList.add("xuan");
      });
    }
  },
  created() {
    setTimeout(function () {
      document.getElementById("login").style.display = "block";
    }, 100);
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin(data) {
      this.loginForm.system = data;
      if (this.loginForm.username === "") {
        Message({
          showClose: true,
          message: "请输入账号！",
          type: "warning",
          duration: 3 * 1000,
        });
      } else if (this.loginForm.password === "") {
        Message({
          showClose: true,
          message: "请输入密码！",
          type: "warning",
          duration: 3 * 1000,
        });
      } else {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            this.$store
              .dispatch("user/login", this.loginForm)
              .then(() => {
                document.getElementById("login").style.display = "none";
                this.$router.push({ path: this.redirect || "/" });
                this.loading = false;
                var data = [
                  { name: "滁州市", where: 2, code: 341100 },
                  { name: "南京市", where: 2, code: 320100 },
                  { name: "陕西省", where: 1, code: 610000 },
                  { name: "上海市", where: 1, code: 310000 },
                  { name: "深圳市", where: 2, code: 440300 },
                  { name: "琅琊区", where: 3, code: 341102 },
                ]; // 创建值
                window.localStorage.setItem("city", JSON.stringify(data)); // 写入值
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            console.log("提交时出错!!");
            return false;
          }
        });
      }
    },
    login() {
      const logintop = document.getElementsByClassName("logintop")[0];
      const titleButton = document.getElementsByClassName("titleButton")[0];
      const loginbody = document.getElementsByClassName("loginbody")[0];
      // 上部
      logintop.style.paddingTop = "60px";
      logintop.style.left = "0";
      logintop.style.transform = "translate(0)";
      logintop.style.transition = "all 1.5s";
      titleButton.style.display = "none";
      // 下部
      loginbody.style.transform = "translate(0, 0)";
    },
    back() {
      const logintop = document.getElementsByClassName("logintop")[0];
      const titleButton = document.getElementsByClassName("titleButton")[0];
      const loginbody = document.getElementsByClassName("loginbody")[0];
      // 上部
      logintop.style.paddingTop = "250px";
      logintop.style.left = "50%";
      logintop.style.transform = "translate(-50%, 0)";
      logintop.style.transition = "all 1.5s";
      titleButton.style.display = "block";
      titleButton.style.animation = "fade-in";
      titleButton.style.animationDuration = "1.5s";
      titleButton.style.webkitAnimation = "fade-in 1.5s";
      // 下部
      loginbody.style.transform = "translate(0, 100vh)";
    },
  },
};
</script>

<style lang="scss">
@import "./public/css/index.css";
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

@font-face {
  src: url("./public/font/Microsoft-YaHei.ttf");
  font-family: "MicrosoftYaHei";
}

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      font-size: 18px !important;
      font-family: "MicrosoftYaHei" !important;
      font-weight: bold !important;
      ::-ms-clear,
      ::-ms-reveal {
        display: none;
      }

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .titleEng {
    margin-left: 30px;
  }

  .el-form-item {
    border-bottom: 3px solid rgb(255, 255, 255);
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 350px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 15px;
    color: #ffffff;
    // vertical-align: middle;
    width: 55px;
    display: inline-block;
    text-align: center;
    font-size: 25px;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
<style scoped>
#login {
  display: none;
}
</style>
