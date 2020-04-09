<template>
  <div>

    <div class="form-container">
      haha
    </div>
  </div>
</template>

<script>
  import {addUser, addSession} from "../request/api"
  export default {
    name: 'Login',
    computed: {
      screenHeight() {
        return document.documentElement.clientHeight;
      }
    },

    data (){
      return {
        errMsg: "",
        dialog: false,
        imageUrls: [
          {
              src: require("@/assets/images/login/1.jpg"),
          },
          {
              src: require("@/assets/images/login/2.jpg"),
          },
          {
              src: require("@/assets/images/login/3.jpg"),
          },
          {
              src: require("@/assets/images/login/4.jpg"),
          },
          {
              src: require("@/assets/images/login/5.jpg"),
          }
        ],
        loginPressed: false,//用于更改login按钮为转菊花
        signUpPressed: false,//用于更改signup按钮为转菊花
        is_signup: 0,//是否是注册
        userName: "",
        password: "",
        confirmPassword: "",
        email: "",
        passwordRules: [
          v => !!v || "password is required",
          v => (v.length >= 6 || this.is_signup == 0) || "密码最少六位"
        ],
        passwordConfirmRules: [
          v => !!v || "please confirm your password",
          v => v === this.password || "not equal, check your password"
        ],
        emailRules: [
          v => !!v || "E-mail is required",
          v => (/.+@.+\..+/.test(v) || this.is_signup == 0) || "E-mail must be valid"
        ],
        valid: false
      }
    },
    methods: {
      clear() {
          this.$refs.form.reset();
      },
      //登录
      async login() {
        //console.log(this.$store.state.userId);
        this.loginPressed = true;
        await addSession(this.userName, this.password).then(res => {
            this.$store.commit('setUserId', res.data);
            //TODO:debug
            //this.$store.commit('setUserId', 233);
            //console.log(this.$store.state.userId);
            this.$router.push('/project');
        }).catch(err => {
          this.loginPressed =false;
          this.Alert(err.response.data.errMsg);
        });

      },
      async register() {
        //const res = await addUser(null, this.userName, this.password);
        //console.log(res);
        this.signUpPressed = true;
        addUser(null, this.userName, this.password).then(res => {
          console.log(res);
          this.signUpPressed = false;
          this.Alert("注册成功");
        })
          .catch(err => {
            console.log(err.response.data.errMsg);
            this.signUpPressed = false;
            this.Alert(err.response.data.errMsg);
          })
      },
      Alert(msg){
        this.errMsg = msg;
        this.dialog = true;
      },
      isAdmin(){
        this.$router.push("/adminLogin");
      }
    }
  }
</script>
<style scoped>
    .form-container {
        /*background-color: white;*/
        position: absolute;
        left: 0;
        margin-left: calc((100% - 317px) / 2);/* 里面的大小应该与这个表单的宽度相同，可以让他处于中间 */
        top: 0;
        margin-top: 40px;
        /*margin-top: calc( (100% - 600px) / 2);*/
    }

</style>
