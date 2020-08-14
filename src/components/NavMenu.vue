<template>
    <div>
        <el-submenu v-if='menu.children' :index='menu.id + ""'>
            <template slot='title'>
                <i class="el-icon-menu"></i>
                <span>{{menu.name}}</span>
            </template>
            <nav-menu v-for='menuChild in menu.children' :key='menuChild.name' :menu='menuChild'></nav-menu>
        </el-submenu>
        <el-menu-item v-if='!menu.children' :index='menu.id + ""'>
            <template slot='title'>
                <i class="el-icon-menu"></i>
                <span>{{menu.name}}</span>
            </template>
        </el-menu-item>
    </div>
</template>

<script>
import NavMenu from '@/components/NavMenu';
export default {
    name: 'NavMenu',
    components: {
        NavMenu
    },
    props: ['menu'],
    data() {
        return {
            activePath: ''
        }
    },
    created() {
        this.activePath = this.menu.url;
    },
    methods: {
        showView() {
            
        }
    }
}
</script>

<style scoped lang = "less">
  
</style>