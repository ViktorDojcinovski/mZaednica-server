module.exports = async (ctx, next) => {
  if (ctx.state.user && ctx.state.user["educational_facility"]) {
    ctx.query["educational_facility"] = ctx.state.user["educational_facility"];
  }
  return await next();
};
