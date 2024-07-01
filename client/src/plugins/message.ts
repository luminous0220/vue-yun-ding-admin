import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

type ToastType = 'success' | 'warning' | 'info' | 'error'

const TIPS = {
  success: '成功',
  warning: '注意',
  info: '通知',
  error: '错误'
}

function createMessage(type: ToastType) {
  return (params: { showClose?: boolean; message: string; duration?: number }) => {
    const { showClose, duration } = params
    params.showClose = showClose ? showClose : true
    params.duration = duration ? duration : 5000
    ElMessage({ ...params, type })
  }
}

function createMessageBox(type: ToastType) {
  return (params: {
    title?: string
    message: string
    confirmButtonText?: string
    cancelButtonText?: string
  }) => {
    const { title, confirmButtonText, cancelButtonText, message } = params
    params.title = title ? title : TIPS[type]
    params.confirmButtonText = confirmButtonText ? confirmButtonText : '确认'
    params.cancelButtonText = cancelButtonText ? cancelButtonText : '取消'
    return ElMessageBox.confirm(message, title, {
      confirmButtonText,
      cancelButtonText,
      type
    })
  }
}

function createNotification(type: ToastType) {
  return (params: { title?: string; message: string; duration?: number }) => {
    const { title, duration } = params
    params.title = title ? title : TIPS[type]
    params.duration = duration ? duration : 5000
    return ElNotification({ ...params, type })
  }
}

export const message = {
  success: createMessage('success'),
  warning: createMessage('warning'),
  info: createMessage('info'),
  error: createMessage('error')
}

export const confirm = {
  success: createMessageBox('success'),
  warning: createMessageBox('warning'),
  info: createMessageBox('info'),
  error: createMessageBox('error')
}

export const notice = {
  success: createNotification('success'),
  warning: createNotification('warning'),
  info: createNotification('info'),
  error: createNotification('error')
}
