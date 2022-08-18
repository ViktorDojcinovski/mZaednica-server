module.exports = async (ctx, next) => {
  if (ctx.state.user && (ctx.state.user.role.type === 'admin' || ctx.state.user.role.type === 'category_admin')) {
    // Go to next policy or will reach the controller's action.
    return await next();
  }

  ctx.unauthorized(`You're not allowed to perform this action!`);
};
