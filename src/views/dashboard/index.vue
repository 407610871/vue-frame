<template>
<div class="main clearfix">
  <div class="enc-main">
      <div @mouseenter="mouseenter(1,$event)" @mouseleave="mouseleave($event)" @click="goToRoute(1)">
        <el-card shadow="hover" :class="type==1 ? 'enc-card-hover' : 'enc-card'" >
          <div class="enc-img-style">
            <img :src="logo_gc" alt="">
          </div>
          <div class="enc-title-style">
              数据工厂
          </div>
        </el-card>
      </div>
      <div @mouseenter="mouseenter(2, $event)" @mouseleave="mouseleave($event)" @click="goToRoute(2)">
        <el-card shadow="hover" :class="type==2 ? 'enc-card-hover' : 'enc-card'">
          <div class="enc-img-style">
            <img :src="logo_zc" alt="">
          </div>
          <div class="enc-title-style" >
              数据资产
          </div>
        </el-card>
      </div>
      <div @mouseenter="mouseenter(3, $event)" @mouseleave="mouseleave($event)" @click="goToRoute(3)">
        <el-card shadow="hover" :class="type==3 ? 'enc-card-hover' : 'enc-card'">
          <div class="enc-img-style">
            <img :src="logo_zl" alt="">
          </div>
          <div class="enc-title-style" >
              数据质量
          </div>
        </el-card>
      </div>
      <div @mouseenter="mouseenter(4, $event)" @mouseleave="mouseleave($event)" @click="goToRoute(4)">
        <el-card shadow="hover" :class="type==4 ? 'enc-card-hover' : 'enc-card'" >
          <div class="enc-img-style">
            <img :src="logo_fw" alt="">
          </div>
          <div class="enc-title-style" >
              数据服务
          </div>
        </el-card>
      </div>
  </div>
</div>
</template>

<script>

  import logo_gc from "@/assets/images/logo-gc.png";
  import logo_zc from "@/assets/images/logo-zc.png";
  import logo_zl from "@/assets/images/logo-zl.png";
  import logo_fw from "@/assets/images/logo-fw.png";

  export default {
    data(){
      return {
        logo_gc: logo_gc,
        logo_zc: logo_zc,
        logo_zl: logo_zl,
        logo_fw: logo_fw,
        type: 0,
      }
    },
    created() {

    },
    methods: {
      goToRoute(key) {
          switch(key) {
            case 1:
              window.open(`${window.ENV.API_GC}`, "_blank");
              break;
            case 2:
              window.open(`${window.ENV.API_ZC}`, "_blank");
              break;
            case 3:
              window.open(`${window.ENV.API_ZL}`, "_blank");
              break;
            case 4:
              window.open(`${window.ENV.API_FW}`, "_blank");
              break;

          }
      },
      mouseenter(val, e) {
        var o = e.relatedTarget || e.toElement;
        if (o && o != null) {
           this.type = val;
        } else {
          this.type = 0;
        }
      },
      mouseleave(e) {
        this.type = 0;
      }
    }
  }
</script>


<style scoped >
  .main {
    width: 100%;
    height: 100%;
    background-image: url(/img/main-background.c59c7245.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .enc-main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  .enc-card {
    height: 340px;
    width: 240px;
    margin: 0 40px 0 40px;
    border-radius: 0;
    cursor: pointer;
  }
  .enc-card-hover {
    height: 380px;
    width: 240px;
    margin: 0 40px 0 40px;
    border-radius: 0;
    border-bottom: 4px solid #26a7ff;
    cursor: pointer;
  }
  .enc-img-style {
    text-align: center;
    height: 200px;
    vertical-align: middle;
    width: 240px;
    display: table-cell;
  }
  .enc-title-style {
    font-size: 24px;
    text-align: center;
    margin: 20px 0 20px 0;
    font-weight: 700;
    height: 80px;
  }
</style>
