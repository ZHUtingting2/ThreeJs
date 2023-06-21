//目标：聚光灯

import * as THREE from "three"
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//导入动画库
import gsap from "gsap";
//导入dat.gui
import * as dat from "dat.gui";
//import { Texture } from "three";


//1.创建场景
const scene = new THREE.Scene();

//2.创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//3.定义相机位置
camera.position.set(0, 0, 10);//x, y, z坐标
scene.add(camera);

//4.创建物体、添加物体
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;//投射阴影
scene.add(sphere);
//创建平面
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, sphereMaterial);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;//旋转了90度
plane.receiveShadow = true;//接收阴影
scene.add(plane);


//给物体追加灯光
const light = new THREE.AmbientLight(0xffffff, 0.5);//环境光，方向是从四面八方过来的
scene.add(light);
const spotLight = new THREE.SpotLight(0xffffff, 1)//直线光，平行光束.
spotLight.intensity = 2;//这个也是光源亮度的调节
spotLight.position.set(5, 5, 5)//直线光源位置。如果没有环境光，背光面就可以看到是黑的
scene.add(spotLight);
//阴影设置
spotLight.castShadow = true;//光照投射阴影
spotLight.shadow.radius = 20;//设置阴影模糊度
spotLight.shadow.mapSize.set(2048, 2048);//设置阴影贴图的分辨率
spotLight.target = sphere; //将聚光目标给到球体
spotLight.angle = Math.PI / 6;//设置聚光灯角度，为30度
spotLight.distance = 0;//从光源发出的最大距离
spotLight.penumbra = 0;//聚光锥的半影衰减百分比，在0-1之间
spotLight.decay = 0;//沿着光照的衰减量，默认为1

// 移动球体
const gui = new dat.GUI();
gui
    .add(sphere.position, "x")
    .min(-5)
    .max(5)
    .step(0.1)
    .onChange(() => {
        //directionalLight.shadow.camera.updateProjectionMatrix()
    })
gui.add(spotLight, "angle").min(0).max(Math.PI / 2).step(0.01);
gui.add(spotLight, "distance").min(0).max(20).step(0.01);
gui.add(spotLight, "penumbra").min(0).max(1).step(0.01);
gui.add(spotLight, "decay").min(0).max(5).step(0.01);
//5.初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;//开启场景中的阴影贴图
renderer.useLegacyLights = true;//使用decay要使用这个
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