<template>
<div id="codeView" v-highlight>
    <pre><code v-html="code"></code></pre>
</div>
</template>

<script>
// import ItemTemplate from './ItemTemplate.vue'
export default {
  data () {
    return {
      code: "int i = 0;\n\treturn i;"
    }
  }
}
</script>