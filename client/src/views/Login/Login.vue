<template>
  <div class="login w-full h-full flex-center flex-col min-h-574px lt-md:(text-14px!)">
    <ul class="bg-bubbles">
      <li v-for="i in 10" :key="i"></li>
    </ul>

    <img class="w-288px lt-md:(w-188px)" src="@/assets/images/login-logo.png" />
    <div
      class="text-[--el-color-info-light-8] mt-11px mb-39px text-center px-6px leading-[1.5] lt-lg:(mb-16px)">
      青春须早为，岂能长少年！
    </div>

    <!-- 登录窗口 -->
    <Motion v-if="flag === 'login'">
      <section class="login-form-wrap card-wrap">
        <el-tabs v-model="activeName" @tab-click="handleClickTab">
          <el-tab-pane
            v-for="(item, index) in tabList"
            :key="index"
            :label="item.label"
            :name="item.type">
          </el-tab-pane>
        </el-tabs>

        <Sms v-if="activeName === 'sms'" />
        <Pwd v-if="activeName === 'pwd'" @onSwitch="onSwitch" />

        <Motion :delay="0.4" name="wipe-fade-bottom-top">
          <el-divider class="my-28px!">
            <div class="text-center text-[--el-color-info-light-3]">其他方式登录</div>
          </el-divider>
        </Motion>
        <Motion :delay="0.5" name="wipe-fade-bottom-top">
          <div class="flex mt-30px mb-16px px-85px justify-around lt-md:(px-36px)">
            <div class="w-56px h-56px rounded-50% bg-[--el-fill-color] flex-center cursor-pointer">
              <img class="w-32px h-32px" src="@/assets/images/qq.png" alt="" />
            </div>
            <div class="w-56px h-56px rounded-50% bg-[--el-fill-color] flex-center cursor-pointer">
              <img class="w-32px h-32px" src="@/assets/images/wechat.png" alt="" />
            </div>
          </div>
        </Motion>
      </section>
    </Motion>

    <!-- 注册窗口 -->
    <Register @onBack="onSwitch" v-if="flag === 'register'" />
    <!-- 忘记密码窗口 -->
    <Update @onBack="onSwitch" v-if="flag === 'update'" />
  </div>
</template>

<script setup lang="ts">
import Register from './components/Register.vue'
import Update from './components/Update.vue'
import Sms from './components/Sms.vue'
import Pwd from './components/Pwd.vue'
import { TabsPaneContext } from 'element-plus'

const activeName = ref('pwd')
const flag = ref('login')
const tabList = [
  {
    label: '短信登录',
    type: 'sms'
  },
  {
    label: '密码登录',
    type: 'pwd'
  }
]

// * 点击切换tab标签
const handleClickTab = (pane: TabsPaneContext) => {
  activeName.value = pane.props.name as string
}

// * 点击切换注册窗口
const onSwitch = (f: string) => {
  flag.value = f
}
</script>

<style lang="scss">
@import url('./index.scss');
</style>

<style lang="scss" scoped>
.el-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 28px !important;
  }
  :deep(.el-tabs__nav-wrap) {
    &::after {
      background-color: transparent;
    }

    .el-tabs__nav {
      padding-bottom: 8px;
    }
    .el-tabs__active-bar {
      height: 2.5px;
    }
    .el-tabs__item {
      color: var(--el-text-color-secondary);
      font-weight: 400;
      font-size: 18px;
      padding: 0 !important;
      margin-right: 56px;
    }

    .el-tabs__item.is-active {
      color: var(--el-text-color-primary);
    }
  }
}
</style>
