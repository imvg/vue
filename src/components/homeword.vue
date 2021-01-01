<template>
  <div>
    <div class="content-root">
      <div class="content">
        <div class="head-text">
          <h1>终极在线文档下载工具</h1>
          <h2>效率极高、易于使用的文档下载器, 道客巴巴, 豆丁网, 只需输入文档网址即可下载</h2>
          <h2>左侧选择要下载的文档来源网站, 然后输入要下载的文档地址, 最后输入您的口令后点击提交即可</h2>
        </div>
        <div class="body-content">
          <div class="website">
            <ul class="website-list">
              <li class="site" @click="selectweb(0)">
                <img src='@/assets/static/doc88-logo.png' alt=""/>
              </li>
              <li class="site" @click="selectweb(1)">
                <img src="@/assets/static/douding-logo.png" alt=""/>
              </li>
            </ul>
          </div>
          <div class="user-content">
            <img class="body-img" src="@/assets/static/doc88-logo.png" alt=""/>
            <div class="input-div">
              <div class="url-div">
                <label>
                  <input type="text" class="url" placeholder="请输入要下载的文档连接">
                </label>
              </div>
              <div class="token-div">
                <label>
                  <input type="text" class="token" placeholder="请输入口令">
                </label>
              </div>
              <div class="but-div">
                <button class="upload-but" @click="upload">提交</button>
              </div>
            </div>
          </div>
        </div>
        <div class="body-loadding">
          <div class="lodding-div">
            <img src="@/assets/static/loading.gif" alt="" />
            <h5>文档正在努力破译中, 不要关闭或刷新本页</h5>
            <h5>根据文件页数大小预计需要1-5分钟, 请耐心等待</h5>
          </div>
        </div>
        <div class="body-resource">
          <div class="resource-div">
            <button class="download-but" @click="download">下载</button>
            <h3>文档已成功获取, 若浏览器没有自动下载您的文档, 请手动点击上方按钮下载</h3>
            <h5>刷新页面回到首页, 可以继续下载其他文件</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import doc88logo from '@/assets/static/doc88-logo.png'
import doudinglogo from '@/assets/static/douding-logo.png'
import axios from "axios";
let website = ''
let fileurl = ''
export default {
  name: "word",
  mounted() {
    document.getElementsByClassName('site')[0].setAttribute('style', 'background: #f6f6f8;')
    website = 'doc88'
  },
  methods: {
    selectweb (num) {
      if (num === 0){
        document.getElementsByClassName('site')[0].setAttribute('style', 'background: #f6f6f8;')
        document.getElementsByClassName('site')[1].setAttribute('style', 'background: #fff;')
        document.getElementsByClassName('body-img')[0].src = doc88logo
        website = 'doc88'
      } else {
        document.getElementsByClassName('site')[1].setAttribute('style', 'background: #f6f6f8;')
        document.getElementsByClassName('site')[0].setAttribute('style', 'background: #fff;')
        document.getElementsByClassName('body-img')[0].src = doudinglogo
        website = 'douding'
      }
    },
    upload(){
      if(!document.getElementsByClassName('url')[0].value){
        alert('请输入要下载的文档连接')
        return
      }
      if(!document.getElementsByClassName('token')[0].value){
        alert('请输入口令')
        return
      }
      document.getElementsByClassName('body-resource')[0].style.display = 'none'
      document.getElementsByClassName('body-content')[0].style.display = 'none'
      document.getElementsByClassName('body-loadding')[0].style.display = 'block'
      var token = document.getElementsByClassName('token')[0].value
      var file = document.getElementsByClassName('url')[0].value
      var data = {'ctype':website,'filelist':file,'token': token}
      axios.post('http://127.0.0.1:8000/api/actions', data, {timeout:300000}).then(function(res){
        var res_data = res.data
        if(res_data['code'] === 0){
          document.getElementsByClassName('body-resource')[0].style.display = 'block'
          document.getElementsByClassName('body-content')[0].style.display = 'none'
          document.getElementsByClassName('body-loadding')[0].style.display = 'none'
          fileurl = res_data['data']
          window.location = fileurl
        } else {
          console.log(res_data['msg'])
          document.getElementsByClassName('body-resource')[0].style.display = 'none'
          document.getElementsByClassName('body-content')[0].style.display = 'block'
          document.getElementsByClassName('body-loadding')[0].style.display = 'none'
          alert(res_data['msg'])
        }
      },function(){
        console.log('请求失败')
        alert('后端请求失败, 请联系站长')
      });
    },
    download(){
      window.location = fileurl
    }
  }
}
</script>

