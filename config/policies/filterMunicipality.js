module.exports = async (ctx, next) => {
  if (ctx.state.user && ctx.state.user.municipality) {
    ctx.query['municipality'] = ctx.state.user.municipality.id;
  }
  return await next();
};
