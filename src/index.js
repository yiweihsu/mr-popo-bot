const { router, line } = require('bottender/router')

module.exports = function App() {
  return router([
    line.message(HandleMessage),
    line.follow(HandleFollow),
    line.unfollow(HandleUnfollow),
    line.join(HandleJoin),
    line.leave(HandleLeave),
  ])
}

async function HandleMessage(context) {
  if (['hi', 'Hi', '你好', '嗨'].includes(context.event.text)) {
    await context.sendText(`Hi!`)
    await context.sendSticker({
      packageId: '1',
      stickerId: '1',
    })
  }
  if (['bye', 'goodbye', 'ciao', '掰', '拜', '再見'].includes(context.event.text)) {
    await context.sendText('我走啦～')
    await context.leave()
  }
  if (['喝水嗎？', '該喝水了嗎？', '現在要幹嘛？', '幹嘛？', '幹嘛'].includes(context.event.text)) {
    await context.sendText(`喝水吧。`)
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
}
async function HandleLeave(context) {
  await context.sendText('我走啦～')
}