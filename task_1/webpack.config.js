// eslint-disable-next-line no-undef
module.exports = async (env) => {
  const config = await import(
    env.mode === 'production' ? './configs/prod.js' : './configs/dev.js'
  );
  return config.default;
};