<style scoped>
.content-root
{
}
.content
{
  width: 100vw;
  height: 240px;
  background: linear-gradient(90deg,#0d6d16,#3061c8 50%,#e8a307) #a64f08;
}
.head-text
{
  position: relative;
  top: 15px;
  padding: 12px;
  color: white;
}
.head-text h1
{
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  color: #fff;
  max-width: 1100px;
  font-size: 42px;
  letter-spacing: 0;
  font-weight: 600;
  margin-bottom: 28px;
  margin-top: 10px;
}
.head-text h2
{
  color: #fff;
  max-width: 980px;
  margin: auto auto 28px;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 5px;
}
.body-content
{
  position: relative;
  margin-right: auto;
  margin-left: auto;
  top: 5px;
  height: 500px;
  width: 1000px;
  background: white;
  box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
  flex-wrap: wrap;
  display: block;
}
.body-loadding
{
  position: relative;
  margin-right: auto;
  margin-left: auto;
  top: 5px;
  height: 500px;
  width: 1000px;
  background: white;
  box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
  flex-wrap: wrap;
  display: none;
}
.body-resource
{
  position: relative;
  margin-right: auto;
  margin-left: auto;
  top: 5px;
  height: 500px;
  width: 1000px;
  background: white;
  box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
  flex-wrap: wrap;
  display: none;
}
.resource-div
{
  position: relative;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
  top: 35%;
}
.lodding-div
{
  position: relative;
  margin-right: auto;
  margin-left: auto;
  top: 40%;
}
.lodding-div img
{
  padding-bottom: 20px;
}
.lodding-div h5
{
  display: block;
  margin: 0;
  padding: 0;
  height: 20px;
  width: 100%;
  line-height: 5px;
  color: #8f8f8f;
}
.website
{
  position: relative;
  height: 100%;
  width: 200px;
  float: left;
}
ul
{
  position: relative;
  margin: auto auto;
  padding: 0 0;
  text-align: left;
  height: 100%;
  width: 100%;
  list-style-type: none;
  border-right: 2px solid #f6f6f8;
}
.website-list li
{
  position: relative;
  width: 100%;
  height: 75px;
  border-bottom: 2px solid #f6f6f8;
}
.website-list li img
{
  position: relative;
  display: block;
  margin: auto auto;
  top: 12px;
  height: 70%;
  width: 90%;
}
li:hover
{
  cursor: pointer;
}
.user-content
{
  position: relative;
  float: right;
  height: 100%;
  width: 800px;
}
.body-img
{
  position: relative;
  margin-top: 75px;
  height: 60px;
  width: 200px;
}
.input-div
{
  position: relative;
  margin-top: 50px;
  height: 300px;
  width: 100%;
}
.url-div
{
  position: relative;
  height: auto;
  width: auto;
  margin-top: 65px;
}
.token-div
{
  position: relative;
  height: auto;
  width: auto;
  margin-top: 30px;
}
input
{
  outline-style: none ;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 10px 14px;
  width: 200px;
  font-size: 14px;
  font-weight: 700;
  font-family: Microsoft YaHei;
}
.url
{
  width: 400px;
}
.but-div
{
  position: relative;
  height: auto;
  width: auto;
  margin-top: 45px;
}
.upload-but, .download-but
{
  width: 150px; /* 宽度 */
  height: 50px; /* 高度 */
  border-width: 0; /* 边框宽度 */
  border-radius: 3px; /* 边框半径 */
  background: #e5322d; /* 背景颜色 */
  cursor: pointer; /* 鼠标移入按钮范围时出现手势 */
  outline: none; /* 不显示轮廓线 */
  font-family: Microsoft YaHei;
  color: white; /* 字体颜色 */
  font-size: 23px; /* 字体大小 */
}
</style>