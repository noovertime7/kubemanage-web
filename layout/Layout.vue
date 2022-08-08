<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-aside class="aside" :width="asideWidth">
        <el-affix class="aside-affix" :z-index="1200">
          <div class="aside-logo">
            <el-image class="logo-image" :src="logo" />
            <span :class="[isCollapse ? 'is-collapse' : '']">
              <span class="logo-name">Kubernetes</span>
            </span>
          </div>
        </el-affix>
<!--        使用vue-router模式，index就是path-->
        <el-menu class="aside-menu"
                  router
                 :default-active="$route.path"
                 :collapse="isCollapse"
                 background-color="#121b27"
                 text-color="#bfcdb9"
                 active-text-color="#20a0ff"
        >
          <div v-for="menu in routers" :key="menu">
            <el-menu-item class="aside-menu-item" v-if="menu.children && menu.children.length === 1" :index="menu.children[0].path">
              <el-icon><component :is="menu.children[0].icon" /></el-icon>
              <template #title>{{menu.children[0].name}}</template>
            </el-menu-item>
            <el-sub-menu class="aside-submenu" v-else-if="menu.children && menu.children.length  > 1" :index="menu.path">
              <template #title>
                <el-icon><component :is="menu.icon" /></el-icon>
                <span :class="[isCollapse ? 'is-collapse' : '']">{{menu.name}}</span>
              </template>
<!--              子菜单-->
              <el-menu-item class="aside-menu-childitem" v-for="child in menu.children" :key="child" :index="child.path" >
                <template #title>{{child.name}}</template>
              </el-menu-item>
            </el-sub-menu>
          </div>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <el-row :gutter="20">
            <el-col :span="1" >
              <div class="header-collapse" @click="onCollapse">
                <el-icon><component :is="isCollapse ? 'expand':'fold' "/></el-icon>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="header-breadcrumb" >
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item :to="{path : '/'}">工作台</el-breadcrumb-item>
                  <template v-for="(matched,m) in this.$route.matched" :key="m">
                    <el-breadcrumb-item v-if="matched.name !== undefined">
                      {{matched.name}}
                    </el-breadcrumb-item>
                  </template>
                </el-breadcrumb>
              </div>
            </el-col>
            <el-col class="header-menu" :span="13">
              <el-dropdown>
                <div class="header-dropdown">
                <el-image class="avator-image" :src="auator" />
                <span>{{username}}</span>
                </div>
<!--                下拉内容-->
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="logout">退出</el-dropdown-item>
                    <el-dropdown-item @click="changepwd">修改密码</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </el-row>
          </el-header>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
        <el-footer class="footer">
          <el-icon style="width: 2em;top: 3px;font-size: 18px"><place/></el-icon>
          <a class="footer el-icon-place">2022 adoo devops</a>
        </el-footer>
        <el-backtop target=".el-main"></el-backtop>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import  { useRouter } from 'vue-router'
export default {
  data() {
    return {
      auator: require('@/assets/avator/avator.png'),
      logo: require('@/assets/k8s/logo.png'),
      isCollapse: false,
      // 导航栏宽度
      asideWidth : '220px',
      routers: [],
    }
  },
  computed: {
    username() {
      let username = localStorage.getItem("username");
      return username ? username : 'unknown'
    }
  },
  methods: {
    onCollapse() {
      if (this.isCollapse) {
        this.asideWidth = '220px'
        this.isCollapse = false
      }else  {
        this.asideWidth = '64px'
        this.isCollapse = true

      }
    },
    logout() {
      localStorage.removeItem("username")
      localStorage.removeItem("token")
      this.$route.push('/login')
    },
    changepwd() {
      alert('changepwd')
    }
  },
  beforeMount() {
    this.routers = useRouter().options.routes
    console.log(this.routers)
  }
}
</script>

<style scoped>
 .aside{
   transition: all;
   background-color: #131b27;
 }
 .aside-logo{
   background-color: #131b27;
   height: 60px;
   color: white;
 }
 .logo-image {
   width: 40px;
   height: 40px;
   top: 12px;
 }
 .logo-name {
   font-size: 20px;
   font-weight: bold;
   padding: 10px;
 }
 /*滚动条不展示*/
 .aside::-webkit-scrollbar {
   display: none;
 }
 /*底边框与有边框都是0*/
 .aside-affix {
   border-bottom-width: 0;
 }
 .aside-menu {
   border-right-width: 0;
 }
 .aside-menu-item.is-active {
   background-color: #1f2a3a;
 }
 .aside-menu-item {
   padding-left: 20px !important;
 }
 .aside-menu-item:hover {
    background-color: #142c4e;
 }
 .aside-menu-childitem {
   padding-left: 40px !important;
 }
 .aside-menu-childitem.is-active {
   background-color: #1f2a3a;
 }
 .aside-menu-childitem:hover {
   background-color: #142c4e;
 }
 .header {
   z-index: 1200;
   line-height: 60px;
   font-size: 24px;
   box-shadow: 0 2px 4px rgba(0,0,0, .12),0 0 6px rgba(0,0,0, .04);
 }
 .header-collapse {
   cursor: pointer;
 }
 /*面包屑*/
 .header-breadcrumb {
   padding-top: 0.9em;
 }
 /*用户信息靠右*/
 .header-menu {
   text-align: right;
 }
 /*折叠属性*/
 .is-collapse {
   display: none;
 }
 /*用户信息下拉框*/
 .header-dropdown{
   line-height: 60px;
   cursor: pointer;
 }
 /*头像*/
 .avator-image {
   top: 12px;
   width: 40px;
   height: 40px;
   border-radius: 50%;
   margin-right: 8px;
 }
 .main {
   padding: 10px
 }
 .footer {
   z-index: 1200;
   color: rgb(187,184,184);
   font-size: 14px;
   text-align: center;
   line-height: 60px;
 }
</style>