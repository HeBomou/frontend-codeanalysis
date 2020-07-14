<template>
    <div>
        <h2>子组件</h2>
        
        <p>{{message}}</p>
        
    </div>
</template>

<script>
export default {
    name: "child",
    
    // 子组件属性
    data(){
        return {
            message: "",
        }
    },

    // 子组件方法
    methods:{
        setMessage(msg){
            this.message = msg;
        }
    }
}
</script>