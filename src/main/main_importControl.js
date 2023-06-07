import * as THREE from "three"
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
scene.add(cube);

//5.初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
console.log(renderer);
document.body.appendChild(renderer.domElement);

// //6.使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);


//7.使用控制器查看3D物体
const controls = new OrbitControls(camera, renderer.domElement)//创建轨道控制器
const axesHelper = new THREE.AxesHelper(5);//添加坐标辅助器，坐标长度设置为 5
scene.add(axesHelper);//将坐标添加到场景中 
function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);//请求动画帧函数。渲染每一帧
}

render();//调用函数