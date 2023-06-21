//目标：点光源

import * as THREE from "three"
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//导入动画库
import gsap from "gsap";
//导入dat.gui
import * as dat from "dat.gui";
import { MeshBasicMaterial } from "three";
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

//设置一个小球当光源
const smalllBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 20, 20), 
    new THREE.MeshBasicMaterial({color:0xff0000})
);
smalllBall.position.set(2, 2, 2)

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
const pointLight = new THREE.PointLight(0xff0000, 1)//直线光，平行光束.
pointLight.position.set(2, 2, 2)//直线光源位置。如果没有环境光，背光面就可以看到是黑的
//scene.add(pointLight);
smalllBall.add(pointLight);//将光源追加给小球
scene.add(smalllBall)
//阴影设置
pointLight.castShadow = true;//光照投射阴影
pointLight.shadow.radius = 20;//设置阴影模糊度
pointLight.shadow.mapSize.set(512, 512);//设置阴影贴图的分辨率


// 移动球体
const gui = new dat.GUI();
gui
    .add(pointLight.position, "x")
    .min(-5)
    .max(5)
    .step(0.1)
    .onChange(() => {
        //directionalLight.shadow.camera.updateProjectionMatrix()
    })

gui.add(pointLight, "distance").min(0).max(50).step(0.01);
gui.add(pointLight, "decay").min(0).max(5).step(0.01);

//5.初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;//开启场景中的阴影贴图
//renderer.useLegacyLights = true;//使用decay要使用这个
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
    let time = clock.getElapsedTime();
    smalllBall.position.x = Math.sin(time) * 3;//X轴平滑运动.  sin(time)的值范围在-1到1，乘以3则变为-3到3
    smalllBall.position.z = Math.cos(time) * 3;
    smalllBall.position.y = 2 + Math.sin(time * 10) * 0.5
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