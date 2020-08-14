<template>
  <div class="main-wrap">
    <div class="main-left">
      <el-menu
       :default-active="activeMenu"
       background-color="#364258"
       text-color="#fff"
       active-text-color="#ffd04b">
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
      menuData: [],
      activeMenu: '2'
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
    }
  }
}
</script>

<style scoped lang = "less">
  .main-wrap {
    height: 100%;
  }
  .main-left {
    height: 100%;
    width: 200px;
  }
  .el-menu {
    height: 100%;
    padding: 20px 0px;
  }
</style>