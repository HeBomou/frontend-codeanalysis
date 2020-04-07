<template>
<div>
  <v-treeview
  dense
  v-model="tree"
  :items="items"
  activatable
  item-key="str"
  item-text="str"
  open-on-click
  :open.sync="open"
  :active.sync="active"
 
  return-object
  >
    <template v-slot:prepend="{ item, open }">
      <!-- 如果是文件夹，则根据打开状况显示图标 -->
      <v-icon v-if="!item.file">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <!-- 否则根据文件类型显示图标 -->
      <v-icon v-else>
        {{ files[item.file] }}
      </v-icon>
    </template>
  </v-treeview>
  <v-btn @click="cnm">haha</v-btn>
  <v-btn @click="change">change</v-btn>
</div>
</template>

<script>
// import ItemTemplate from './ItemTemplate.vue'
export default {
  data () {
    return {
      tree: [],
      open: ['public'],
      active: [],
      items: [
        {
            name: '.git',
          },
          {
            str: 'node_modules',
          },
          {
            str: 'public',
            children: [
              {
                str: 'static',
                children: [{
                  str: 'logo.png',
                  file: 'png',
                }],
              },
              {
                str: 'favicon.ico',
                file: 'png',
              },
              {
                str: 'index.html',
                file: 'html',
              },
            ],
          },
          {
            str: '.gitignore',
            file: 'txt',
          },
          {
            str: 'babel.config.js',
            file: 'js',
          },
          {
            str: 'package.json',
            file: 'json',
          },
          {
            str: 'README.md',
            file: 'md',
          },
          {
            str: 'vue.config.js',
            file: 'js',
          },
          {
            str: 'yarn.lock',
            file: 'txt',
          },
      ],
      files: {
          html: 'mdi-language-html5',
          js: 'mdi-language-java',
          json: 'mdi-json',
          md: 'mdi-markdown',
          pdf: 'mdi-file-pdf',
          png: 'mdi-file-image',
          txt: 'mdi-file-document-outline',
          xls: 'mdi-file-excel',
          javaFunc: 'mdi-language-java'
        },
    }
  },
  methods: {
    cnm(){
      console.log("tree");
      console.log(this.tree);
      console.log("open");
      console.log(this.open);
      console.log("active");
      console.log(this.active);
    },
    updateActive(val){
      console.log("updateActive");
      console.log(val);
      this.active = val;
    },
    updateOpen(val){
      console.log("updateOpen");
      console.log(val);
      this.open = val;
    },
    change(){
      this.open= [{str: 'public'}];
    }
  }
}
</script>