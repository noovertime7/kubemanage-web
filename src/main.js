import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'
import 'element-plus/dist/index.css'
import * as ELIcons from '@element-plus/icons-vue'
const app = createApp(App)
for (let iconName in ELIcons) {
    app.component(iconName,ELIcons[iconName])
}
app.use(ElementPlus)
app.use(router)
app.mount('#app')
