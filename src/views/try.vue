<template>
<div>
 <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!-- <i class="material-icons">face</i> -->
      <v-list-item
                v-for="(notice, i) in notices"
                :key="i"
                >
     <v-card style="width:800px" class="ml-10 mr-10 mt-10">
        <v-card-title>{{notice.title}} <v-spacer />{{notice.time}} </v-card-title>
        <v-card-text><div class="text-wrapper">{{notice.content}}</div></v-card-text>
        <v-card-actions style="position: relative">
            <v-speed-dial
                v-model="notice.dial"
                absolute
                direction="left"
                transition="slide-x-reverse-transition"
                class="haha"
                >
                <template v-slot:activator>
                    <v-btn 
                        fab 
                        color="pink" 
                        @click="notice.dial = !notice.dial"
                        
                    >
                      
                        <span v-if="notice.dial" class="material-icons white--text">chevron_right</span>
                        <span v-else class="material-icons white--text">chevron_left</span>
                    </v-btn>
                </template>
                <v-btn
                    fab
                    dark
                    small
                    color="red"
                >
                    <v-icon>delete</v-icon>
                </v-btn>
                <v-btn
                    fab
                    dark
                    small
                    color="green"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                
            </v-speed-dial>
        </v-card-actions>
    </v-card>
      </v-list-item>

</div>
</template>

<script>
export default {
  name: "app",

  components: {
   
  },
  data(){
    return {
       notices: [
                {title: "标题1", person: "leo", time: "2020-1-1", content: "-孙哥，他们去恰烧烤\n-你说的他们⾸先是谁，去那⾥恰，什么时候去的，我⼀问三不知。就我都没去，你都知道的，我，我不知道你⼀直在那⼉问。这种⼈是不是脑淤⾎啊我发觉，就别⼈不知道的⼀直在那问，那我叫你说你⼜说不归⼀，说不清楚。你⾃⼰是不是语⾔表达能⼒特别差，还是⾃⼰的脑回路有问题嘛。"},
                {title: "标题2", person: "yzj", time: "2020-1-1", content: "1111111111111111111111111          "},
                {title: "标题2", person: "yzj", time: "2020-1-1", content: "1111111111111111111111\n\n\n\n\n\n\n\n111          "},
                {title: "标题2", person: "yzj", time: "2020-1-1", content: "11111111111111111\n1\n\n1\n\n\n1\n\n\n1\n\n1\n\n\n1\n\n\n1\n\n1\n\n\n1\n\n11111\n\n\n\n\n\n\n\n111          "},{title: "标题2", person: "yzj", time: "2020-1-1", content: "11111111111111111\n1\n\n1\n\n\n1\n\n\n1\n\n1\n\n\n1\n\n\n1\n\n1\n\n\n1\n\n11111\n\n\n\n\n\n\n\n111          "},
            ],
    }
  },
  methods: {

  }
};
</script>
<style scoped>
.pa{position: absolute;}
.haha{position: absolute;top: 10;left: 90%}
.text-wrapper {
  white-space: pre-wrap;
}
</style>