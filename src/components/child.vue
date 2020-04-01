<template>
    <div>
        <h1>child</h1>
        <h2>{{name}}</h2>
    </div>
</template>
<script>
export default {
    name: 'Chile',
    props:{
        name:{
            type:String,
            required:true
        }
    }
}
</script>