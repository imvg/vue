
<template>
  <div class="content">
    <div class="pdf-main" :style="pdfCss">
      <div class="info">
        <div class="title">PDF文档合并</div>
        <div class="Introduction">将多个PDF文件合并为一个，并按照您要求的顺序来。</div>
      </div>
      <div class="select-but-div" @click="clickupload">
        <input type="file" class="file-input" multiple style="display: none" @change="onchangeupload">
        <img class="file-img" src="@/assets/static/upfile.png" alt="上传"/>
        <h3 class="file-tips">点击选择文件或将文件拖拽到这里</h3>
      </div>
    </div>
    <div class="word-setting" :style="settingCss">
      <div class="files-div">
        <draggable class="files-aera"
                   v-model="filelist"
                   group="people"
                   @start="drag=true"
                   @end="arrSort"
                   @change="drag=false"
                   v-bind="{
                    animation: 400,
                    disabled: false,
                    ghostClass: 'ghost'
                   }">
          <div class="file-drag" v-for="item in filelist" :key="item.id" @mouseenter="showDelete(item)" @mouseleave="delDelete(item)">
            <div class="delete-div">
              <div class="delete-img" title="删除文件" @click="deleteItem">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                  <polygon fill="#fff" fill-rule="evenodd" points="12 1.208 10.79 0 6 4.792 1.21 0 0 1.208 4.79 6 0 10.792 1.21 12 6 7.208 10.79 12 12 10.792 7.21 6"></polygon>
                </svg>
              </div>
            </div>
            <pdf :src="item.dest"></pdf>
            <h3 v-text="item.name"></h3>
          </div>
        </draggable>
      </div>
      <div class="button-div" @click="clickupload">
        <div class="upload-img" title="添加更多文件">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-linecap="round" stroke-width="2" stroke="#fff" fill="none" stroke-linejoin="round"><desc>上传你的文件</desc><path d="M10 1.833v16.333"></path><path d="M1.833 10h16.333"></path></svg>
        </div>
      </div>
      <div class="action-div">
        <div class="actions-area">
          <div class="action-title">
            PDF合并
          </div>
        </div>
        <div class="action-body-div">
          <div class="upload-tips">
            请将要合并的文件们拖到本页, 或者点击左边红色按钮选择文件, 按下 "ctrl"键，即可选择多个文件, 拖动文件排序即可按照您的需求顺序合并。
          </div>
        </div>
        <div class="upload-token-div">
          <label>
            <input type="text" class="token" placeholder="请输入口令">
          </label>
        </div>
        <div class="upload-button-div" @click="convers">
          <button id="processTask" class="upload-button">
            <span id="processTaskTextBtn">合并PDF</span>
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
import draggable from 'vuedraggable'
import pdf from 'vue-pdf'
let resource = [];
let resurl = '';
export default {
  name: 'pdfmerge',
  mounted() {
    this.setDrop()
    this.set_first_upload()
    this.set_merge_upload()
  },
  components: {
    draggable,
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
      for(var idx=0;idx<files.length;idx++){
        const filetype = files[idx].name.split('.')
        const filesize = files[idx].size
        if (filetype[filetype.length - 1] !== "pdf"){
          alert("文件格式不正确, 请选择PDF文件")
          return
        }
        if (filesize > 1024*1024*1024*1024){
          alert("文件大小超过1G, 无法上传, 请联系站长")
          return
        }
      }
      try {
        let parm = new FormData()
        for (var f=0;f<files.length;f++){
          parm.append('files', document.getElementsByClassName("file-input")[0].files[f])
        }
        axios.post('http://127.0.0.1:8080/api/uploads', parm).then(function(res){
          var res_data = eval(res.data)
          if (res_data.code === 0){
            document.getElementsByClassName("pdf-main")[0].style.display = 'none'
            document.getElementsByClassName("word-setting")[0].style.display = 'block'
            for(var df=0;df<res_data.data.length;df++){
              resource.push({'name':res_data.data[df].name,'dest':res_data.data[df].dest})
            }
          }
        },function(){
          console.log('请求失败')
        });
      } catch (e){
        console.log(e)
      }
    },
    set_first_upload () {
      const sdrop = document.getElementsByClassName("pdf-main")[0]
      sdrop.addEventListener("drop", function(e){
        const files = e.dataTransfer.files // 获取文件目标
        for(var idx=0;idx<files.length;idx++){
          const filetype = files[idx].name.split('.')
          const filesize = files[idx].size
          if (filetype[filetype.length - 1] !== "pdf"){
            alert("文件格式不正确, 请选择PDF文件")
            return
          }
          if (filesize > 1024*1024*1024*1024){
            alert("文件大小超过1G, 无法上传, 请联系站长")
            return
          }
        }
        try {
          let parm = new FormData()
          for (var f=0;f<e.dataTransfer.files.length;f++){
            parm.append('files', e.dataTransfer.files[f])
          }
          axios.post('http://127.0.0.1:8080/api/uploads', parm).then(function(res){
            var res_data = eval(res.data)
            if (res_data.code === 0){
              document.getElementsByClassName("pdf-main")[0].style.display = 'none'
              document.getElementsByClassName("word-setting")[0].style.display = 'block'
              for(var df=0;df<res_data.data.length;df++){
                resource.push({'name':res_data.data[df].name,'dest':res_data.data[df].dest})
              }
            }
          },function(){
            console.log('请求失败')
          });
        } catch (e){
          console.log(e)
        }
      })
    },
    set_merge_upload () {
      const acdrop = document.getElementsByClassName("files-div")[0]
      acdrop.addEventListener("drop", function(e){
        const files = e.dataTransfer.files // 获取文件目标
        for(var idx=0;idx<files.length;idx++){
          const filetype = files[idx].name.split('.')
          const filesize = files[idx].size
          if (filetype[filetype.length - 1] !== "pdf"){
            alert("文件格式不正确, 请选择PDF文件")
            return
          }
          if (filesize > 1024*1024*1024*1024){
            alert("文件大小超过1G, 无法上传, 请联系站长")
            return
          }
        }
        try {
          let parm = new FormData()
          for (var f=0;f<e.dataTransfer.files.length;f++){
            parm.append('files', e.dataTransfer.files[f])
          }
          axios.post('http://127.0.0.1:8080/api/uploads', parm).then(function(res){
            var res_data = eval(res.data)
            if (res_data.code === 0){
              document.getElementsByClassName("pdf-main")[0].style.display = 'none'
              document.getElementsByClassName("word-setting")[0].style.display = 'block'
              for(var df=0;df<res_data.data.length;df++){
                resource.push({'name':res_data.data[df].name,'dest':res_data.data[df].dest})
              }
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
    showDelete (item) {
      var ind = resource.indexOf(item)
      document.getElementsByClassName("delete-div")[ind].style.display = 'block'
    },
    delDelete (item) {
      var ind = resource.indexOf(item)
      document.getElementsByClassName("delete-div")[ind].style.display = 'none'
    },
    deleteItem (item) {
      var ind = resource.indexOf(item)
      resource.splice(ind,1)
    },
    convers () {
      var token = document.getElementsByClassName("token")[0].value
      if (resource.length >= 2 && token){
        var files_arr = []
        for(var fd=0;fd<resource.length;fd++){
          files_arr.push(resource[fd].dest.split('/')[resource[fd].dest.split('/').length - 1])
        }
        var data = {'ctype':'pdfmerge','filelist':files_arr,'token': token}
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
        alert("请检查文件数量是否为两个以上, 以及token是否正确")
      }
    },
    arrSort(event){
      const newIndex = event.newIndex  //新index
      const oldIndex = event.oldIndex  //原index
      if(oldIndex > newIndex){
        resource.splice(newIndex,0,resource[oldIndex]);
        resource.splice(oldIndex+1,1)
      } else {
        resource.splice(newIndex+1,0,resource[oldIndex]);
        resource.splice(oldIndex,1)
      }
    }
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
      filelist: resource,
      studyDataPic: require('@/assets/static/upfile.png'),
      oldData: null,
      newData: null
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
  width: 70%;
  height: 100%;
  float: left;
  overflow: auto;
}
.files-aera
{
  height: auto;
  width: auto;
  overflow: auto;
  display: flex;
  flex-flow:row wrap;
  justify-content: center;
  margin-top: 10%;
  margin-left: 10%;
  margin-right: 10%;
}
.file-drag
{
  position: relative;
  margin-left: 50px;
  margin-bottom: 60px;
  height: 200px;
  width: 140px;
  float: left;
}
.file-drag:hover
{
  cursor: pointer;
}
.file-drag h3
{
  display: block;
  font-size: 12px;
  word-wrap: break-word;
  height: 100%;
  width: 100%;
  letter-spacing: 0;
  color: #383e45;
  margin-bottom: 0;
  text-align: center;
}
.button-div
{
  position: absolute;
  left: 71%;
  top: 15%;
  width: 42px;
  height: 42px;
}
.button-div:hover
{
  cursor: pointer;
}
.delete-div
{
  position: absolute;
  right: 5px;
  top: 5px;
  width: 30px;
  height: 30px;
  display: none;
}
.upload-img
{
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 0;
  min-width: 0;
  min-height: inherit;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background: #e5322d;
  color: #fff;
  text-decoration: none;
  box-shadow: 0 3px 6px 0 rgba(0,0,0,.14);
}
.upload-img:hover
{
  background: #161616;
}

.delete-img
{
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 0;
  min-width: 0;
  min-height: inherit;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background: #e5322d;
  color: #ffffff;
  text-decoration: none;
  box-shadow: 0 3px 6px 0 rgba(0,0,0,.14);
}
.upload-tips
{
  position: relative;
  top: 10px;
  margin: 0 auto;
  height: 90px;
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
.upload-but, .dw-but
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
.ask-info
{
  position: relative;
  display: none;
  font-size: 7px;
  color: #8F8F8F;
  top: 5px
}
</style>
