<template>
  <div v-on:keyup.enter="search">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-text-field
            solo
            flat
            outlined
            rounded
            hide-details
            label=label
            append-icon="search"
            v-model="text"
            class="input-search"
            autocomplete="off"
            v-on="on"
            ref="search"
        ></v-text-field>
      </template>
      <v-list v-if="items.length > 0" class="border-list" dense
            flat
            outlined
            rounded>
        <v-list-item v-for="(item, index) in items" :key="index" @click="itemClick(item)">
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
// import createComponent from "@vue/composition-api";
export default{
  name: 'SearchComponent',
  props: {
    label:{
      type: String,
      required: true
    }
  },data () {
    return {
      text: '',
      showSelect: true,
      items: []
    }
  },
  watch: {
    text: 'inputHandle'
  },
  methods: {
    itemClick (item) {
      this.text = item.name
      this.$refs.search.blur()
      // this.$router.push() 
    },
    inputHandle (text) {
      if (text.trim() !== '') {
        this.showSelect = true
        setTimeout(() => {
          this.getEntity()
        }, 300)
      }
    },
    getEntity () {
      // 请求接口更新 items 数据
      this.items = [
        {
          key: '1234',
          name: '1234'
        },
        {
          key: 'abc',
          name: 'abc'
        },
        {
          key: 'def',
          name: 'def'
        },
        {
          key: 'ccc',
          name: 'ccc'
        },
        {
          key: 'ccc',
          name: 'ccc'
        },
        {
          key: 'ccc',
          name: 'ccc'
        }
      ]
    },
    search () {
      this.$refs.search.blur()
      //console.log(this.text)
      // this.$router.push()
    }
  }
}

</script>
<style scoped>
.input-search {
  width: 40%;
  margin: auto;
}
.width-20-percent {
  width: 20%;
}
.img-div {
  margin: 16vh 0 40px 0;
  text-align: center;
}
.v-menu__content {
  box-shadow: none !important;
}
.border-list {
  border: 1px solid #eee !important;
}
</style>
