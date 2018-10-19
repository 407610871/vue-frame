<template>
  <div>
    <div class="main-label">{{mydata.name}}</div>
    <div class="line" v-bind:style="{backgroundColor:bgColor}">
      <div v-for="item in mydata.list" v-bind:style="{backgroundColor:item.color,width:item.number+'%'}"></div>
    </div>
    <div class="item-labels">
      <div v-for="item in mydata.list" class="item-label">
        <span class="label-color" v-bind:style="{backgroundColor:item.color}"></span>{{item.number}}% {{item.name}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dataCount',
  props: {
    dataObj: {
      type: Object,
      required: true
    }
  },
  computed: {
    mydata:function(){
      var max = 0;
      var obj = JSON.parse(JSON.stringify(this.dataObj));
      for(var value of this.dataObj.list){
        max += value.number;
      }
      for(var value of obj.list){
        value.number = Math.floor(100*(value.number/max));
      }
      return obj;
    },
    bgColor:function(){ //会出现+起来不满100%的情况，用这个把后面不满的补足，让长度看起来一致
      var color = 'transparent';
      if(this.dataObj.list.length>0){
        color = this.dataObj.list[this.dataObj.list.length-1].color;
      }
      return color;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .main-label{
    margin:0 0 10px 0;
    text-align: center;
    color:#999;
    font-size: 16px;
    font-weight: bold;
  }
  .line{
    height:8px;
    overflow: hidden;
    border-radius: 4px;
    div{
      float:left;
      height:8px;
      border-radius: 4px;
    }
  }
  .item-labels{
    margin:10px 0;
    font-size:12px;
    color:#666;
    text-align: center;
    .item-label{
      display: inline-block;
      margin: 0 10px;
      .label-color{
        display: inline-block;
        margin-right:8px;
        width:12px;
        height:12px;
        border-radius: 6px;
      }
    }
  }

</style>
