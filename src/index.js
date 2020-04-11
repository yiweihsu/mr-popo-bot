const { router, line } = require('bottender/router')
const translate = require('translate')
const axios = require('axios')
const moment = require('moment')

const isoCountryCodeMapper = require('../iso-country-code.json')

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

const getCovid19DataByCountry = async (country) => {
  try {
    const translatedText = await translate(country, { from: 'zh', to: 'en', engine: 'yandex', key: 'trnsl.1.1.20200411T153632Z.a582d2f96a2833f4.9424df4283896fa12b2ae4ba0e8bc3135d94fd30' })

    const sanitizedInpute = translatedText.toLowerCase()
    const mappedCountry =
      isoCountryCodeMapper.filter(country => {
        if (country.name.toLowerCase() === sanitizedInpute || country['alpha-3'] === sanitizedInpute.toUpperCase()) {
          return country['alpha-3']
        }
      })
    
    if (mappedCountry.length > 0) {
      const { 'alpha-3': countryCode, name } = mappedCountry[0]
      const COVID_API_BASE_URL = 'https://covidapi.info/api/v1/country'
      const covidData = await axios.get(`${COVID_API_BASE_URL}/${countryCode}`)

      return {
        country: name,
        covidData,
      }
    }
  } catch (error) {
    console.error(error)
    return {
      failed: true,
    }
  }
}

async function HandleMessage(context) {
  const text = context.event.text

  const countryResult = await getCovid19DataByCountry(text)
  if (countryResult) {
    const today = moment().format('YYYY-MM-DD')
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')

    if (countryResult.failed) {
      await context.sendText('這個國家名稱或是代碼有存在，可是目前沒有資料可以顯示，抱歉噢🙇‍♂️')
    } else {
      const result = countryResult.covidData.data.result[today] ? countryResult.covidData.data.result[today] : countryResult.covidData.data.result[yesterday]
      const { confirmed, deaths, recovered } = result

      await context.sendText(`國家：${countryResult.country}\n資料更新日期：${today}\n確診：${confirmed}\n死亡：${deaths}\n已治癒：${recovered}\n\n記得勤洗手，盡量待在家裡，出門戴口罩，注意安全噢 😇`)
    }
  }

  if (['hi', '你好', '嗨'].includes(text.toLowerCase())) {
    await context.sendText(`嗨🤞`)
    await context.sendSticker({
      packageId: '1',
      stickerId: '106',
    })

    context.resetState()
  }

  if (['bye', 'goodbye', 'ciao', '掰', '拜', '再見'].includes(text)) {
    await context.sendText('我走啦～有需要我的時候可以隨時再找我進來喔 👋')
    await context.leave()
  }

  if (['help', '幫助', '說明'].includes(text.toLowerCase())) {
    await context.sendText('隔離在家如果覺得無聊，可以試試看輸入「武漢病毒」，瞭解目前病毒資訊，或是試試看輸入「看片」，也許會有意想不到的驚喜喔 😇')
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

  if (['19', '病毒', 'covid', 'covid19', 'wuhan', 'virus', '武漢病毒', '武漢肺炎', '中國', 'wuhan virus'].includes(text.toLowerCase())) {
    await context.sendText(`🦠 可以試試看輸入國家名稱，就可以得到目前的病毒資訊喔。例如：台灣, 德國, USA, 加拿大, 日本, 義大利等.....`)
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
  await context.sendText('隔離在家如果覺得無聊，可以試試看輸入「武漢病毒」，瞭解目前病毒資訊，或是試試看輸入「看片」，也許會有意想不到的驚喜喔 😇')
}
async function HandleLeave(context) {
  await context.sendText('我走啦～有需要我的時候可以隨時再找我進來喔 👋')
}