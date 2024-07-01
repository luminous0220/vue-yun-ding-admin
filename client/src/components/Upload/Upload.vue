<template>
  <span>
    <slot>
      <el-button class="mr-14px" plain @click="open">
        {{ text }}
        <i-ep-upload-filled class="ml-5px text-[#369eff]!" />
      </el-button>
    </slot>
    <basic-dialog title="单文件上传" ref="BasicDialogRef">
      <el-upload
        drag
        ref="UploadRef"
        :action="url"
        :limit="1"
        v-model:file-list="fileList"
        :on-exceed="handleExceed"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :show-file-list="true"
        :auto-upload="false"
        name="file"
        :headers="headers"
        v-bind="$attrs">
        <el-icon class="el-icon--upload"><i-ep-upload-filled /></el-icon>
        <div class="el-upload__text">拖拽单个文件至此，或者 <em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            仅支持<span class="text-red font-bold">{{ props.fileExt.join('、') }}</span
            >格式的文件，大小为<span class="text-orange font-bold">{{ size }}MB！</span>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="BasicDialogRef?.close">关闭</el-button>
        <el-button type="primary" @click="submitUpload">上传</el-button>
      </template>
    </basic-dialog>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import { genFileId } from 'element-plus'
import { BasicDialog } from '@/components'
import { getToken } from '@/utils'

interface IProps {
  text: string
  url: string
  size: number
  fileExt: string[]
}

const props = withDefaults(defineProps<IProps>(), {
  text: '上传',
  url: '#',
  size: 5
})

const emit = defineEmits<{ (e: 'success', val: any): void }>()

// 文件列表
const fileList = ref<UploadUserFile[]>([])

// 请求头
const headers = reactive({
  Authorization: 'Bearer ' + getToken()?.token
})

const UploadRef = ref<UploadInstance>()
const BasicDialogRef = ref<InstanceType<typeof BasicDialog>>()

// 限制上传
// * 当上传文件超过limit限制的时候调用该函数
const handleExceed: UploadProps['onExceed'] = (files) => {
  // 清除列表
  UploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  // 手动上传选择文件
  UploadRef.value!.handleStart(file)
}

// * 校验文件大小、类型
const beforeUpload = (file: UploadRawFile) => {
  let name = file.name.replace(/.+\./, '')
  if (props.fileExt.indexOf(name.toLowerCase()) === -1) {
    window.$message.error({ message: `请上传${props.fileExt.join('、')}格式的文件!` })
    return false
  }

  const bool = file.size / 1024 / 1024 < 20
  if (!bool) {
    window.$message.error({ message: `上传文件大小不能超过${props.size}MB!` })
    return false
  }
  window.$message.info({ message: '正在上传中，请稍后' })
}

// * 上传出错的回调
const uploadError = (error: Error) => {
  window.$message.error({ message: '上传失败，请联系管理员' })
  console.error(error)
}

// * 上传成功的回调
const uploadSuccess = (response: any) => {
  const { code } = response
  if (code !== 200) {
    window.$message.error({ message: '服务器错误，请联系管理员' })
    console.error(response)
    return
  }
  emit('success', response)
  window.$notice.success({ message: '上传成功' })
}

const submitUpload = () => {
  UploadRef.value!.submit()
}

const open = () => {
  BasicDialogRef.value?.open()
}
</script>

<style scoped lang="scss"></style>
