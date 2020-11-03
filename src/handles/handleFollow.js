module.exports = async function handleFollow(context) {
  await context.sendText(`Thanks for following!`);
};
