<template>
  <div id="app">
      <div class="search">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          layout="inline"
          class="form_box"
        >
          <a-form-model-item label="门店id" prop="shopId">
            <a-input
              v-model="form.shopId"
              placeholder="请输入门店id"
              class="w300"
              @keyup.enter.native="onSearch"
            />
          </a-form-model-item>
          <a-form-model-item class="oprate">
            <a-button type="primary" @click="onSearch" style="background:#1AB394">查询</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <a-spin  :spinning="loading">
        <div class="img_list" v-if="list.length">
          <ul>
            <li v-for="(item,index) in list" :key="item.dishId" @mouseenter="mouseenter(index)" @mouseleave="mouseleave(index)">
              <img :src="item.frontImgUrl" />
              <div class="desc" v-show="item.isShowDesc" :class="{transition:item.isShowDesc}">
                <div class="left">
                  <span>名称:</span>
                  <span :title="item.name">{{item.name}}</span>
                </div>
                <span class="right"  @click="downMethod(item.frontImgUrl, item.name)">
                  <a-icon
                    type="download"
                    class="down_load"
                  />
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div class="no_data" v-else>
          <a-empty description="暂无数据"/>
        </div>
      </a-spin>
  </div>
</template>
<script>
export default {
  name: 'ViewShopId',
  data () {
    return {
      loading: false,
      form: {
        shopId: ''
      },
      rules: {
        shopId: [{ required: true, message: '门店id不能为空' }]
      },
      // 展示的图片是缩略图   下载的是原图   ---原图是把url里面中 图片后缀   后面的地址去掉
      list: []
    }
  },
  mounted () {
    console.log(process.env, 'process.env.VUE_BASE_URL')
  },
  methods: {
    mouseenter (index) {
      this.list[index].isShowDesc = true
    },
    mouseleave (index) {
      this.list[index].isShowDesc = false
    },
    onSearch () {
      this.loading = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$axios({
            url: `${process.env.VUE_APP_BASE_URL}/tools/getImg.json`,
            method: 'get',
            params: this.form
          }).then(res => {
            console.log(res, 'resimagList')
            const { ok, desc, data } = res.data
            if (ok) {
              console.log(data, 'data')
              data.map((item) => {
                item.isShowDesc = false
              })
              this.list = data
            } else {
              this.$notification.error({
                message: '错误',
                description: desc
              })
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    downMethod (imgSrc, fileName) {
      // 下载 图片 为原图
      this.downloadImg(this.getUrl(imgSrc), fileName)
    },
    // 实现在跨域情况下的图片资源的下载    创建一个非跨越的数据源
    /* @param
    url 为有域名的图片链接  可能存在跨越问题
    name 图片的下载后的命名
    */
    downloadImg (url, fileName) {
      // 0-fetch抓取图片数据
      fetch(url)
        .then(res => {
          console.log(res)
          // 1-  .blob() 生成blob对象 此方法获得的blob对象包含了数据类型
          return res.blob()
        })
        .then(blob => {
          console.log(blob, '获取到blob对象')
          // 2- 通过window.URL.createObjectURL给a标签设置数据源
          const linka = document.createElement('a')
          linka.download = fileName || 'test' // 下载的时候 要指定名字
          linka.href = URL.createObjectURL(blob) // 把blob对象的图片 转成你本地域名的链接地址
          // console.log(URL.createObjectURL(blob), 'blob_url')
          linka.click()
        })
    }, // end--- 这样就可以实现在跨域情况下的图片资源的下载。
    getUrl (url) {
      const imgSuffixArry = ['.gif', '.png', '.jpg']
      const pictureSuffix = url && url.match(/\.(gif|jpg|png)/g)
      // 0- console.log(pictureSuffix, 'pictureSuffix') // match匹配 成功则是数组 失败则是null
      if (pictureSuffix && pictureSuffix[0]) {
        // 1- console.log(imgSuffixArry.includes(pictureSuffix[0])) // 传入的url中是否含有指定图片格式 如.jpg  .png .gif
        if (imgSuffixArry.includes(pictureSuffix[0])) {
          // 2 -console.log(url.indexOf(pictureSuffix[0]), '.jpg的开始索引位置')
          // 3- pictureSuffix[0]  '.jpg' 加上字符串的length  进行截取
          return url.substring(
            0,
            url.indexOf(pictureSuffix[0]) + pictureSuffix[0].length
          )
        } else {
          return ''
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
ul,
li {
  margin: 0;
  padding: 0;
}
  .search {
    display:flex;
    justify-content:center;
    align-items: center;
    .form_box {
      height: 120px;
      padding-top: 35px;
      .oprate {
        .ant-btn-primary {
          margin-left: 20px;
        }
      }
      .w300 {
        width: 300px;
      }
    }
  }
  .img_list {
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 0 20px 20px;
      li {
        list-style: none;
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 0 10px 10px 0;
        width:300px;
        height:200px;
        overflow:hidden;
        img {
          width: 100%;
          height: 100%;
        }
        .desc {
          position: absolute;
          left:0;
          bottom:0px;  // 方法一 使用动画
          // bottom:-300px; // 方法二  使用过渡属性--有问题
          color:#fff;
          display:flex;
          justify-content: space-between;
          align-items: center;
          width:100%;
            .left {
              display:flex;
              padding-left:10px;
              & :nth-child(2) {
                width:100px;
                margin-left:20px;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1; //行数需设置--设置第几行出现省略号
                line-clamp: 1;
                -webkit-box-orient: vertical;
              }
            }
            .right {
              margin-right:10px;
              cursor: pointer;
              width:40px;
              height:40px;
              background:rgba(0, 0, 0, 0.6);
              display:flex;
              align-items: center;
              justify-content: center;
              .down_load {
                font-size: 20px;
              }
            }
        }
      }
    }
  }

.transition {
  animation:sport 0.5s; // 方法一使用动画  当鼠标移入的时候 添加该动画效果
  // bottom: 0  !important; // 方法二  利用过渡属性--有问题
  // transition: all 0.5s; // 方法二  利用过渡属性--有问题
}
@keyframes sport {
  0% {transform:translateY(80px);}
  // 25% {transform:translateY(50px);}
  // 50% {transform:translateY(20px);}
  100% {transform:translateY(0px);}
}
</style>
