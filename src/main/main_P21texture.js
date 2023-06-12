//目标：详细认识材质纹理属性

import * as THREE from "three"
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//导入动画库
import gsap from "gsap";
//导入dat.gui
import * as dat from "dat.gui";

//1.创建场景
const scene = new THREE.Scene();

//2.创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//3.定义相机位置
camera.position.set(0, 0, 10);//x, y, z坐标
scene.add(camera);

//4.创建物体、添加物体
const textureLoader = new THREE.TextureLoader();
//const doorColorTexture = textureLoader.load("./textures/pic2.jpeg");//创建纹理
const doorColorTexture = textureLoader.load(require('../assets/imgs/pic2.jpeg'));//创建纹理
console.log(doorColorTexture);
//doorColorTexture.offset.x = 0.5
doorColorTexture.offset.set(0.5, 0.5);//纹理偏移。 范围是0-1
doorColorTexture.center.set(0.5, 0.5);//纹理旋转原点。及旋转的中心点
doorColorTexture.repeat.set(2, 3)//纹理重复。x重复两次，y重复3次
doorColorTexture.wrapS = THREE.RepeatWrapping;//设置纹理重复的模式（水平方向）
doorColorTexture.wrapT = THREE.MirroredRepeatWrapping;//设置纹理重复的模式（垂直方向）
doorColorTexture.rotation = Math.PI / 4;//纹理旋转。旋转了90度
const cubGeomery = new THREE.BoxGeometry(1, 1, 1);
const basicMaterial = new THREE.MeshBasicMaterial({ color: "#ffff00", map: doorColorTexture});
const cube = new THREE.Mesh(cubGeomery, basicMaterial);

scene.add(cube)


//旋转
cube.rotation.set(Math.PI / 4, 0, 0, "XYZ");//Math.pi代表π，π/4就等于45°，所以此处就代表x轴旋转了45°，Y,Z为0不变，按照“XYZ”方向旋转
//scene.add(cube);
//console.log(cube);


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