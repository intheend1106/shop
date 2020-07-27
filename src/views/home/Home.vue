<!--  -->
<template>
  <div id="home">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="~assets/img/heima.png" alt />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出登录</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px':'200px'">
          <!-- 添加折叠 -->
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
            unique-opened
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="$route.path"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <!-- 一级图标 -->
                <i :class="iconFonts[item.id]"></i>
                <!-- 一级文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
              >
                <!-- @click="saveNavState('/'+subItem.path)" -->
                <template slot="title">
                  <!-- 二级图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 二级文本 -->
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右边内容主体部分 -->
        <el-main>
          <!-- 添加路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconFonts: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    };
  },
  created() {
    this.getMenuList();
    // this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    // 获取所有的菜单
    getMenuList() {
      this.$http.get('menus').then(res => {
        console.log(res.data);
        if (res.data.meta.status !== 200) return;
        const data = res.data;
        this.menuList = data.data;
      });
    },
    // 点击按钮，左侧边栏折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
    // // 保存链接的激活状态
    // saveNavState(activePath) {
    //   window.sessionStorage.setItem('activePath', activePath);
    //   this.activePath = window.sessionStorage.getItem('activePath');
    // }
  }
};
</script>

<style  scoped>
#home {
  height: 100%;
}
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  height: 60px;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  color: #fff;
  font-size: 20px;
  margin-left: 10px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: 0;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
