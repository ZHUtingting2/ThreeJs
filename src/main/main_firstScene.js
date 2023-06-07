import * as THREE from "three"


//1.创建场景
const scene = new THREE.Scene(); //构建新的场景对象 搜索：Scene

//2.创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //透视相机 搜索：Camera，对应参数：视野角度、屏幕宽高比、近端面，远端面

//3.定义相机位置
camera.position.set(0, 0, 10);//x, y, z坐标
scene.add(camera); //将相机添加到场景中

//4.创建物体、添加物体
const cubeGeomery = new THREE.BoxGeometry(1, 1, 1);//创建1个立方体 搜素：box
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });//定义物体的材质，采用基础网格材质,并定义颜色。搜索：Material
const cube = new THREE.Mesh(cubeGeomery, cubeMaterial);//根据几何体和材质创建物体
scene.add(cube);//将几何体添加到场景中

//5.初始化渲染器
const renderer = new THREE.WebGLRenderer();//搜索render
renderer.setSize(window.innerWidth, window.innerHeight);//定义渲染的尺寸大小
console.log(renderer);//后台会打印出WebGLRenderer
document.body.appendChild(renderer.domElement);//将webgl渲染的canvas内容添加到boby

//6.使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);//使用渲染器渲染

