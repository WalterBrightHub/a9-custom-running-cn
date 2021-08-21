// vue.config.js
module.exports = {
    publicPath:'/ts/',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= '自定义跑图自助工具'
        return args
      })
  },
};