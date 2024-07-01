<template>
  <div class="w-full h-full">
    <el-card body-class="flex h-full p-0!" class="w-full h-full">
      <div class="h-full w-360px py-22px px-28px" style="border-right: 1px solid #e5e7eb">
        <div class="flex flex-col flex-center text-[#555]">
          <div class="mt-38px cursor-pointer mask" @click="openAvatarEditor">
            <el-avatar class="" :size="148" :src="user.avatar"></el-avatar>
            <input
              class="hidden"
              id="avatar-upload"
              @input="createCropper"
              type="file"
              :limit="1"
              accept="image/*" />
          </div>
          <div class="mt-28px text-18px">{{ user.nickname }}</div>
          <div class="mt-18px text-14px text-[#95aac9]">{{ user.email }}</div>
          <div class="text-14px mt-18px line-clamp-5">
            {{ user.sign || `你还没有签名呢 ~` }}
          </div>

          <div class="mt-32px w-full">
            <div class="flex justify-between w-60% mx-auto">
              <span class="text-[#95aac9]">性别</span>

              <el-tag type="success">{{ user.sex === 1 ? '男' : '女' }}</el-tag>
            </div>
            <div class="flex justify-between w-60% mx-auto mt-18px">
              <span class="text-[#95aac9]">年龄</span>
              <el-tag type="primary">{{ user.age || '无' }}</el-tag>
            </div>
            <div class="flex justify-between w-60% mx-auto mt-18px">
              <span class="text-[#95aac9]">生日</span>
              <el-tag type="warning">{{ user.birthday || '无' }}</el-tag>
            </div>
            <div class="flex justify-between w-60% mx-auto mt-18px">
              <span class="text-[#95aac9]">手机</span>
              <el-tag type="danger">{{ user.phone || '无' }}</el-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="py-22px px-28px" style="width: calc(100% - 360px)">
        <el-tabs type="border-card" class="w-full! h-full">
          <el-tab-pane label="基础信息">
            <Info />
          </el-tab-pane>
          <el-tab-pane label="密码管理">
            <EditPwd />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 头像裁剪弹窗 -->
    <el-dialog
      v-model="visiable"
      title="头像上传"
      width="630px"
      draggable
      style="border-radius: 22px"
      @close="handleClose">
      <div class="flex justify-around">
        <div class="avatar-canvas-wrap">
          <img id="avatar-canvas" />
        </div>
        <div class="preview-avatar-wapper flex items-center">
          <div id="preview-avatar" />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visiable = false">关闭</el-button>
          <el-button type="primary" @click="confirmCrop">修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Info from './components/Info.vue'
import EditPwd from './components/EditPwd.vue'
import { useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { UploadApi } from '@/apis/upload.api'
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const visiable = ref(false)
let cropperInstance: any = null
let avatarCanvas: any = null

// 打开头像编辑
const openAvatarEditor = () => {
  const el = document.querySelector('#avatar-upload') as HTMLInputElement
  el.value = '' // 防止重复上传同一张图片时不会打开裁剪弹窗
  el?.click()
}

// 创建cropper实例
const createCropper = (e: Event) => {
  const file: File = (e.target as any).files[0]
  if (file.size > 3000000) {
    return window.$message.warning({ message: '图片大小不能大于3M' })
  }
  visiable.value = true
  nextTick(() => {
    avatarCanvas = document.querySelector('#avatar-canvas') as HTMLImageElement
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      avatarCanvas.src = reader.result as string
      cropperInstance = new Cropper(avatarCanvas, {
        aspectRatio: 1 / 1,
        preview: '#preview-avatar'
      })
    })
    reader.readAsDataURL(file)
  })
}

// 关闭
const handleClose = () => {
  avatarCanvas && (avatarCanvas.src = '')
  if (cropperInstance) {
    cropperInstance.destroy()
  }
}

// 裁剪上传
const confirmCrop = () => {
  cropperInstance
    .getCroppedCanvas({
      fillColor: '#fff',
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'high'
    })
    .toBlob(async (blob: Blob) => {
      const formData = new FormData()
      formData.set('image', blob, 'avatar.png')

      await UploadApi.uploadImage(formData)
      window.$notice.success({ message: '修改成功' })
      await authStore.getUserInfo()
      visiable.value = false
    })
}
</script>

<style lang="scss">
.avatar-canvas-wrap {
  width: 409px;
  height: 330px;
  #avatar-canvas {
    display: block;
    width: 100%;
    max-width: 100%;
  }
}

#preview-avatar {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 150px;
}

.mask{
  
}
</style>
