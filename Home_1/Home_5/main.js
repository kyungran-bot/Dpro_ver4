import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

/* --------------------
  UI status helper
-------------------- */
const indicator = document.getElementById("scroll-indicator");
function status(msg) {
  // if (indicator) {
  //   indicator.style.opacity = "1";
  //   indicator.textContent = msg;
  // }
  console.log("[STATUS]", msg);
}

/* --------------------
  helpers
-------------------- */
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
function setOpacity(group, opacity) {
  group.traverse((obj) => {
    if (obj.material) {
      obj.material.transparent = true;
      obj.material.opacity = opacity;
      obj.material.needsUpdate = true;
    }
  });
}
function getScrollT() {
  const max =
    (document.documentElement.scrollHeight || document.body.scrollHeight) -
    window.innerHeight;
  if (max <= 0) return 0;
  return clamp01(window.scrollY / max);
}

/* --------------------
  Three base
-------------------- */
status("JS loaded. Creating renderer…");

const container = document.getElementById("canvas-container");
if (!container) {
  status("❌ #canvas-container not found (index.html 확인)");
  throw new Error("#canvas-container not found");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
container.appendChild(renderer.domElement);

status("Renderer attached. If you see nothing, cube will prove it.");

/* --------------------
  Camera (Ortho + Iso)
-------------------- */
let frustum = 300;
let camera;

function rebuildCamera() {
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(
    (-frustum * aspect) / 2,
    (frustum * aspect) / 2,
    frustum / 2,
    -frustum / 2,
    0.1,
    10000
  );
  camera.position.set(450, 450, 450);
  camera.lookAt(0, 0, 0);
}
rebuildCamera();

/* --------------------
  TEST OBJECT (무조건 보이게)
  - 이 큐브도 안 보이면 SVG 문제가 아니라 “렌더/캔버스/카메라” 문제
-------------------- */


/* --------------------
  Auto-fit camera to object
-------------------- */
function fitCameraToObject(obj, padding = 1.35) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  frustum = maxDim * padding;

  rebuildCamera();

  const d = maxDim * 1.2;
  camera.position.set(
    center.x + d * 0.01,   // ← 좌우 각도 미세조정
    center.y + d * 0.95,   // ← 위에서 내려보는 각도 조정
    center.z + d * 0.85    // ← 앞뒤 각도 조정
  );
  camera.lookAt(center);

  // status(`Camera fitted. frustum=${frustum.toFixed(1)} maxDim=${maxDim.toFixed(1)}`);
}

/* --------------------
  SVG -> Line Group
-------------------- */
const loader = new SVGLoader();

function svgToLineGroup(svgData, scale = 0.9) {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 1 });

  for (const path of svgData.paths) {
    for (const sp of path.subPaths) {
      const pts = sp.getPoints(200);
      if (!pts || pts.length < 2) continue;

      const pos = new Float32Array(pts.length * 3);
      for (let i = 0; i < pts.length; i++) {
        pos[i * 3 + 0] = pts[i].x;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = -pts[i].y;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const line = new THREE.Line(geo, mat.clone());
      group.add(line);
    }
  }

  group.scale.set(scale, scale, -scale);

  // center align
  const box = new THREE.Box3().setFromObject(group);
  const c = box.getCenter(new THREE.Vector3());
  group.position.x -= c.x;
  group.position.z -= c.z;

  return group;
}

/* --------------------
  Load both SVGs
-------------------- */
const root = new THREE.Group();
scene.add(root);

let g1 = null;
let g2 = null;

async function initSVG() {
  try {
    status("Loading SVGs…");

    // ✅ 파일명이 실제로 index.html과 같은 폴더에 있어야 함
    const [svg1, svg2] = await Promise.all([
      loader.loadAsync("Dproweb1.svg"),
      loader.loadAsync("Dproweb2.svg"),
    ]);

    status("SVG loaded. Building line groups…");

    const isMobile = window.innerWidth <= 1080;
    const modelScale = isMobile ? 0.35 : 0.6;
    const cameraPadding = isMobile ? 2.5 : 1.35;

    g1 = svgToLineGroup(svg1, modelScale);
    g2 = svgToLineGroup(svg2, modelScale);

    root.add(g1);
    root.add(g2);

    // 초기 상태
    setOpacity(g1, 1);
    setOpacity(g2, 0);
    g2.scale.y = 0.02;
    g1.scale.y = 0.25;

    // 카메라를 SVG 기준으로 맞춤
    fitCameraToObject(root, cameraPadding);

    status("");
  } catch (e) {
    console.error(e);
    // 여기까지 왔는데도 에러 표시가 화면에 안 보이면, DOM/CSS 문제일 확률 큼
    status("❌ SVG load/build failed. 콘솔을 확인해줘 (Network/CORS/경로)");
  }
}
initSVG();

/* --------------------
  Scroll animation
-------------------- */
function update() {
  if (!g1 || !g2) return;

  const t = getScrollT();
  const xfade = smoothstep(0.12, 0.65, t);
  const grow = smoothstep(0.25, 1.0, t);

  setOpacity(g1, 1 - xfade);
  setOpacity(g2, xfade);

  g2.scale.y = THREE.MathUtils.lerp(0.02, 1.0, grow);
  g2.position.y = THREE.MathUtils.lerp(-10, 0, grow);

  // 초반 안내는 살짝만
  if (indicator) indicator.style.opacity = t < 0.12 ? "0.55" : "0";
}

/* --------------------
  Render loop
-------------------- */
function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}
animate();

/* --------------------
  Raycaster for clicking
-------------------- */
const raycaster = new THREE.Raycaster();
raycaster.params.Line.threshold = 5; // Increase hit detection area for lines
const mouse = new THREE.Vector2();

