<template>
<div>
  <v-autocomplete :items="items" v-model="item"  @update-items="updateItems">
  </v-autocomplete>
  <v-btn @click="cnm">haha</v-btn>
</div>
</template>

<script>
// import ItemTemplate from './ItemTemplate.vue'
export default {
  data () {
    return {
      item: "123",
      items: [
          "haha",
          123,
          234
      ],
    //   template: ItemTemplate
    }
  },
  methods: {
    updateItems (text) {
        text;
    //   yourGetItemsMethod(text).then( (response) => {
    //     this.items = response
    //   })
    },
    cnm(){
        console.log(this.item)
    }
  }
}
</script>