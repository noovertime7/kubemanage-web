import router from './index'


const whiteList = ["/login", "/authredirect"];



const getToken = () => {
    return localStorage.getItem('token')
}