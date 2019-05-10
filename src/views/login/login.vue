<template>
        <div class="login-wrap">
            <div class="login-header">
                <img :src="loginHeader" alt="">
            </div>
            <div class="ms-login">
                <div class="left"></div>
                <div class="login-content">
                    <div class="title">
                        <span>用户登陆</span>
                    </div>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
                        <el-form-item prop="username">
                            <el-input v-model="ruleForm.username" placeholder="请输入用户名">
                                 <i slot="prefix" class="el-input__icon el-icon-s-custom"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                                 <i slot="prefix" class="el-input__icon el-icon-unlock"></i>
                            </el-input>
                        </el-form-item>
                        <div class="login-btn">
                            <el-button style="width:100%" type="primary" @click="submitForm('ruleForm')">登录</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
</template>

<script>
  import login_header from "@/assets/images/login-header.png";

    export default {
        data: function(){
            return {
                loginHeader: login_header,
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const options = {
                            username: this.ruleForm.username,
                            password: this.ruleForm.password
                        }
                        this.$keycloak.login(options);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
    .login-wrap{
        height: 100%;
        display: flex;
        flex-direction: column;
        background: url('../../assets/images/login-background.png') no-repeat;
        width:100%;
        background-size: cover;
    }
    .login-header {
        height: 150px;
        img {
            margin: 50px 0px 0px 40px;
        }
    }
    .ms-login {
        flex: 1;
        display: flex;
        justify-content: flex-end;
    }
    .login-content {
        width: 300px;
        height: 300px;
        padding: 20px;
        margin-top: 10px;
        margin-right: 20px;
        text-align: center;
        background: #fff;
        border-radius: 0;
        .title{
            font-size: 24px;
            font-weight: normal;
            color: #26a7ff;
            font-family: inherit;
            padding: 20px 0 40px 0;
        }
    }
    .el-input__icon {
        font-size: 21px;
        margin-top: 2px;
        color: #26a7ff;
    }
</style>

