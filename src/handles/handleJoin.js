module.exports = async function handleJoin(context) {
  await context.sendText('我來啦～');
  await context.sendSticker({
    packageId: '1',
    stickerId: '4',
  });
  await context.sendText(
    '很高興認識你，我是機器人Mr.Popo 👋 \n\n隔離在家如果覺得無聊，可以試試看輸入「武漢病毒」，瞭解目前病毒資訊，或是試試看輸入「看片」，也許會有意想不到的驚喜喔 😇'
  );
};
