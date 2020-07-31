<template>
  <div>
     <el-link type="primary" href="/static/file/微信公众号.docx">主要链接</el-link>
    <editor @getContent="getContent" ></editor>
<editor @getContent="getContent" :editorContent="date2"></editor>
  </div>
</template>

<script>
import Editor from "@/views/Core/Editor";

export default {
  components: {
    Editor
  },
  data() {
    return {
      date:"456784153231",
      date2:"date2456784153231",
    };
  },
  methods: {
    getContent: function(data) {
      console.log(data);
    }
  },
  mounted() {}
};
</script>

<style scoped>
</style>
