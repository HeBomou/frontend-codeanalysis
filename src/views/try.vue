<template>
  <div>

    <a href="inviteLink"/>
  </div>
</template>

<script>
  export default {
    data(){

    },
    mounted(){
      console.log(this.$route.params);
      console.log(this.$route.query.haha);
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
