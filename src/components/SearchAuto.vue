<template>
    <v-autocomplete
        :items="items"
        v-model="item"
        @update-items="$emit('update-items','更新')"
    >
    </v-autocomplete>
</template>
<script>
export default {
    name: 'SearchComponent',
    props: {
        items:{
            required: true
        },
        item:{
            required: true
        }   
    },
    computed: {
        item_: {
            get() {
                return this.item;
            }, set(val){
                this.$emit("on-item-change", val);
            }
        }
    }
}
</script>