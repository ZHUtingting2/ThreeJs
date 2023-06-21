//目标：标准网格材质与光照物理效果

import * as THREE from "three"
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//导入动画库
import gsap from "gsap";
//导入dat.gui
import * as dat from "dat.gui";
import { Texture } from "three";


//创建进度盒子
var div = document.createElement("div");
div.style.width = "200px";
div.style.height = "200px";
div.style.position = "fixed";
div.style.right = 0;
div.style.top = 0;
div.style.color = "#fff";
document.body.appendChild(div);

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
    console.log("加载中");
    let value = ((num / total) * 100).toFixed(2) + "%";
    div.innerHTML = value;
};
event.onError = function(){
    console.log("加载错误");
};
//设置加载管理器，就不用单张进行加载了。TextureLoader在进行调用
const loadingManager = new THREE.LoadingManager(
    event.onLoad, event.onProgress, event.onError
);
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load("./textures/door.png");//创建纹理
const alTextture = textureLoader.load("./textures/white.png", event.onLoad, event.onProgress, event.onError);
const AoTextture = textureLoader.load("./textures/doorLine.png");
const heightTextture = textureLoader.load("./textures/height2.png");//导入置换贴图
const roughnessTextture = textureLoader.load("./textures/roughness.png");//导入粗糙度贴图
const metalnessTextture = textureLoader.load("./textures/metalness.png");//导入金属贴图
const normalTextture = textureLoader.load("./textures/normal.png");//导入法线贴图

//texture纹理显示设置
//texture.minFilter = THREE.NearestFilter;
//texture.magFilter = THREE.NearestFilter;
console.log(texture);

//const cubGeomery = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);
const cubGeomery = new THREE.BoxGeometry(2, 2, 2, 100, 100, 100);
const material = new THREE.MeshStandardMaterial({ //这个材质必须要有光才能看见
    color: "#ffff00", 
    map: texture,  
    alphaMap: alTextture, //利用黑白图片设置做透明纹理。黑色背景能设置为透明
    transparent: true, //材质是否透明
    aoMap: AoTextture,//环境贴图
    aoMapIntensity: 1,//换境贴图强度
    displacementMap: heightTextture,
    displacementScale: 0.08,//最大突出限制0.3公分
    roughness: 1, //粗糙度为0，代表非常光滑
    roughnessMap: roughnessTextture,
    metalness: 1,//金属度，1为金属
    metalnessMap: metalnessTextture,
    normalMap: normalTextture,
    opacity: 1,
    side: THREE.DoubleSide,
});
const cube = new THREE.Mesh(cubGeomery, material);
scene.add(cube);
//给cube设置第二组UV
cubGeomery.setAttribute("uv2", new THREE.BufferAttribute(cubGeomery.attributes.uv.array, 2))
//添加平面
const planeGeometry = new THREE.PlaneBufferGeometry(2, 2, 200, 200)//设置凹凸。平面是两个坐标点
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(3, 0, 0);
scene.add(plane);
//给平面设置第二组UV
planeGeometry.setAttribute("uv2", new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2))
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