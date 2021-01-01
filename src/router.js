import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter)

import homepdf from '@/components/homepdf';
import homeword from "@/components/homeword";

import pdfmerge from "@/components/pdfActions/pdfmerge";
import pdfsplit from "@/components/pdfActions/pdfsplit";

//定义routes路由的集合，数组类型
const routes=[
    //单个路由均为对象类型，path代表的是路径，component代表组件
    {path:"/pdf",component:homepdf},
    {path:"/word",component:homeword},
    {path:"/pdf/merge",component:pdfmerge},
    {path:"/pdf/split",component:pdfsplit},
]

//实例化VueRouter并将routes添加进去
const router=new VueRouter({
//ES6简写，等于routes：routes
    mode: "history",
    routes
});

//抛出这个这个实例对象方便外部读取以及访问
export default router