const { router, line } = require('bottender/router')
const axios = require('axios')

module.exports = function App() {
  return router([
    line.message(HandleMessage),
    line.follow(HandleFollow),
    line.unfollow(HandleUnfollow),
    line.join(HandleJoin),
    line.leave(HandleLeave),
  ])
}

const getRandomIntNum = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min)) + min
}

const getRandomVideo = async () => {
  try {
    const AVGLE_GET_VIDEO_API_URL = 'https://api.avgle.com/v1/video'
    const videoNum = getRandomIntNum(2, 90189)
    return axios.get(`${AVGLE_GET_VIDEO_API_URL}/${videoNum}`)
  } catch (error) {
    console.error(error)
  }
}

async function HandleMessage(context) {
  const text = context.event.text

  if (['hi', 'Hi', '你好', '嗨'].includes(text)) {
    await context.sendText(`嗨🤞`)
    await context.sendSticker({
      packageId: '1',
      stickerId: '106',
    })
  }

  if (['bye', 'goodbye', 'ciao', '掰', '拜', '再見'].includes(text)) {
    await context.sendText('我走啦～有需要我的時候可以隨時再找我進來喔 👋')
    await context.leave()
  }

  if (['porn', 'Porn', '看片'].includes(text)) {
    let videoContent
    let originalContentUrl
    let previewImageUrl
    let title
    let viewnumber
    let video_url
    
    videoContent = await getRandomVideo()
    while (!videoContent.data.response.video) {
      videoContent = await getRandomVideo()
    }

    if (videoContent.data.response.video) {
      originalContentUrl = videoContent.data.response.video.preview_video_url
      previewImageUrl = videoContent.data.response.video.preview_url
      title = videoContent.data.response.video.title
      viewnumber = videoContent.data.response.video.viewnumber
      video_url = videoContent.data.response.video.video_url      
      
      await context.sendText(`📼 影片名稱：${title}\n👍 觀看次數：${viewnumber}\n\n預覽如下 ⬇️`)

      await context.replyVideo({
        originalContentUrl,
        previewImageUrl,
      })

      await context.sendText(`🧻 影片完整版傳送門 => ${video_url}\n\n好好待在家別出門，看片愉快，結束後記得洗手噢 😇`)
    } else {
      await context.sendText('影片好像壞掉了，有的時候會這樣，再試一次看看吧？🙇‍♂️')
    }
  }
}

async function HandleFollow(context) {
  await context.sendText(`Thanks for following!`)
}

async function HandleUnfollow(context) {
  await context.sendText(`Take care!`)
}

async function HandleJoin(context) {
  await context.sendText('我來啦～')
  await context.sendSticker({
    packageId: '1',
    stickerId: '4',
  })
  await context.sendText('隔離在家如果覺得無聊，不如試試看輸入「看片」，也許會有意想不到的驚喜喔 😇')
}
async function HandleLeave(context) {
  await context.sendText('我走啦～有需要我的時候可以隨時再找我進來喔 👋')
}