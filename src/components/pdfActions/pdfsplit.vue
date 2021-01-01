
<template>
  <div class="content">
    <div class="pdf-main" :style="pdfCss">
      <div class="info">
        <div class="title">PDF文档分割</div>
        <div class="Introduction">将PDF文件按页分割成多个单独的PDF文档。</div>
      </div>
      <div class="select-but-div" @click="clickupload">
        <input type="file" class="file-input" style="display: none" @change="onchangeupload">
        <img class="file-img" src="@/assets/static/upfile.png" alt="上传"/>
        <h3 class="file-tips">点击选择文件或将文件拖拽到这里</h3>
      </div>
    </div>
    <div class="word-setting" :style="settingCss">
      <div class="files-div">
        <div class="file-preview" v-for="item in filelist" :key="item.id">
          <div class="file-page" v-for="index in maxpage" :key="index">
            <pdf :src="item.dest" :page="index"></pdf>
          </div>
        </div>
      </div>
      <div class="action-div">
        <div class="actions-area">
          <div class="action-title">
            PDF拆分
          </div>
        </div>
        <div class="action-body-div">
          <div class="upload-tips">
            左侧便是您PDF文件的内容，我们会按照页数来将其分割为单独的PDF文档。
          </div>
        </div>
        <div class="upload-token-div">
          <label>
            <input type="text" class="token" placeholder="请输入口令">
          </label>
        </div>
        <div class="upload-button-div" @click="convers">
          <button id="processTask" class="upload-button">
            <span id="processTaskTextBtn">拆分PDF</span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#FFF" fill-rule="evenodd">
                <path d="M13 26C5.82 26 0 20.18 0 13S5.82 0 13 0s13 5.82 13 13-5.82 13-13 13zm0-2c6.075 0 11-4.925 11-11S19.075 2 13 2 2 6.925 2 13s4.925 11 11 11z" fill-rule="nonzero"></path>
                <path d="M18.684 13.105a.55.55 0 0 1-.148.378l-5.263 5.263a.55.55 0 0 1-.378.148.54.54 0 0 1-.526-.526V15.21H7.842a.54.54 0 0 1-.526-.526v-3.158A.54.54 0 0 1 7.842 11h4.526V7.842a.52.52 0 0 1 .526-.526c.148 0 .28.066.395.164l5.247 5.247a.55.55 0 0 1 .148.378z"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="pdf-recive" :style="pdfReciveCss">
      <div class="recive-tips">
        <div class="recive-tips-a">正在处理您的文件，请稍等片刻...</div>
        <div class="recive-tips-b">请不要离开本页, 预计需要10-20秒...</div>
      </div>
      <div class="recive-img-div">
        <img class="recive-img" src="@/assets/static/loading.gif" alt>
      </div>
      <div class="dw-but-div">
        <button type="button" class="dw-but" @click="download">下载</button>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
