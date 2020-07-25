<!--  -->
<template>
  <div class="login">
    <div class="login_box">
      <div class="login_logo">
        <img src="~assets/img/logo.png" alt />
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <!-- m密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { getLogindata } from 'network/login';

export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 点击按钮，重置登录表单,恢复到默认设置
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(valid => {
        console.log(valid);
        if (!valid) return;
        this.$http.post('login', this.loginForm).then(res => {
          console.log(res.data);
          if (res.data.meta.status !== 200) return this.$message.error('登陆失败');
          this.$message.success('登录成功');
          // 设置sessionStorage
          window.sessionStorage.setItem('token', res.data.data.token);
          //跳转到路由
          this.$router.push('/home');
        });

        // getLogindata(this.loginForm).then(res => {
        //   console.log(res.data);
        // });
      });
    }
  }
};
</script>

<style  scoped>
.login {
  background-color: #2b4b6b;
  width: 100%;
  height: 100%;
  position: relative;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login_logo {
  width: 130px;
  height: 130px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  /* top: -50%; */
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
.login_logo img {
  width: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
