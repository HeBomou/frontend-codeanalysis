<template>
  <div>
        <!--    <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" height="100%">-->
    <SnackbarAlertComponent ref="snackbar_alert_component"></SnackbarAlertComponent>
    <DialogAlertComponent ref="dialog_alert_component"></DialogAlertComponent>
    <v-dialog
      v-model="dialog"
      width="500">
      <v-card>
        <v-card-title>{{errMsg}}</v-card-title>
        <v-card-text>
           <v-btn color="error" @click="dialog=false">确定</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-carousel
      cycle
      :height="screenHeight"
      hide-delimiter-background
      show-arrows-on-hover
      fluid
    >
      <v-carousel-item
        v-for="(item,i) in imageUrls"
        :key="i"
        :src="item.src">
        <v-overlay absolute
          opacity="0.8"
        >
        </v-overlay>
      </v-carousel-item>
    </v-carousel>
    <div class="form-container">
      <v-col>
        <v-row align="center" justify="center" class="mt-0 mt-lg-4">
        </v-row>
        <v-row align="center" justify="center">
          <div style="font-size: 20px" class="white--text">Welcome to</div>
        </v-row>
        <v-row align="center" justify="center">
          <div class="font-italic font-weight-black white--text"
            style="margin-bottom: 20px;font-size: 45px"> Happy6+
          </div>
          <div class="font-italic font-weight-black white--text"
            style="margin-top: -40px;font-size: 25px">admin
          </div>
        </v-row>
        <v-row align="center" justify="center">
          <v-card
            width="100%"
            align="center"
            justify="center"
            elevation="15"
            style="background-color: #333333"
          >
            <v-row align="center" justify="center" class="mt-4 mb-4">
              <v-btn-toggle
                v-model="is_signup"
                mandatory
                rounded
              >
              <!-- 用这个组件控制登录或注册 -->
                <v-btn>sign in</v-btn>
                <v-btn>sign up</v-btn>
              </v-btn-toggle>
            </v-row>
            <v-form
              v-model="valid"
              ref="form"
            >
              <v-text-field
                class="mr-5 ml-5"
                v-model="userName"
                label="Admin Id"
                clearable
                required
                flat
                outlined
                rounded
                dark
              ></v-text-field>
              <v-text-field
                class="mr-5 ml-5"
                v-model="inviteCode"
                :rules="inviteCodeRules"
                label="Invite code"
                required
                v-if="is_signup == 1"
                flat
                outlined
                rounded
                dark
              ></v-text-field>
              <v-text-field
                class="mr-5 ml-5"
                v-model="password"
                :rules="passwordRules"
                type='password'
                label="Password"
                clearable
                required
                flat
                outlined
                rounded
                dark
              ></v-text-field>
              <v-text-field
                class="mr-5 ml-5"
                v-model="confirmPassword"
                :rules="passwordConfirmRules"
                label="Confirm password"
                type='password'
                required
                v-if="!is_signup == 0"
                flat
                outlined
                rounded
                dark
              ></v-text-field>
              <v-btn
                class="mr-5 ml-5"
                color="success"
                v-if="is_signup == 0"
                :disabled="!valid"
                @click="login"
              >login
              </v-btn>
              <v-btn
                class="mr-5 ml-5"
                color="success"
                v-if="is_signup == 1"
                :disabled="!valid"
                @click="register"
              >sign up
              </v-btn>
              <v-btn
                class="mr-5 ml-5"
                v-if="is_signup == 1"
                @click="clear"
              >clear
              </v-btn>
            </v-form>
            <v-row class=" mt-3 mr-5 ml-5" align="center" justify="center">
                <v-btn text color="blue" v-if="is_signup==0">
                    forgot password?
                </v-btn>
            </v-row>
            <v-row class="mr-5 ml-5 mb-5" align="center" justify="center">
                <v-btn text color="blue" v-if="is_signup==0" @click="isUser">
                    is user?
                </v-btn>
            </v-row>
          </v-card>
        </v-row>
      </v-col>
    </div>
  </div>
</template>

<script>
  import {postAdmin, addAdmin} from "../request/api";
  import SnackbarAlertComponent from "../components/SnackbarAlert";
  import DialogAlertComponent from "../components/DialogAlert";
  export default {
    name: 'Login',
    computed: {
      screenHeight() {
        return document.documentElement.clientHeight;
      }
    },
    components: {
      SnackbarAlertComponent,
      DialogAlertComponent
    },

    data (){
      return {
        errMsg: "",
        dialog: false,
        imageUrls: [
          {
              src: require("@/assets/images/login/3.jpg"),
          },
          {
              src: require("@/assets/images/login/4.jpg"),
          },
        ],
        is_signup: 0,//是否是注册
        userName: "",
        password: "",
        inviteCode: "",
        confirmPassword: "",
        passwordRules: [
          v => !!v || "password is required",
          v => (v.length >= 6 || this.is_signup == 0) || "密码最少六位"
        ],
        passwordConfirmRules: [
          v => !!v || "please confirm your password",
          v => v === this.password || "not equal, check your password"
        ],
        inviteCodeRules: [
          v => !!v || "invite code is required",
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
        ////console.log(this.$store.state.userId);
        await postAdmin(this.userName, this.password).then(res => {
            this.$store.commit("setAdminName", this.userName);
            this.$store.commit('setAdminId', res.data);
            this.$router.push('/admin');
        }).catch(err => {
          this.Alert(err.response.data.errMsg);
        });

      },
      async register() {
        //const res = await addUser(null, this.userName, this.password);
        ////console.log(res);
        addAdmin(this.userName, this.password, this.inviteCode).then(res => {
          console.log(res);
          this.snack("注册成功");
        })
          .catch(err => {
            //console.log(err.response.data.errMsg);
            this.Alert(err.response.data.errMsg);
          })
      },
      Alert(msg){
        // this.errMsg = msg;
        // this.dialog = true;
        this.dialog_alert(msg);
      },
      snack(msg, btns){
        this.$refs.snackbar_alert_component.snack(msg, btns);
      },
      dialog_alert(msg, func1, func2){
        this.$refs.dialog_alert_component.Alert(msg, func1, func2);
      },
      isUser(){
        this.$router.push('/login');
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
        top: 40px;
        /*margin-top: calc( (100% - 600px) / 2);*/
    }

</style>
