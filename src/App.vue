<template>
  <div id="app">
    <div class="container">
      <topbar></topbar>
      <router-view></router-view>
    </div>
    <footes class="footer"></footes>
  </div>
</template>

<script>
import topbar from './topbar';
// eslint-disable-next-line no-unused-vars
import footes from "./footer";

export default {
  name: 'App',
  components: {
    topbar,
    // eslint-disable-next-line vue/no-unused-components
    footes
  }
}
</script>

<style>
body
{
  display: block;
  margin: 0;
  padding: 0;
}
div
{
  display: block;
}
#app {
  font-family: Avenir,Helvetica,Arial,sans-serif;
  text-align: center;
  margin-top: 0;
  margin-left: 0;
  position: relative;
  min-height: 100%;
  width: 100%;
}
.container {
  box-sizing: border-box;
  min-height: 100vh;
  margin-bottom: -60px;
  padding-bottom: 60px;
  background: #f3f0ec;
}
.footer
{
  margin-top: -60px;
  height: 60px;
}
</style>
