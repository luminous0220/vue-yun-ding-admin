import { nextTick, ref } from 'vue'

type ScrollElement = HTMLDivElement | null

export const useScroll = () => {
  const scrollRef = ref<ScrollElement>(null)

  const scrollToBottom = async () => {
    await nextTick()
    if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }
  // {
  //   top: messageBoxRef.value?.scrollHeight,
  //   behavior: 'auto', // 直接滚动，没有平滑效果
  // }
  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value) scrollRef.value.scrollTop = 0
  }

  const scrollToBottomIfAtBottom = async () => {
    await nextTick()
    if (scrollRef.value) {
      const threshold = 100 // 阈值，表示滚动条到底部的距离阈值
      const distanceToBottom =
        scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight
      if (distanceToBottom <= threshold) scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
  }

  return {
    scrollRef,
    scrollToBottom,
    scrollToTop,
    scrollToBottomIfAtBottom
  }
}