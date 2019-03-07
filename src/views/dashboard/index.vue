<template>
  <div class="enc-main">
      <div class="enc-card" @click="goToRoute(1)">
        数据工厂
      </div>
      <div class="enc-card" @click="goToRoute(2)">
        数据资产
      </div>
      <div class="enc-card" @click="goToRoute(3)">
        数据质量
      </div>
      <div class="enc-card" @click="goToRoute(4)">
        数据服务
      </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {

      }
    },
    created() {

    },
    methods: {
      goToRoute(key) {
          switch(key) {
            case 1:
              window.open("http://www.baidu.com/", "_blank");
              break;
            case 2:
              window.open("http://www.sohu.com/", "_blank");
              break;
            case 3:
              window.open("http://www.163.com/", "_blank");
              break;
            case 4:
              window.open("https://mail.qq.com/cgi-bin/loginpage", "_blank");
              break;

          }
      }
    }
  }
</script>


<style scoped>
  .enc-main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  .enc-card {
    background: url(../../assets/images/enc-logo.png) no-repeat 50%;
    height: 200px;
    width: 200px;
    text-align: center;
    margin: 40px;
    border: 1px solid #4A60A2;
    border-radius: 50%;
    line-height: 200px;
    cursor: pointer;
  }
</style>
