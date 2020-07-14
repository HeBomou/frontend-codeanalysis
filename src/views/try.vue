<template>
  <div id="app">
    <h2>父组件</h2>

    <!-- 注册子组件引用信息 -->
    <Child ref="child"></Child>

    <v-btn @click="setChildMessage">修改子组件数据</v-btn>

    <v-btn @click="callChildMessage">调用子组件方法</v-btn>

  </div>
</template>

<script>
import Child from "@/components/child.vue";

export default {
  name: "app",

  components: {
    Child
  },

  methods: {
    setChildMessage() {
      this.$refs.child.message = "haha";
    },

    callChildMessage(){
      this.$refs.child.setMessage("123");
    }
  }
};
</script>