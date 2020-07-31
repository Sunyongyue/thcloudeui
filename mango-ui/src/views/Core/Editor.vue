<template>
  <div>
    <div ref="editor" style="text-align:left"></div>
  </div>
</template>

<script>
import E from "wangeditor";

export default {
  name: "editor",
  props: {
    editorContent: {
      // //富文本编辑器内容
      type: String,
      default: "欢迎使用富文本"
    },
    show:{
        type:Boolean,
        default:true
    }
  },
  data() {
    return {
        content:''
    };
  },
  methods: {
    getContent: function() {
       this.$emit('getContent', this.content)
    }
  },
  mounted() {
    var editor = new E(this.$refs.editor);
     editor.customConfig.uploadImgShowBase64 = true
     editor.customConfig.zIndex = 30000
    editor.customConfig.onchange = html => {
      this.content = html;
      this.getContent();
    };
    editor.create();
    editor.txt.html(this.editorContent)
    //控制可否输入
    editor.$textElem.attr('contenteditable', this.show)
    
  }
};
</script>

<style scoped>
</style>
