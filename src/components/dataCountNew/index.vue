<template>
  <div>
    <div class="main-label">{{mydata.name}} {{mydata.total}}</div>
    <div class="line" v-bind:style="{backgroundColor:bgColor}">
      <div v-for="item in mydata.list" v-bind:style="{backgroundColor:item.color,width:item.number+'%'}"></div>
    </div>
    <div class="item-labels">
      <div v-for="item in mydata.list" class="item-label">
        <span class="label-color" v-bind:style="{backgroundColor:item.color}"></span>{{item.label}} {{item.name}}
      </div>
    </div>
  </div>
</template>
<script>
 import { mapState } from 'vuex'
export default {
  name: 'dataCount',
  data() {
    return {
      defaultColor: ["#f90", "#069", "#999", "#900", "#47aa65", "#ffd866", "#66efff"],
      userThemes:{}
    }
  },
  props: {
    dataObj: {
      type: Object,
      required: true
    }
  },
  computed: {
    getUserThemes(){
     return this.$store.state.userThemes;
    },
    mydata: function() {
      var max = 0;
      this._getColor();
      var obj = JSON.parse(JSON.stringify(this.dataObj));
      for (var value of this.dataObj.list) {
        max += parseFloat(value.data);
      }
      var color = obj.color ? obj.color : this.defaultColor;
      for (var i = 0; i < obj.list.length; i++) {
        obj.list[i].number = Math.floor(100 * (parseFloat(obj.list[i].data) / max));
        obj.list[i].label = obj.list[i].data;
        obj.list[i].total = obj.list[i].total ? obj.list[i].total : '';
        delete obj.list[i].data;
        obj.list[i].color = color[i];
      }
      return obj;
    },
    bgColor: function() { //会出现+起来不满100%的情况，用这个把后面不满的补足，让长度看起来一致
      var color = 'transparent';
      if (this.mydata.list.length > 0) {
        color = this.mydata.list[this.mydata.list.length - 1].color;
      }
      return color;
    }
  },
  methods: {
    _getColor() {
      if (window.localStorage.getItem('data-theme') == 'theme1') {
        this.defaultColor = [];
        this.defaultColor = ['#000e6a', '#5567be', '#7385d8', '#91a4f2', "#47aa65", "#ffd866", "#66efff"];
      }
      if (window.localStorage.getItem('data-theme') == 'theme2') {
        this.defaultColor = [];
        this.defaultColor = ['#448f6b', '#68a587', '#9ec5b2', '#dae9e1', '#91a4f2', "#47aa65", "#ffd866"];
      }
      if (window.localStorage.getItem('data-theme') == 'theme3') {
        this.defaultColor = [];
        this.defaultColor = ['#1ca9de', '#48b9e4', '#89d2ee', '#d2eef8', '#91a4f2', "#47aa65", "#ffd866"];
      }
      if (window.localStorage.getItem('data-theme') == 'theme4') {
        this.defaultColor = [];
        this.defaultColor = ['#8e764b', '#a4906d', '#c4b8a1', '#e8e4db', '#91a4f2', "#47aa65", "#ffd866"];
      }
    }
  },
  watch:{
    getUserThemes(){
      //console.log("454245");
      this._getColor();
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.main-label {
  margin: 0 0 10px 0;
  text-align: center;
  color: #999;
  font-size: 16px;
  font-weight: bold;
}

.line {
  height: 8px;
  overflow: hidden;
  border-radius: 4px;
  div {
    float: left;
    height: 8px;
  }
}

.item-labels {
  margin: 10px 0;
  font-size: 12px;
  color: #666;
  text-align: center;
  .item-label {
    display: inline-block;
    margin: 0 10px;
    .label-color {
      display: inline-block;
      margin-right: 8px;
      width: 12px;
      height: 12px;
      border-radius: 6px;
    }
  }
}

</style>