import pdf from 'vue-pdf'
let resource = [];
let resurl = '';
let maxPage = [];
export default {
  name: 'pdfsplit',
  mounted() {
    this.setDrop()
    this.set_first_upload()
  },
  components: {
    pdf
  },
  methods: {
    setDrop () {
      document.addEventListener("drop", function (e) {  //拖动文件放置在目标时触发
        e.preventDefault();
      })
      document.addEventListener("dragleave", function (e) {  //拖动文件离开目标时触发
        e.preventDefault();
      })
      document.addEventListener("dragenter", function (e) {  //元素拖进目标时触发
        e.preventDefault();
      });
      document.addEventListener("dragover", function (e) {  //元素拖到目标时触发
        e.preventDefault();
      });
      // 以上为禁用浏览器自带的文件拖拽打开功能
    },
    clickupload () {
      document.getElementsByClassName("file-input")[0].click()
    },
    onchangeupload () {
      const files = document.getElementsByClassName("file-input")[0].files // 获取文件目标
      const filetype = files[0].name.split('.')
      const filesize = files[0].size
      if (filetype[filetype.length - 1] !== "pdf"){
        alert("文件格式不正确, 请选择PDF文件")
        return
      }
      if (filesize > 1024*1024*1024*1024){
        alert("文件大小超过1G, 无法上传, 请联系站长")
        return
      }
      try {
        let parm = new FormData()
        parm.append('files', document.getElementsByClassName("file-input")[0].files[0])
        try {
          axios.post('http://127.0.0.1:8080/api/uploads', parm).then(function(res){
            var res_data = eval(res.data)
            if (res_data.code === 0){
              document.getElementsByClassName("pdf-main")[0].style.display = 'none'
              document.getElementsByClassName("word-setting")[0].style.display = 'block'
              resource.splice(0,resource.length)
              resource.push({'name':res_data.data[0].name,'dest':res_data.data[0].dest})
              let loadingTask = pdf.createLoadingTask(res_data.data[0].dest)
              loadingTask.promise.then(pdf => {
                for(var i=1;i<=pdf.numPages;i++){
                  maxPage.push(i)
                }
              }).catch(err => {
                console.error('pdf 加载失败', err);
                maxPage.push(1)
              })
            }
          },function(e){
            console.log('请求失败'+e)
          });
        } catch (e){
          console.log(e)
          alert("程序错误, 请联系站长"+e)
        }

      } catch (e){
        console.log(e)
      }
    },
    set_first_upload () {
      const sdrop = document.getElementsByClassName("pdf-main")[0]
      sdrop.addEventListener("drop", function(e){
        const files = e.dataTransfer.files // 获取文件目标
        const filetype = files[0].name.split('.')
        const filesize = files[0].size
        if (filetype[filetype.length - 1] !== "pdf"){
          alert("文件格式不正确, 请选择PDF文件")
          return
        }
        if (filesize > 1024*1024*1024*1024){
          alert("文件大小超过1G, 无法上传, 请联系站长")
          return
        }
        try {
          let parm = new FormData()
          parm.append('files', e.dataTransfer.files[0])
          axios.post('http://127.0.0.1:8080/api/uploads', parm).then(function(res){
            var res_data = eval(res.data)
            if (res_data.code === 0){
              document.getElementsByClassName("pdf-main")[0].style.display = 'none'
              document.getElementsByClassName("word-setting")[0].style.display = 'block'
              resource.splice(0,resource.length)
              resource.push({'name':res_data.data[0].name,'dest':res_data.data[0].dest})
              let loadingTask = pdf.createLoadingTask(res_data.data[0].dest)
              loadingTask.promise.then(pdf => {
                maxPage = pdf.numPages
              }).catch(err => {
                console.error('pdf 加载失败', err);
                maxPage = 1
              })
            }
          },function(){
            console.log('请求失败')
          });
        } catch (e){
          console.log(e)
        }
      })
    },
    download () {
      window.location = resurl
    },
    convers () {
      var token = document.getElementsByClassName("token")[0].value
      if (resource.length === 1 && token){
        if (maxPage.length === 1){
          alert("您选择的文件只有一页, 无法拆分, 请重新选择文件")
          return
        }
        var files_arr = resource[0].dest.split('/')[resource[0].dest.split('/').length - 1]
        var data = {'ctype':'pdfsplit','filelist':files_arr,'token': token}
        document.getElementsByClassName("word-setting")[0].style.display = 'none'
        document.getElementsByClassName("pdf-recive")[0].style.display = 'block'
        axios.post('http://127.0.0.1:8080/api/actions', data).then(function(res){
          var res_data = eval(res.data)
          if (res_data.code === 0){
            resurl = res_data.data
            document.getElementsByClassName("recive-tips-a")[0].innerHTML = "文件处理完成, 请下载您的文件"
            document.getElementsByClassName("recive-tips-b")[0].innerHTML = "如果您的浏览器没有自动下载, 请点击下方按钮 (五分钟后文件过期, 请尽快下载)"
            document.getElementsByClassName("recive-img-div")[0].style.display = 'none'
            document.getElementsByClassName("dw-but-div")[0].style.display = 'block'
            window.location = resurl
          } else {
            alert(res_data.msg)
            document.getElementsByClassName("pdf-main")[0].style.display = 'block'
            document.getElementsByClassName("pdf-recive")[0].style.display = 'none'
          }
        },function(){
          console.log('请求失败')
        });
      } else {
        alert("请检查文件展示是否正常,以及token是否输入正确, 否则需要刷新页面重新操作")
      }
    },
  },
  data () {
    return {
      pdfCss: {
        display: 'block',
        position: 'relative',
        top: '0',
        height: 'calc(100vh - 105px)',
        width: '100vw',
      },
      settingCss: {
        display: 'none',
        position: 'relative',
        top: '0',
        height: 'calc(100vh - 105px)',
        width: '100vw',
      },
      pdfReciveCss: {
        display: 'none',
        position: 'relative',
        top: '0',
        height: 'calc(100vh - 105px)',
        width: '100vw',
      },
      studyDataPic: require('@/assets/static/upfile.png'),
      filelist: resource,
      maxpage: maxPage
    }
  },
}
</script>

