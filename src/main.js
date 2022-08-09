import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'
import 'element-plus/dist/index.css'
import * as ELIcons from '@element-plus/icons-vue'
//codemirror编辑器
import { GlobalCmComponent } from "codemirror-editor-vue3";
// 引入主题 可以从 codemirror/theme/ 下引入多个
import 'codemirror/theme/idea.css'
import 'codemirror/theme/darcula.css'
// 引入语言模式 可以从 codemirror/mode/ 下引入多个
import 'codemirror/mode/yaml/yaml.js'
const app = createApp(App)
for (let iconName in ELIcons) {
    app.component(iconName,ELIcons[iconName])
}
//引入codemirror编辑器
app.use(GlobalCmComponent, { componentName: "codemirror" });
//引入element plus
app.use(ElementPlus)
app.use(router)
app.mount('#app')
