import startApp from './server.mjs';

startApp().listen(3000, () => {
  console.log(`Example app listening on port ${3000}`)
})