<style scoped>
.action-div
{
  position: relative;
  background: white;
  box-shadow: inset 0 5px 15px -13px #000, inset 0 -5px 15px -15px #000;
  border-left: 1px solid rgba(0,0,0,.2);
  height: 100%;
  width: 25%;
  float: right;
}
.actions-area
{
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}
.action-title
{
  font-size: 24px;
  font-weight: 600;
  line-height: 34px;
  letter-spacing: 0;
  color: #383e45;
  margin-bottom: 0;
  text-transform: uppercase;
  text-align: center;
  padding: 12px;
  border-bottom: 1px solid rgba(0,0,0,.2);
  position: relative;
  background-color: #fff;
}
.files-div
{
  position: relative;
  margin-top: 50px;
  margin-left: 50px;
  padding: 10px 10px;
  border: dashed 1px;
  width: 67%;
  height: 90%;
  float: left;
  overflow: auto;
}
.file-preview
{
  position: relative;
  height: 100%;
  width: 100%;
  padding-bottom: 20px;
}
.file-page
{
  position: relative;
  padding-left: 10px;
  padding-bottom: 67px;
  height: 251px;
  width: 213px;
  display: block;
  float: left;
}
.file-preview:hover
{
  cursor: pointer;
}
.upload-tips
{
  position: relative;
  top: 10px;
  margin: 0 auto;
  height: 50px;
  width: 70%;
  border: 0;
  border-radius: 4px;
  text-align: left;
  background-position: 12px;
  background-repeat: no-repeat;
  padding: 24px;
  color: #383e45;
  background-color: #d9edf7;
}
.upload-token-div
{
  position: relative;
  top: 300px;
}
.upload-button-div
{
  position: relative;
  transform: translate(-25%,50%);
  left: 50%;
  top: 400px;
  height: auto;
  width: auto;
}
.upload-button
{
  position: relative;
  height: 70px;
  width: 215px;
  background: #e5322d;
  display: flex;
  justify-content: center;
  min-height: inherit;
  align-items: center;
  border-radius: 4px;
  border: none;
  outline: none;
  box-shadow: 0 2px 8px 0 rgba(50,50,50,.3);
}
.upload-button:hover
{
  background: #181818;
  cursor: pointer;
}
.upload-button:active
{
  height: 68px;
  width: 213px;
}
.upload-button span
{
  padding-right: 10px;
  font-size: 20px;
  color: white;
}
.info
{
  position: relative;
  top: 40px;
}
.title
{
  font-size: 42px;
  letter-spacing: 0;
  font-weight: 600;
  color: #383e45;
  margin-bottom: 8px;
  line-height: 46px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.Introduction
{
  max-width: 800px;
  font-size: 22px;
  font-weight: 400;
  color: #383e45;
  letter-spacing: 0;
  margin: 0 auto 8px;
  line-height: 32px;
}
.select-but-div
{
  position: relative;
  top: 50px;
  left: 50%;
  align-items: center;
  height: 200px;
  width: 600px;
  margin-left:-300px;
  border: dashed 1px;
}
.select-but-div:hover
{
  cursor: pointer;
}
.select-but-div img
{
  position: relative;
  top: 20%;
  width: 32px;
  height: 32px;
}
.select-but-div h3
{
  position: relative;
  top: 25%;
  width: 100%;
  height: 32px;
}
.recive-tips
{
  position: relative;
  font-size: 30px;
  top: 20%;
  width: 100%;
  height: 32px;
}
.recive-tips-a
{
  position: relative;
  font-size: 30px;
  top: 0;
  width: 100%;
  height: 32px;
}
.recive-tips-b
{
  position: relative;
  font-size: 20px;
  top: 25%;
  width: 100%;
  height: 32px;
}
.recive-img-div
{
  position: relative;
  display: block;
  top: 30%
}
.dw-but-div
{
  position: relative;
  display: none;
  top: 30%
}
.dw-but
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
.token
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
</style>
