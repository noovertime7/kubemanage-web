export default {
  k8sTerminalWs: "ws://localhost:6180/api/k8s/pod/webshell",
  //编辑器配置
  cmOptions: {
    // 语言及语法模式
    mode: "text/yaml",
    // 主题
    theme: "idea",
    // 显示行数
    lineNumbers: false,
    smartIndent: true, //智能缩进
    indentUnit: 4, // 智能缩进单元长度为 4 个空格
    styleActiveLine: true, // 显示选中行的样式
    matchBrackets: true, //每当光标位于匹配的方括号旁边时，都会使其高亮显示
    readOnly: false,
    lineWrapping: true, //自动换行
  },
};
