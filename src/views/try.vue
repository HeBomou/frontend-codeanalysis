<template>
<v-container fluid>
<v-btn @click="debug">debug</v-btn>
  <v-menu top offset-y :close-on-content-click="closeOnContentClick">
    <template v-slot:activator="{ on, attrs }">
        <v-list-item 
            v-bind="attrs"
            v-on="on"
        >
            <v-icon class="mr-3">
                mdi-clock
            </v-icon>
            Leo
        </v-list-item>
    </template>
    <v-list style="width: 100%">
        <div v-for="user in taskMember" :key="user.id">
            <v-list-item  style="width: 100%" @click.native="user.chosen=!user.chosen">
                <v-list-item-icon v-if="user.chosen">
                    <v-icon>mdi-plus</v-icon>
                </v-list-item-icon>
                <v-list-item-icon v-else>
                    <v-icon>mdi-mail</v-icon>
                </v-list-item-icon>
            </v-list-item>
        </div>
        
    </v-list>
</v-menu>
</v-container>
</template>

<script>
  export default {
   data: () => ({
      taskMember: [
        {id: 1, username: "leo", level: "manager", chosen: false},
        {id: 2, username: "yzj", level: "leader", chosen: true}
      ],
      closeOnContentClick: false
    }),
    mounted(){
      let m = new Map([
        [1, {id: 1, haha: 2}], [2, {id: 3, haha:4}]
      ]);
      //let haha = m.find(i => i.value.haha == 4);
      console.log(m.get(3));
    },
    methods:{
      debug(){
        this.taskMember.forEach(member=>{
          member.chosen = true;
        })
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
