<template>
  <div class="text-center">
    <v-switch v-model="closeOnContentClick" label="Close on content click"></v-switch>
    <v-menu top :close-on-content-click="closeOnContentClick">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Dropdown
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  export default {
   data: () => ({
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
      closeOnContentClick: true,
    }),
    mounted(){
      let m = new Map([
        [1, {id: 1, haha: 2}], [2, {id: 3, haha:4}]
      ]);
      //let haha = m.find(i => i.value.haha == 4);
      console.log(m.get(3));
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
