import * as THREE from "three"
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//目标：clock 跟踪时间

//1.创建场景
const scene = new THREE.Scene();

//2.创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//3.定义相机位置
camera.position.set(0, 0, 10);//x, y, z坐标
scene.add(camera);

//4.创建物体、添加物体
const cubeGeomery = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(cubeGeomery, cubeMaterial);


//旋转
cube.rotation.set(Math.PI / 4, 0, 0, "XYZ");//Math.pi代表π，π/4就等于45°，所以此处就代表x轴旋转了45°，Y,Z为0不变，按照“XYZ”方向旋转
scene.add(cube);
console.log(cube);

//5.初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
console.log(renderer);
document.body.appendChild(renderer.domElement);

//6.使用控制器查看3D物体
const controls = new OrbitControls(camera, renderer.domElement);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//设置时钟
const clock = new THREE.Clock();
function render() {
    //前一帧和后一帧渲染时间间隔
    let deltaime = clock.getDelta();
    console.log("两次获取时间的间隔时间：", deltaime)
    //获取时钟运行的总时长
    let time = clock.getElapsedTime();
    console.log("时钟运行总时长：", time)
    let t = time % 5;//秒数
    cube.position.x = t * 1;//时间乘以速度，等于移动距离 
    renderer.render(scene, camera);
    requestAnimationFrame(render);//请求动画帧函数。渲染每一帧
}

render();