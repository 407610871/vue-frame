<template>
    <div class="percent-vis" ref="root" v-bind:style="{width: width + 'px', padding: padding + 'px'}">
      <div id="title">
        {{title}}
      </div>

      <div  ref="canvas" v-for="d in data" class="percent" v-bind:style="{height: height + 'px', width: d.percent * (width - 2 * padding) + 'px', background: d.color, borderRadius: height/2 + 'px'}">
      </div>

      <div id="text" v-bind:style="{width: width - 2 * padding + 'px', padding: padding + 'px'}">

          <div v-for="d in data" style="display: inline-flex; margin-top: 5px;marginRight: 10px">

            <div v-bind:style="{height: 6 + 'px',width: 6+'px',borderRadius : 3+'px',background: d.color,marginTop:4+'px'}">
           </div>

            <label style="font-size: 10px"> {{(d.percent * 100).toFixed(2) + "% " + d.name}}</label>

        </div>
      </div>

    </div>
</template>

<script>
  export default {
        name: "PercentVis",

        data(){
          return {
            title:'实时接入',
            width: 400,
            padding: 40,
            height : 10,
            data:[
              {
                name:'FTP',
                amount:100,
                color:'red'
              },
              {
                name:'MYSQL',
                amount:150,
                color:'green'
              },
              {
                name:'ORACLE',
                amount:250,
                color:'yellow'
              },
              {
                name:'ORACLE1',
                amount:250,
                color:'#999e3f'
              }
              ,
              {
                name:'ORACLE2',
                amount:250,
                color:'#eeeeee'
              },
              {
                name:'ORACLE3',
                amount:250,
                color:'#912'
              },
              {
                name:'ORACLE4',
                amount:250,
                color:'blue'
              }
            ]
          }
        },
      methods:{
          calculate() {
            var sum = 0;
            this.data.map(d => {
              sum += d.amount;
            });

            if(sum !== 0) {
              this.data.map(d => {
                d.percent = d.amount / sum;
              });
            }
          }
      },
    beforeMount(){
          this.calculate();
    }
    }
</script>

<style scoped>
  .percent-vis{
    padding: 30px;
    width: 400px;
  }

  #title{
    text-align: center;
    font-size: 30px;
  }


  .percent{
    margin-left: -7px;
    margin-top: 20px;
    float: left;
    display: inline;

  }

</style>
