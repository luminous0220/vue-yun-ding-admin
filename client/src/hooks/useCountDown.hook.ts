export const useCountDown = () => {
  let timer: any = null
  const timeLeft = ref(60)
  const isEnd = ref(true)

  const startCountDown = (t = 60) => {
    timeLeft.value = t
    isEnd.value = false
    timer = setInterval(() => {
      timeLeft.value = timeLeft.value - 1
      if (timeLeft.value <= 0) {
        clearInterval(timer)
        isEnd.value = true
        timeLeft.value = t
      }
    }, 1000)
  }
  return {
    timeLeft,
    isEnd,
    startCountDown
  }
}