function onDocumentDblClick(event) {
  event.preventDefault();

  // Calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  // intersections include children of root (g1, g2 lines)
  const intersects = raycaster.intersectObjects(root.children, true);

  if (intersects.length > 0) {
    status("SVG Clicked! Transitioning…");
    showNextScreen();
  }
}

function showNextScreen() {
  isTOCVisible = true;
  const nextScreen = document.getElementById("next-screen");
  const canvasContainer = document.getElementById("canvas-container");
  const scrollTrack = document.getElementById("scroll-track");

  if (nextScreen) {
    nextScreen.style.display = "flex"; // Changed from block to flex to match CSS
    nextScreen.style.opacity = "0";
    setTimeout(() => {
      nextScreen.style.transition = "opacity 0.5s ease-in-out";
      nextScreen.style.opacity = "1";
    }, 10);
  }
  if (canvasContainer) canvasContainer.style.display = "none";
  if (scrollTrack) scrollTrack.style.display = "none";

  document.body.style.overflow = "hidden";
}

function showHomeScreen() {
  const nextScreen = document.getElementById("next-screen");
  const canvasContainer = document.getElementById("canvas-container");
  const scrollTrack = document.getElementById("scroll-track");

  if (nextScreen) nextScreen.style.display = "none";
  if (canvasContainer) canvasContainer.style.display = "block";
  if (scrollTrack) scrollTrack.style.display = "block";

  document.body.style.overflow = "auto";
}

window.addEventListener('dblclick', (e) => {
  showNextScreen();
});

let hasInteracted_5 = false;
let isTOCVisible = false;

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    hasInteracted_5 = true;
  }
});

// Add listener for Home button
document.addEventListener("DOMContentLoaded", () => {
  const homeBtn = document.querySelector(".home-button");
  if (homeBtn) {
    homeBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering onDocumentClick
      redirectToRandomHome();
    });
  }

  // Hover Interaction Logic
  const trigger = document.querySelector(".hover-trigger");
  const hoverImg = document.querySelector(".center-hover-img");
  const hoverImgM = document.querySelector(".center-hover-img-m");

  if (trigger && hoverImg) {
    trigger.addEventListener('mouseenter', () => {
      // Show desktop version if width > 1080
      if (window.innerWidth > 1080) {
        if (typeof isTOCVisible !== 'undefined' && isTOCVisible) return;
        hoverImg.style.display = "block";
      }
    });

    trigger.addEventListener("mouseleave", () => {
      if (window.innerWidth > 1080) {
        hoverImg.style.display = "none";
      }
    });

    // Mobile touch interaction
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 1080) {

        if (typeof isTOCVisible !== 'undefined' && isTOCVisible) return;

        const isCurrentlyVisible = hoverImgM && hoverImgM.style.display === "block";
        if (hoverImgM) {
          hoverImgM.style.display = isCurrentlyVisible ? "none" : "block";
        }
      }
    });

    // Hide mobile hover image if clicking anywhere else
    window.addEventListener('click', (e) => {
      if (window.innerWidth <= 1080 && hoverImgM) {
        if (trigger && trigger.contains(e.target)) return;
        hoverImgM.style.display = "none";
      }
    });
  }
});

function redirectToRandomHome() {
  const homes = [
    "Home_1.html",
    "Home_2/Home_2.html",
    "Home_3/Home_3.html",
    "Home_4/Home_4.html",
    "Home_5/index.html",
    "Home_6/index.html",
    "Home_7/index.html"
  ];
  const currentPath = window.location.pathname;
  const availableHomes = homes.filter(home => !currentPath.endsWith(home));
  const randomHome = availableHomes[Math.floor(Math.random() * availableHomes.length)];
  // Home_5 is in a subfolder, so paths need to go up one level
  window.location.href = '../' + randomHome;
}

function redirectToHome2() {
  const home2Path = "../Home_2/Home_2.html";
  console.log("[REDIRECT] Navigating to Home_2:", home2Path);
  window.location.href = home2Path;
}

/* --------------------
  Resize
-------------------- */
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);

  const isMobile = window.innerWidth <= 1080;
  const cameraPadding = isMobile ? 2.5 : 1.35;

  // Re-fit camera to maintain responsive size
  if (root && root.children.length > 0) {
    fitCameraToObject(root, cameraPadding);
  } else {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = (-frustum * aspect) / 2;
    camera.right = (frustum * aspect) / 2;
    camera.top = frustum / 2;
    camera.bottom = -frustum / 2;
    camera.updateProjectionMatrix();
  }
});

/* Custom Cursor JS - Home Screen Version */
(function () {
  if (document.querySelector('.custom-cursor')) return;
  const container = document.createElement('div');
  container.className = 'custom-cursor';

  const circle = document.createElement('div');
  circle.className = 'cursor-circle';

  const text = document.createElement('span');
  text.className = 'cursor-text';
  text.innerText = window.innerWidth <= 1080 ? 'Double Tab!' : 'Double click!';

  container.appendChild(circle);
  container.appendChild(text);
  document.body.appendChild(container);

  window.addEventListener('mousemove', (e) => {
    container.style.left = e.clientX + 'px';
    container.style.top = e.clientY + 'px';
  });

  // Observer to handle cases where CSS sibling selector might fail
  const nextScreen = document.getElementById('next-screen');
  if (nextScreen) {
    const observer = new MutationObserver(() => {
      const isVisible = nextScreen.classList.contains('active') || nextScreen.style.display === 'flex';
      if (isVisible) {
        text.style.display = 'none';
      } else {
        text.style.display = 'inline';
      }
    });
    observer.observe(nextScreen, { attributes: true, attributeFilter: ['class', 'style'] });
  }
})();
