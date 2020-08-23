<template>
  <div class="main-wrap">
    <div class="main-left">
      <el-menu
       default-active="/users"
       background-color="#364258"
       text-color="#fff"
       active-text-color="#ffd04b"
       @select="selectMenu"
       >
        <div class="logo-wrap">后台管理系统</div>
        <nav-menu v-for='menu in menuData' :key='menu.name' :menu='menu'>

        </nav-menu>
      </el-menu>
    </div>
    <div class="main-right">
      <div class="topbar"></div>
      <div class="right-wrap">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import NavMenu from '@/components/NavMenu';
export default {
  name: 'Home',
  components: {
    NavMenu
  },
  data() {
    return {
      menuData: []
    }
  },
  created() {
    this.getMenus();
  },
  methods: {
    async getMenus() {
      await this.$axios({
        method: 'get',
        url: '/api/v1/menus'
      }).then(res => {
        res.data.data.shift();
        this.menuData = res.data.data;
        console.log(this.menuData)
      })
    },
    selectMenu(index) {
      this.$router.push('/home' + index);
    }
  }
}
</script>

<style scoped lang = "less">
  .main-wrap {
    height: 100%;
    overflow: hidden;
  }
  .main-left {
    height: 100%;
    width: 200px;
    float: left;
  }
  .el-menu {
    height: 100%;
    padding: 20px 0px;
  }
  .main-right {
    height: 100%;
    width: calc(100% - 200px);
    float: left;
  }
  .logo-wrap {
    font-size: 18px;
    color: #fff;
    padding: 20px;
  }
  .topbar {
    height: 54px;
    background-color: #F8F9FA;
    border-bottom: 1px solid #eee;
  }
  .right-wrap {
    height: calc(100% - 54px);
  }
</style>