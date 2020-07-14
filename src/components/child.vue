<template>
    <div>
        <h1>child</h1>
        <h2>{{name}}</h2>
        <v-btn @click="cnm"></v-btn>
    </div>
</template>
<script>
export default {
    props:{
        name:{
            type:String,
            required:true
        },
        haha:{
            required:true
        }
    },
    methods:{
        cnm(){
            console.log(this.haha(1));
            this.$router.push("/login");
        }
    }
}
</script>