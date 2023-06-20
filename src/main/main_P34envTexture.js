//目标：标准网格材质与光照物理效果

import * as THREE from "three"
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//导入动画库
import gsap from "gsap";
//导入dat.gui
import * as dat from "dat.gui";
import { Texture } from "three";

//1.创建场景
const scene = new THREE.Scene();

//2.创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//3.定义相机位置
camera.position.set(0, 0, 10);//x, y, z坐标
scene.add(camera);

//4.创建物体、添加物体
//单张纹理进度加载
let event = {};
event.onLoad = function(){
    console.log("加载完成");
};
event.onProgress = function(url, num, total){//url是图片加载地址，num，是图片加载进度，total是图片总数。加载进度百分比为num/total
    console.log("加载中")
};
event.onError = function(){
    console.log("加载错误");
};
//设置加载管理器，就不用单张进行加载了。TextureLoader在进行调用
const loadingManager = new THREE.LoadingManager(
    event.onLoad, event.onProgress, event.onError
);
//设置cube纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
    "textures/env/px.jpg",
    "textures/env/nx.jpg",
    "textures/env/py.jpg",
    "textures/env/ny.jpg",
    "textures/env/pz.jpg",
    "textures/env/nz.jpg",
]);
const cubeTextureLoader2 = new THREE.CubeTextureLoader();
const envMapTexture2 = cubeTextureLoader2.load([
    "textures/env/px_copy.jpg",
    "textures/env/nx_copy.jpg",
    "textures/env/py_copy.jpg",
    "textures/env/ny_copy.jpg",
    "textures/env/pz_copy.jpg",
    "textures/env/nz_copy.jpg",
]);
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.9,
    roughness: 0.1,
    envMap: envMapTexture
})

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
scene.background = envMapTexture2

//给物体追加灯光
const light = new THREE.AmbientLight(0xffffff, 0.5);//环境光，方向是从四面八方过来的
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)//直线光，平行光束.
directionalLight.position.set(10, 10, 10)//直线光源位置。如果没有环境光，背光面就可以看到是黑的
scene.add(directionalLight)

//5.初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
console.log(renderer);
document.body.appendChild(renderer.domElement);

//6.使用控制器查看3D物体
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;//设置控制器的阻尼，让控制器更有真实效果，但是必须在动画循环里调用 .update
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//设置时钟
const clock = new THREE.Clock();

//监听屏幕双击事件
window.addEventListener("dblclick", () => {
    const fullScreenElement = document.fullscreenElement;
    console.log(fullScreenElement)
    if (!fullScreenElement) {
        //双击控制屏幕进入全屏
        renderer.domElement.requestFullscreen();//请求进入
    } else {
        document.exitFullscreen();//退出全屏是文档对象退出
    }
})

function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);//请求动画帧函数。渲染每一帧
}

render();

//监听画面尺寸变化，更新渲染画面
window.addEventListener("resize", () => {
    console.log("画面变化了");
    camera.aspect = window.innerWidth / window.innerHeight;//更新摄像头
    camera.updateProjectionMatrix();//更新摄像头的投影矩阵
    renderer.setSize(window.innerWidth, window.innerHeight);//更新渲染器
    renderer.setPixelRatio(window.devicePixelRatio);//设置渲染器的像素比
})