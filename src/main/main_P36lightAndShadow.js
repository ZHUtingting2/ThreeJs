//目标：灯光与阴影的关系和设置
//1、材质要满足能够对灯光的反应
//2、设置渲染器开启阴影的计算renderer.shadowMap.enabled = true;
//3、设置光照投射阴影 directionalLight.castShadow = true;
//4、设置物体投射阴影
//5、设置物体接收阴影

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
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const plane = new THREE.Mesh(planeGeometry, sphereMaterial);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;//旋转了90度
plane.receiveShadow = true;//接收阴影
scene.add(plane);

//给物体追加灯光
const light = new THREE.AmbientLight(0xffffff, 0.5);//环境光，方向是从四面八方过来的
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)//直线光，平行光束.
directionalLight.position.set(10, 10, 10)//直线光源位置。如果没有环境光，背光面就可以看到是黑的
//阴影设置
directionalLight.castShadow = true;//光照投射阴影
directionalLight.shadow.radius = 20;//设置阴影模糊度
directionalLight.shadow.mapSize.set(2048, 2048);//设置阴影贴图的分辨率
//设置平行光投射的相机属性
directionalLight.shadow.camera.near = 0.5;//近端面
directionalLight.shadow.camera.far = 500;//远端面
directionalLight.shadow.camera.top = 5;//上面
directionalLight.shadow.camera.bottom = -5;//下面
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5
scene.add(directionalLight)

//添加gui设置阴影
const gui = new dat.GUI();
gui
    .add(directionalLight.shadow.camera, "near")
    .min(0)
    .max(20)
    .step(0.1)
    .onChange(() => {
        directionalLight.shadow.camera.updateProjectionMatrix();//更新摄像机投影矩阵
    })

//5.初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;//开启场景中的阴影贴图
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