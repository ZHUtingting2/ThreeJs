import gsap from "gsap";
import * as THREE from "three"
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//目标：掌握gsap设置各种动画效果  依赖包安装命令npm install gsap

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
controls.enableDamping = true;//设置控制器的阻尼，让控制器更有真实效果，但是必须在动画循环里调用 .update
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//设置时钟
const clock = new THREE.Clock();

//设置动画
//在X轴方向移动
var animate1 = gsap.to(cube.position, {
    x: 5,
    duration: 5,
    ease: "power1.inOut",
    repeat: 2,//设置重复的次数，无限制循环值就为-1
    yoyo: true,//往返运动
    delay: 2,//延迟两秒
    onComplete: () => { console.log("动画完成") },
    onStart: () => { console.log("动画开始") }
});//动画cube的位置，是以长度为5的X轴方向，时间为5秒的属性进行移动。ease代表速度运动曲线 
//在X轴旋转
gsap.to(cube.rotation, {
    x: 2 * Math.PI,
    duration: 5,
    ease: "power1.inOut"
})//旋转360度
//监听屏幕双击事件
window.addEventListener("dblclick", () => {
    //请注意，运动状态isActive是一个函数方法！！！必须要加括号！
    if (animate1.isActive()) {
        animate1.pause();//如果在运动状态则暂定动画
    } else {
        animate1.resume();//恢复运动
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