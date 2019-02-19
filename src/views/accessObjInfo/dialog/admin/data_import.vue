<template>
<div class="taskMDialog">
  <el-dialog title="导入" width="60%" :visible.sync="dialogVisible">
		<div class="title-gra plr30">
      <div class="grab gra-r">
        <span class="grab gra-l"></span>
      </div>
    </div>
			<div style="padding-bottom:0;">
				<el-table
					:data="importList.data"
					stripe
					height="300"
					style="width:100%"
					tooltip-effect="light"
					>
					<el-table-column
						label="字段中文名"
						width="180"
						prop="diyComments"
						show-overflow-tooltip>
					</el-table-column>
					<el-table-column
						label="字段名"
						prop="name"
						width="180">
					</el-table-column>
					<el-table-column
						prop="datatype"
						label="字段类型">
					</el-table-column>
					<el-table-column
						prop="length"
						label="字段长度">
					</el-table-column>
					<el-table-column
						prop="isNull"
						label="是否为空">
						<template slot-scope="scope">
							<span v-if="scope.row.isNull!='NO'">是</span>
							<span v-if="scope.row.isNull=='NO'">否</span>
						</template>
					</el-table-column>
					<el-table-column
						label="是否为主键">
						<template slot-scope="scope">
							<span v-if="scope.row.primaryKey">是</span>
							<span v-if="!scope.row.primaryKey">否</span>
						</template>
					</el-table-column>
					<el-table-column
						label="是否为索引">
						<template slot-scope="scope">
							<span v-if="scope.row.index">是</span>
							<span v-if="!scope.row.index">否</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="comments"
						label="描述" 
						show-overflow-tooltip
						>
						   <template slot-scope="scope">
                    <span  v-if="scope.row.diyComments==''||scope.row.diyComments==scope.row.comments">{{scope.row.comments}}</span>
										      <span v-else class="isRed">{{scope.row.comments}}</span>
                </template>
					</el-table-column>
				</el-table>
				<div class="mr-btn clearfix">
					<el-button type="primary" @click="cancel">取消</el-button>
					<el-button type="primary" @click="importCommit">确认导入</el-button>
				</div>
			</div>
  </el-dialog>
</div>
</template>
<script>
export default {
  name: "dataImport",
  data: function() {
    return {
			dialogVisible:true,
		
    };
  },
	props: {
    importList: {
      type: Object,
      required: true
    },
  },
	computed:{
	},
	components: {

  },
  methods: {
    cancel(){
			this.$emit('closeImport');
		},
		importCommit(){
			var formdata = new FormData();
			formdata.append('filePath',this.importList.filePath);
			formdata.append('objInfoId',this.importList.objInfoId);
			formdata.append('tableName',this.importList.tableName);
			formdata.append('accessSysDialectId',this.importList.accessSysDialectId);
			var _self = this;
			this.$ajax({
				url: window.ENV.API_DACM+'/objDetail/upLoadDetailExcelFile',
				method: 'post',
				data: formdata,
				headers: {'Content-Type': 'application:json'}
			}).then(function (res) {
				_self.$emit('closeImport');
			})
			.catch(function (err) {
				_self.$alert('导入失败', {
					confirmButtonText: '确定'
				});
			});
		}
  },
  mounted() {

  },
  created() {

  }
};

</script>
<style lang="scss" scoped>
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
.userSurveyDialog .el-dialog__body {
  padding-left: 0px;
  padding-right: 0px;
}
.dashboard-container {
  background: #fff;
  .filter-container {
    .right-tools{
      float:right;
      margin-right:10px;
      a{
        font-size:26px;
        color:#479ad8;
        :hover,
        :active{
          color:#f93;
        }
        i{
          font-size: 32px;
        }
      }
    }
    form{
      margin-right:100px;
    }
    .el-form-item{
      margin-bottom:2px;
			
    }
    .add-btn{
      float:right;
    }
  }
  .table-container {
    padding: 32px;
  }
	.el-table .cell .isRed{
		color: red;
	}
}
</style>
