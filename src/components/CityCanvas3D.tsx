import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BUILDINGS_META } from '../data/questions';
import {
  BuildingCode,
  CustomOrnament,
  ProximityTarget,
} from '../types/edublox';
import { AudioEngine } from '../utils/audio';

export interface CityCanvasHandle {
  rebuildPlayers: (
    playerName: string,
    avatarId: string,
    outfitColor: string,
    playerCount: number
  ) => void;
  teleportTo: (target: 'plaza' | 'canteen' | BuildingCode) => void;
  triggerJump: (playerIndex?: number) => void;
  rotateCameraBy: (rad: number) => void;
  toggleAutoRotate: () => boolean;
  setAutoRotate: (enabled: boolean) => void;
  focusCameraOnPlayer: () => void;
  setJoystickVector: (x: number, y: number) => void;
  renderCustomOrnaments: (ornaments: CustomOrnament[]) => void;
}

interface CityCanvas3DProps {
  isLanding: boolean;
  isQuizActive: boolean;
  initialPlayerName: string;
  initialAvatarId: string;
  initialOutfitColor: string;
  initialPlayerCount: number;
  initialOrnaments: CustomOrnament[];
  onSelectBuilding: (code: BuildingCode) => void;
  onOpenCanteen: () => void;
  onProximityChange: (target: ProximityTarget | null) => void;
  onAutoRotateChange: (active: boolean) => void;
}

interface PlayerActor {
  mesh: THREE.Group;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  velocityY: number;
  isGrounded: boolean;
  walkCycle: number;
}

// Pre-allocated math helpers outside render loop (zero GC)
const _camTargetVec = new THREE.Vector3();
const _lookTargetVec = new THREE.Vector3();
const _rayMouse = new THREE.Vector2();

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createVoxelTexture(
  baseHex: string,
  accentHex: string,
  maxAniso: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = accentHex;
    for (let i = 0; i < 24; i++) {
      const x = (i * 17) % 60;
      const y = (i * 29) % 60;
      ctx.fillRect(x, y, 4, 4);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.strokeRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(32, 32);
  tex.magFilter = THREE.NearestFilter;
  tex.anisotropy = maxAniso;
  return tex;
}

function createSignTexture(
  title: string,
  subtitle: string,
  bgHex: string,
  textHex = '#ffffff',
  maxAniso = 4
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 512, 160);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
    ctx.strokeRect(8, 8, 496, 144);

    ctx.fillStyle = textHex;
    ctx.font = 'bold 34px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, 256, 72);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 22px Nunito, sans-serif';
    ctx.fillText(subtitle, 256, 118);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  return tex;
}

function createNameTagSprite(
  text: string,
  bgColor = 'rgba(15,23,42,0.88)'
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(10, 14, 300, 52, 20);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, 160, 49);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(4.5, 1.15, 1);
  return sprite;
}

function createBlockyCharacter(
  name: string,
  avatarId: string,
  outfitHex: string,
  isMain = false
): PlayerActor {
  const group = new THREE.Group();
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfde68a,
    roughness: 0.72,
    metalness: 0.05,
  });
  const shirtMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(outfitHex),
    roughness: 0.45,
    metalness: 0.12,
  });
  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.8,
    metalness: 0.08,
  });

  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 0.7), pantsMat);
  leftLeg.position.set(-0.4, 0.7, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 0.7), pantsMat);
  rightLeg.position.set(0.4, 0.7, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 0.9), shirtMat);
  torso.position.y = 2.3;
  torso.castShadow = true;
  group.add(torso);

  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.6, 0.6), skinMat);
  leftArm.position.set(-1.15, 2.3, 0);
  leftArm.castShadow = true;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.6, 0.6), skinMat);
  rightArm.position.set(1.15, 2.3, 0);
  rightArm.castShadow = true;
  group.add(rightArm);

  const head = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), skinMat);
  head.position.y = 3.9;
  head.castShadow = true;
  group.add(head);

  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.2,
    metalness: 0.1,
  });
  const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.1), eyeMat);
  eyeL.position.set(-0.32, 4.0, 0.72);
  const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.1), eyeMat);
  eyeR.position.set(0.32, 4.0, 0.72);
  group.add(eyeL, eyeR);

  if (avatarId === 'raja') {
    const crown = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.55, 1.5),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.25, metalness: 0.75 })
    );
    crown.position.y = 4.85;
    group.add(crown);
  } else if (avatarId === 'neko') {
    const earMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.55 });
    const earL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.3), earMat);
    earL.position.set(-0.45, 4.8, 0);
    const earR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.3), earMat);
    earR.position.set(0.45, 4.8, 0);
    group.add(earL, earR);
  } else if (avatarId === 'kapten') {
    const ant = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.8, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.6, roughness: 0.3 })
    );
    ant.position.y = 4.95;
    const ball = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.4 })
    );
    ball.position.y = 5.4;
    group.add(ant, ball);
  } else if (avatarId === 'knight') {
    const helm = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 0.6, 1.55),
      new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.55, roughness: 0.35 })
    );
    helm.position.y = 4.65;
    group.add(helm);
  } else if (avatarId === 'wizard') {
    const brim = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.2, 2.1),
      new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.6 })
    );
    brim.position.y = 4.65;
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.75, 1.4, 4),
      new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.5 })
    );
    cone.position.y = 5.4;
    group.add(brim, cone);
  } else {
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(1.45, 0.35, 1.45),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.55 })
    );
    cap.position.y = 4.65;
    group.add(cap);
  }

  const tag = createNameTagSprite(
    name,
    isMain ? 'rgba(15,23,42,0.88)' : 'rgba(71,85,105,0.85)'
  );
  tag.position.y = 6.3;
  group.add(tag);

  return {
    mesh: group,
    leftLeg,
    rightLeg,
    leftArm,
    rightArm,
    velocityY: 0,
    isGrounded: true,
    walkCycle: 0,
  };
}

export const CityCanvas3D = forwardRef<CityCanvasHandle, CityCanvas3DProps>(
  function CityCanvas3D(
    {
      isLanding,
      isQuizActive,
      initialPlayerName,
      initialAvatarId,
      initialOutfitColor,
      initialPlayerCount,
      initialOrnaments,
      onSelectBuilding,
      onOpenCanteen,
      onProximityChange,
      onAutoRotateChange,
    },
    ref
  ) {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const [contextLost, setContextLost] = useState(false);

    // Sync React props to mutable refs so WebGL scene never re-initializes
    const isLandingRef = useRef(isLanding);
    const isQuizActiveRef = useRef(isQuizActive);
    const onSelectBuildingRef = useRef(onSelectBuilding);
    const onOpenCanteenRef = useRef(onOpenCanteen);
    const onProximityChangeRef = useRef(onProximityChange);
    const onAutoRotateChangeRef = useRef(onAutoRotateChange);

    useEffect(() => {
      isLandingRef.current = isLanding;
    }, [isLanding]);
    useEffect(() => {
      isQuizActiveRef.current = isQuizActive;
    }, [isQuizActive]);
    useEffect(() => {
      onSelectBuildingRef.current = onSelectBuilding;
    }, [onSelectBuilding]);
    useEffect(() => {
      onOpenCanteenRef.current = onOpenCanteen;
    }, [onOpenCanteen]);
    useEffect(() => {
      onProximityChangeRef.current = onProximityChange;
    }, [onProximityChange]);
    useEffect(() => {
      onAutoRotateChangeRef.current = onAutoRotateChange;
    }, [onAutoRotateChange]);

    // Mutable engine refs for imperative handle
    const engineRef = useRef<{
      scene: THREE.Scene;
      players: PlayerActor[];
      dynamicOrnamentGroup: THREE.Group;
      cameraAngle: number;
      cameraPitch: number;
      cameraDistance: number;
      autoRotateCamera: boolean;
      joystickVector: { x: number; y: number };
      rebuildPlayers: (
        playerName: string,
        avatarId: string,
        outfitColor: string,
        playerCount: number
      ) => void;
      renderCustomOrnaments: (ornaments: CustomOrnament[]) => void;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      rebuildPlayers(name, avatarId, outfitColor, count) {
        engineRef.current?.rebuildPlayers(name, avatarId, outfitColor, count);
      },
      teleportTo(target) {
        const eng = engineRef.current;
        if (!eng || !eng.players[0]) return;
        let dest = { x: 0, z: 12 };
        if (target === 'plaza') {
          dest = { x: 0, z: 12 };
        } else if (target === 'canteen') {
          dest = { x: -45, z: -7 };
        } else if (BUILDINGS_META[target]) {
          const b = BUILDINGS_META[target];
          const padZ = b.pos.z > 0 ? -14 : 14;
          dest = { x: b.pos.x, z: b.pos.z + padZ };
        }
        eng.players.forEach((p, idx) => {
          p.mesh.position.set(dest.x + idx * 2.5, 1, dest.z);
        });
        eng.autoRotateCamera = false;
        onAutoRotateChangeRef.current(false);
        eng.cameraAngle = 0;
        eng.cameraPitch = 0.42;
        eng.cameraDistance = 22;
        AudioEngine.coin();
      },
      triggerJump(playerIndex = 0) {
        const eng = engineRef.current;
        const p = eng?.players[playerIndex];
        if (p && p.isGrounded) {
          p.velocityY = 12.5;
          p.isGrounded = false;
          AudioEngine.jump();
        }
      },
      rotateCameraBy(rad) {
        const eng = engineRef.current;
        if (!eng) return;
        eng.autoRotateCamera = false;
        onAutoRotateChangeRef.current(false);
        eng.cameraAngle += rad;
      },
      toggleAutoRotate() {
        const eng = engineRef.current;
        if (!eng) return false;
        eng.autoRotateCamera = !eng.autoRotateCamera;
        onAutoRotateChangeRef.current(eng.autoRotateCamera);
        return eng.autoRotateCamera;
      },
      setAutoRotate(enabled) {
        const eng = engineRef.current;
        if (!eng) return;
        eng.autoRotateCamera = enabled;
        onAutoRotateChangeRef.current(enabled);
      },
      focusCameraOnPlayer() {
        const eng = engineRef.current;
        if (!eng) return;
        eng.autoRotateCamera = false;
        onAutoRotateChangeRef.current(false);
        eng.cameraAngle = 0;
        eng.cameraPitch = 0.42;
        eng.cameraDistance = 22;
      },
      setJoystickVector(x, y) {
        if (engineRef.current) {
          engineRef.current.joystickVector.x = x;
          engineRef.current.joystickVector.y = y;
        }
      },
      renderCustomOrnaments(ornaments) {
        engineRef.current?.renderCustomOrnaments(ornaments);
      },
    }));

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      const isSoftwareGl = detectSoftwareWebGL();
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x7dd3fc);
      scene.fog = new THREE.FogExp2(0x7dd3fc, 0.0028);

      const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        600
      );

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
        });
      } catch {
        setContextLost(true);
        return;
      }

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
      );
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const maxAniso = renderer.capabilities.getMaxAnisotropy();

      // Studio environment reflections
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      pmremGenerator.dispose();

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const handleContextLost = (e: Event) => {
        e.preventDefault();
        setContextLost(true);
      };
      const handleContextRestored = () => {
        setContextLost(false);
      };
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

      // Lighting Rig (Warm key + Cool Hemisphere fill + Rim light)
      const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x34d399, 0.85);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.05);
      dirLight.position.set(80, 130, 60);
      dirLight.castShadow = !isSoftwareGl;
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      dirLight.shadow.camera.near = 10;
      dirLight.shadow.camera.far = 320;
      const d = 140;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
      scene.add(dirLight);

      const rimLight = new THREE.DirectionalLight(0xbae6fd, 0.35);
      rimLight.position.set(-70, 50, -80);
      scene.add(rimLight);

      // Voxel Sun
      const sunMesh = new THREE.Mesh(
        new THREE.BoxGeometry(18, 18, 18),
        new THREE.MeshBasicMaterial({ color: 0xfde047 })
      );
      sunMesh.position.set(95, 135, -90);
      scene.add(sunMesh);

      // Surrounding Ocean
      const water = new THREE.Mesh(
        new THREE.PlaneGeometry(900, 900),
        new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.25,
          metalness: 0.15,
        })
      );
      water.rotation.x = -Math.PI / 2;
      water.position.y = -2.2;
      scene.add(water);

      // 260x260 Voxel Island
      const grassTex = createVoxelTexture('#4ade80', '#22c55e', maxAniso);
      const island = new THREE.Mesh(
        new THREE.BoxGeometry(260, 4, 260),
        new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.85, metalness: 0.02 })
      );
      island.position.y = -2;
      island.receiveShadow = true;
      scene.add(island);

      // Sandy Shore Border
      const sand = new THREE.Mesh(
        new THREE.BoxGeometry(268, 2.5, 268),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.9 })
      );
      sand.position.y = -2.4;
      scene.add(sand);

      // Yellow Roads & Connectors (Y offset >= 0.02 to prevent Z-fighting)
      const roadMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.7,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });
      const roadNS = new THREE.Mesh(new THREE.BoxGeometry(14, 0.16, 230), roadMat);
      roadNS.position.set(0, 0.08, 0);
      roadNS.receiveShadow = true;
      scene.add(roadNS);

      const roadEW = new THREE.Mesh(new THREE.BoxGeometry(230, 0.16, 14), roadMat);
      roadEW.position.set(0, 0.09, 0);
      roadEW.receiveShadow = true;
      scene.add(roadEW);

      const connectorSpecs: [number, number, number, number][] = [
        [-65, -32, 10, 65],
        [65, -32, 10, 65],
        [-75, 22, 10, 45],
        [75, 22, 10, 45],
      ];
      connectorSpecs.forEach(([cx, cz, w, l]) => {
        const conn = new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, l), roadMat);
        conn.position.set(cx, 0.07, cz);
        conn.receiveShadow = true;
        scene.add(conn);
      });

      // Central Plaza
      const plazaBase = new THREE.Mesh(
        new THREE.BoxGeometry(44, 0.3, 44),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 })
      );
      plazaBase.position.set(0, 0.15, 0);
      plazaBase.receiveShadow = true;
      scene.add(plazaBase);

      const plazaInner = new THREE.Mesh(
        new THREE.BoxGeometry(34, 0.35, 34),
        new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.55 })
      );
      plazaInner.position.set(0, 0.18, 0);
      plazaInner.receiveShadow = true;
      scene.add(plazaInner);

      // Crystal Monument
      const monumentGroup = new THREE.Group();
      const ped1 = new THREE.Mesh(
        new THREE.BoxGeometry(8, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7, metalness: 0.2 })
      );
      ped1.position.y = 0.6;
      ped1.castShadow = true;
      monumentGroup.add(ped1);

      const ped2 = new THREE.Mesh(
        new THREE.BoxGeometry(5.5, 1.2, 5.5),
        new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4, metalness: 0.35 })
      );
      ped2.position.y = 1.8;
      ped2.castShadow = true;
      monumentGroup.add(ped2);

      const crystalMonument = new THREE.Mesh(
        new THREE.OctahedronGeometry(2.6, 0),
        new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.35,
          roughness: 0.12,
          metalness: 0.15,
          clearcoat: 1.0,
        })
      );
      crystalMonument.position.y = 5.5;
      crystalMonument.castShadow = true;
      monumentGroup.add(crystalMonument);

      const monumentSignTex = createSignTexture(
        'EDUBLOX – INFORMATIKA',
        'INFORMATICS ADVENTURE CITY • By Sitty',
        '#1e293b',
        '#38bdf8',
        maxAniso
      );
      const signBoard = new THREE.Mesh(
        new THREE.BoxGeometry(11, 3.2, 0.5),
        new THREE.MeshBasicMaterial({ map: monumentSignTex })
      );
      signBoard.position.set(0, 9.2, 0);
      monumentGroup.add(signBoard);
      scene.add(monumentGroup);

      // Fountains
      const fountainDrops: THREE.Mesh[] = [];
      const buildFountain = (fx: number, fz: number) => {
        const fGroup = new THREE.Group();
        fGroup.position.set(fx, 0, fz);

        const basin = new THREE.Mesh(
          new THREE.BoxGeometry(6, 1, 6),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.75 })
        );
        basin.position.y = 0.5;
        fGroup.add(basin);

        const fWater = new THREE.Mesh(
          new THREE.BoxGeometry(4.8, 0.9, 4.8),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.15, metalness: 0.1 })
        );
        fWater.position.y = 0.6;
        fGroup.add(fWater);

        const pillar = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 2.6, 1.2),
          new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.6 })
        );
        pillar.position.y = 1.3;
        fGroup.add(pillar);

        for (let i = 0; i < 8; i++) {
          const drop = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.35, 0.35),
            new THREE.MeshBasicMaterial({ color: 0xbae6fd })
          );
          drop.position.set(0, 2.8, 0);
          drop.userData = { angle: (i / 8) * Math.PI * 2, phase: Math.random() * Math.PI };
          fGroup.add(drop);
          fountainDrops.push(drop);
        }
        scene.add(fGroup);
      };
      buildFountain(-15, -15);
      buildFountain(15, -15);

      // Interactive Zones & Raycast Clickables
      const interactiveZones: ProximityTarget[] = [];
      const clickableMeshes: THREE.Object3D[] = [];

      // 5 Learning Buildings (Composite Multi-Part Architecture)
      (Object.keys(BUILDINGS_META) as BuildingCode[]).forEach((code) => {
        const info = BUILDINGS_META[code];
        const bGroup = new THREE.Group();
        bGroup.position.set(info.pos.x, 0, info.pos.z);

        const base = new THREE.Mesh(
          new THREE.BoxGeometry(26, 1, 22),
          new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, metalness: 0.1 })
        );
        base.position.y = 0.5;
        base.receiveShadow = true;
        bGroup.add(base);

        const body = new THREE.Mesh(
          new THREE.BoxGeometry(22, 14, 18),
          new THREE.MeshStandardMaterial({ color: info.color, roughness: 0.55, metalness: 0.08 })
        );
        body.position.y = 8;
        body.castShadow = true;
        body.receiveShadow = true;
        body.userData = { interactType: 'building', code };
        bGroup.add(body);
        clickableMeshes.push(body);

        const roof = new THREE.Mesh(
          new THREE.BoxGeometry(24, 2, 20),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.15 })
        );
        roof.position.y = 16;
        roof.castShadow = true;
        bGroup.add(roof);

        const winMat = new THREE.MeshStandardMaterial({
          color: 0xfef9c3,
          emissive: 0xfef08a,
          emissiveIntensity: 0.35,
          roughness: 0.2,
        });
        for (let wx = -7; wx <= 7; wx += 7) {
          const win1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.2, 18.4), winMat);
          win1.position.set(wx, 10.5, 0);
          bGroup.add(win1);
        }

        const doorFrame = new THREE.Mesh(
          new THREE.BoxGeometry(5.5, 6.5, 18.6),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.4 })
        );
        doorFrame.position.set(0, 4.2, 0);
        bGroup.add(doorFrame);

        const doorPortal = new THREE.Mesh(
          new THREE.BoxGeometry(4, 5.5, 18.8),
          new THREE.MeshBasicMaterial({ color: 0xfde047 })
        );
        doorPortal.position.set(0, 3.8, 0);
        doorPortal.userData = { interactType: 'building', code };
        bGroup.add(doorPortal);
        clickableMeshes.push(doorPortal);

        const signTex = createSignTexture(
          `GEDUNG ${code}`,
          info.desc.substring(0, 34),
          '#0f172a',
          info.hex,
          maxAniso
        );
        const billboard = new THREE.Mesh(
          new THREE.BoxGeometry(20, 5.2, 0.8),
          new THREE.MeshBasicMaterial({ map: signTex })
        );
        billboard.position.set(0, 20, 0);
        billboard.userData = { interactType: 'building', code };
        bGroup.add(billboard);
        clickableMeshes.push(billboard);

        const padZ = info.pos.z > 0 ? -14 : 14;
        const pad = new THREE.Mesh(
          new THREE.CylinderGeometry(3.2, 3.5, 0.3, 16),
          new THREE.MeshStandardMaterial({
            color: 0xfacc15,
            emissive: 0xeab308,
            emissiveIntensity: 0.35,
            roughness: 0.3,
          })
        );
        pad.position.set(0, 0.2, padZ);
        pad.userData = { interactType: 'building', code };
        bGroup.add(pad);
        clickableMeshes.push(pad);

        scene.add(bGroup);

        interactiveZones.push({
          type: 'building',
          code,
          x: info.pos.x,
          z: info.pos.z + padZ,
          radius: 8.5,
          title: info.name,
          desc: info.desc,
          badge: `GEDUNG ${code} • MATERI INFORMATIKA`,
        });
      });

      // Canteen Building
      {
        const pos = { x: -45, z: -18 };
        const cGroup = new THREE.Group();
        cGroup.position.set(pos.x, 0, pos.z);

        const body = new THREE.Mesh(
          new THREE.BoxGeometry(16, 9, 14),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 })
        );
        body.position.y = 4.5;
        body.castShadow = true;
        body.userData = { interactType: 'canteen' };
        cGroup.add(body);
        clickableMeshes.push(body);

        const awning = new THREE.Mesh(
          new THREE.BoxGeometry(17, 1.5, 5),
          new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 })
        );
        awning.position.set(0, 6.5, 8.5);
        cGroup.add(awning);

        const signTex = createSignTexture(
          '🍔 KANTIN EDUBLOX',
          'Tukar Koin dengan Bonus XP!',
          '#78350f',
          '#fde047',
          maxAniso
        );
        const sign = new THREE.Mesh(
          new THREE.BoxGeometry(14, 3.8, 0.6),
          new THREE.MeshBasicMaterial({ map: signTex })
        );
        sign.position.set(0, 11.5, 0);
        sign.userData = { interactType: 'canteen' };
        cGroup.add(sign);
        clickableMeshes.push(sign);

        scene.add(cGroup);

        interactiveZones.push({
          type: 'canteen',
          x: pos.x,
          z: pos.z + 10,
          radius: 8,
          title: 'Kantin Edublox By Sitty',
          desc: 'Belanja makanan & minuman lezat memakai koin kuis untuk bonus XP!',
          badge: 'KANTIN & ENERGI',
        });
      }

      // Trees, Benches, Lights, Flowers
      const createTree = (type: string, tx: number, tz: number) => {
        const tGroup = new THREE.Group();
        tGroup.position.set(tx, 0, tz);
        const trunk = new THREE.Mesh(
          new THREE.BoxGeometry(1.4, 5, 1.4),
          new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
        );
        trunk.position.y = 2.5;
        trunk.castShadow = true;
        tGroup.add(trunk);

        if (type === 'pine') {
          const colors = [0x15803d, 0x16a34a, 0x22c55e];
          for (let i = 0; i < 3; i++) {
            const size = 5.5 - i * 1.4;
            const leaves = new THREE.Mesh(
              new THREE.BoxGeometry(size, 2.6, size),
              new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.75 })
            );
            leaves.position.y = 5.5 + i * 2.2;
            leaves.castShadow = true;
            tGroup.add(leaves);
          }
        } else if (type === 'sakura') {
          const leaves = new THREE.Mesh(
            new THREE.BoxGeometry(6, 4.5, 6),
            new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.7 })
          );
          leaves.position.y = 6.5;
          leaves.castShadow = true;
          tGroup.add(leaves);
        } else {
          const leaves = new THREE.Mesh(
            new THREE.BoxGeometry(5.5, 4.5, 5.5),
            new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.75 })
          );
          leaves.position.y = 6.5;
          leaves.castShadow = true;
          tGroup.add(leaves);
        }
        scene.add(tGroup);
      };

      const treePositions: [string, number, number][] = [
        ['oak', -30, -45], ['sakura', -25, -28], ['pine', 30, -45], ['sakura', 28, -28],
        ['oak', -95, -90], ['pine', -105, -40], ['sakura', -98, 15], ['oak', -105, 80],
        ['pine', 95, -90], ['sakura', 105, -35], ['oak', 98, 20], ['pine', 105, 85],
        ['sakura', -38, 65], ['sakura', 38, 65], ['oak', -45, 105], ['pine', 45, 105],
      ];
      treePositions.forEach(([t, tx, tz]) => createTree(t, tx, tz));

      const createBench = (bx: number, bz: number, rotY = 0) => {
        const bGroup = new THREE.Group();
        bGroup.position.set(bx, 0, bz);
        bGroup.rotation.y = rotY;
        const seat = new THREE.Mesh(
          new THREE.BoxGeometry(4, 0.4, 1.5),
          new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.75 })
        );
        seat.position.y = 1;
        bGroup.add(seat);
        const back = new THREE.Mesh(
          new THREE.BoxGeometry(4, 1.4, 0.3),
          new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 })
        );
        back.position.set(0, 1.7, -0.6);
        bGroup.add(back);
        scene.add(bGroup);
      };
      createBench(-18, 18, 0.7);
      createBench(18, 18, -0.7);
      createBench(-28, -8, Math.PI / 2);
      createBench(28, -8, -Math.PI / 2);

      const lightCoords: [number, number][] = [
        [-9, -28], [9, -28], [-9, 28], [9, 28],
        [-28, -9], [-28, 9], [28, -9], [28, 9],
      ];
      lightCoords.forEach(([lx, lz]) => {
        const lGroup = new THREE.Group();
        lGroup.position.set(lx, 0, lz);
        const pole = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 8, 0.4),
          new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.3 })
        );
        pole.position.y = 4;
        const lamp = new THREE.Mesh(
          new THREE.BoxGeometry(1.4, 1.2, 1.4),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        lamp.position.y = 8.2;
        lGroup.add(pole, lamp);
        scene.add(lGroup);
      });

      const flowerColors = [0xef4444, 0xfacc15, 0xec4899, 0xa855f7, 0x38bdf8];
      [
        [-24, 12],
        [24, 12],
        [-24, -24],
        [24, -24],
      ].forEach(([fx, fz]) => {
        const fGroup = new THREE.Group();
        fGroup.position.set(fx, 0, fz);
        for (let i = 0; i < 6; i++) {
          const fl = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.6, 0.6),
            new THREE.MeshBasicMaterial({ color: flowerColors[i % flowerColors.length] })
          );
          fl.position.set((Math.random() - 0.5) * 4, 0.3, (Math.random() - 0.5) * 4);
          fGroup.add(fl);
        }
        scene.add(fGroup);
      });

      // Dynamic Teacher Ornaments
      const dynamicOrnamentGroup = new THREE.Group();
      scene.add(dynamicOrnamentGroup);

      const renderCustomOrnaments = (ornaments: CustomOrnament[]) => {
        while (dynamicOrnamentGroup.children.length > 0) {
          dynamicOrnamentGroup.remove(dynamicOrnamentGroup.children[0]);
        }
        ornaments.forEach((orn) => {
          const g = new THREE.Group();
          g.position.set(orn.x, 0, orn.z);
          if (orn.type === 'sakura') {
            const t = new THREE.Mesh(
              new THREE.BoxGeometry(1.2, 4.5, 1.2),
              new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 })
            );
            t.position.y = 2.25;
            const l = new THREE.Mesh(
              new THREE.BoxGeometry(5.5, 4, 5.5),
              new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.7 })
            );
            l.position.y = 6;
            g.add(t, l);
          } else if (orn.type === 'gazebo') {
            const floor = new THREE.Mesh(
              new THREE.BoxGeometry(7, 0.5, 7),
              new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 })
            );
            floor.position.y = 0.25;
            const roof = new THREE.Mesh(
              new THREE.ConeGeometry(5.5, 3, 4),
              new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 })
            );
            roof.position.y = 6.5;
            roof.rotation.y = Math.PI / 4;
            g.add(floor, roof);
            [
              [-2.8, -2.8],
              [2.8, -2.8],
              [-2.8, 2.8],
              [2.8, 2.8],
            ].forEach(([px, pz]) => {
              const p = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 5, 0.5),
                new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
              );
              p.position.set(px, 2.5, pz);
              g.add(p);
            });
          } else if (orn.type === 'robot') {
            const body = new THREE.Mesh(
              new THREE.BoxGeometry(2.2, 3, 1.6),
              new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.45, roughness: 0.35 })
            );
            body.position.y = 2;
            const head = new THREE.Mesh(
              new THREE.BoxGeometry(1.8, 1.5, 1.5),
              new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.35, roughness: 0.25 })
            );
            head.position.y = 4.4;
            g.add(body, head);
          } else {
            const box = new THREE.Mesh(
              new THREE.BoxGeometry(3.5, 1.2, 2.5),
              new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 })
            );
            box.position.y = 0.6;
            g.add(box);
          }
          dynamicOrnamentGroup.add(g);
        });
      };
      renderCustomOrnaments(initialOrnaments);

      // Moving Clouds
      const clouds: THREE.Group[] = [];
      const cloudMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.92,
      });
      for (let i = 0; i < 16; i++) {
        const cGroup = new THREE.Group();
        const main = new THREE.Mesh(new THREE.BoxGeometry(16, 4, 9), cloudMat);
        const top = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 7), cloudMat);
        top.position.set(1, 3, 0);
        cGroup.add(main, top);
        cGroup.position.set(
          (Math.random() - 0.5) * 240,
          48 + Math.random() * 18,
          (Math.random() - 0.5) * 240
        );
        scene.add(cGroup);
        clouds.push(cGroup);
      }

      // Players
      let players: PlayerActor[] = [];
      const rebuildPlayers = (
        pName: string,
        avId: string,
        outfitCol: string,
        count: number
      ) => {
        players.forEach((p) => scene.remove(p.mesh));
        players = [];
        const companionAvatars = ['neko', 'kapten', 'knight', 'wizard'];
        const companionColors = ['#ec4899', '#10b981', '#8b5cf6', '#f97316'];
        for (let i = 0; i < count; i++) {
          const isMain = i === 0;
          const actorName = isMain ? pName : `Player ${i + 1}`;
          const actorAv = isMain ? avId : companionAvatars[i % companionAvatars.length];
          const actorCol = isMain ? outfitCol : companionColors[i % companionColors.length];
          const actor = createBlockyCharacter(actorName, actorAv, actorCol, isMain);
          actor.mesh.position.set(i * 3, 0, 12);
          scene.add(actor.mesh);
          players.push(actor);
        }
        if (engineRef.current) {
          engineRef.current.players = players;
        }
      };

      rebuildPlayers(
        initialPlayerName,
        initialAvatarId,
        initialOutfitColor,
        initialPlayerCount
      );

      // Engine shared ref
      engineRef.current = {
        scene,
        players,
        dynamicOrnamentGroup,
        cameraAngle: 0,
        cameraPitch: 0.42,
        cameraDistance: 24,
        autoRotateCamera: true,
        joystickVector: { x: 0, y: 0 },
        rebuildPlayers,
        renderCustomOrnaments,
      };

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }

      // Input & Raycaster Listeners
      const keys: Record<string, boolean> = {};
      const raycaster = new THREE.Raycaster();
      let isDraggingCamera = false;
      let dragStart = { x: 0, y: 0 };
      let prevPointer = { x: 0, y: 0 };
      let lastProxKey = '';

      const onKeyDown = (e: KeyboardEvent) => {
        const tag = (document.activeElement?.tagName || '').toUpperCase();
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        keys[e.code] = true;
        if (e.code === 'Space') {
          e.preventDefault();
          const p = engineRef.current?.players[0];
          if (p && p.isGrounded && !isLandingRef.current && !isQuizActiveRef.current) {
            p.velocityY = 12.5;
            p.isGrounded = false;
            AudioEngine.jump();
          }
        }
        if (e.code === 'ShiftRight') {
          const p2 = engineRef.current?.players[1];
          if (p2 && p2.isGrounded && !isLandingRef.current && !isQuizActiveRef.current) {
            p2.velocityY = 12.5;
            p2.isGrounded = false;
            AudioEngine.jump();
          }
        }
      };

      const onKeyUp = (e: KeyboardEvent) => {
        keys[e.code] = false;
      };

      const canvasEl = renderer.domElement;

      const handleCanvasClick = (clientX: number, clientY: number) => {
        if (isLandingRef.current || isQuizActiveRef.current) return;
        _rayMouse.x = (clientX / window.innerWidth) * 2 - 1;
        _rayMouse.y = -(clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(_rayMouse, camera);
        const intersects = raycaster.intersectObjects(clickableMeshes, false);
        if (intersects.length > 0) {
          const ud = intersects[0].object.userData;
          if (ud?.interactType === 'building' && ud.code) {
            onSelectBuildingRef.current(ud.code as BuildingCode);
          } else if (ud?.interactType === 'canteen') {
            onOpenCanteenRef.current();
          }
        }
      };

      const onMouseDown = (e: MouseEvent) => {
        isDraggingCamera = true;
        dragStart = { x: e.clientX, y: e.clientY };
        prevPointer = { x: e.clientX, y: e.clientY };
        if (engineRef.current) {
          engineRef.current.autoRotateCamera = false;
          onAutoRotateChangeRef.current(false);
        }
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDraggingCamera || !engineRef.current) return;
        const dx = e.clientX - prevPointer.x;
        const dy = e.clientY - prevPointer.y;
        engineRef.current.cameraAngle -= dx * 0.007;
        engineRef.current.cameraPitch = Math.max(
          0.15,
          Math.min(1.15, engineRef.current.cameraPitch + dy * 0.005)
        );
        prevPointer = { x: e.clientX, y: e.clientY };
      };

      const onMouseUp = (e: MouseEvent) => {
        if (isDraggingCamera) {
          const dist = Math.hypot(e.clientX - dragStart.x, e.clientY - dragStart.y);
          if (dist < 5) {
            handleCanvasClick(e.clientX, e.clientY);
          }
        }
        isDraggingCamera = false;
      };

      const onWheel = (e: WheelEvent) => {
        if (!engineRef.current) return;
        engineRef.current.cameraDistance = Math.max(
          10,
          Math.min(55, engineRef.current.cameraDistance + e.deltaY * 0.02)
        );
      };

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1 && engineRef.current) {
          isDraggingCamera = true;
          engineRef.current.autoRotateCamera = false;
          onAutoRotateChangeRef.current(false);
          prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          dragStart = { ...prevPointer };
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        if (isDraggingCamera && e.touches.length === 1 && engineRef.current) {
          const dx = e.touches[0].clientX - prevPointer.x;
          const dy = e.touches[0].clientY - prevPointer.y;
          engineRef.current.cameraAngle -= dx * 0.008;
          engineRef.current.cameraPitch = Math.max(
            0.15,
            Math.min(1.15, engineRef.current.cameraPitch + dy * 0.006)
          );
          prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      };

      const onTouchEnd = () => {
        isDraggingCamera = false;
      };

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      canvasEl.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      canvasEl.addEventListener('wheel', onWheel, { passive: true });
      canvasEl.addEventListener('touchstart', onTouchStart, { passive: true });
      canvasEl.addEventListener('touchmove', onTouchMove, { passive: true });
      canvasEl.addEventListener('touchend', onTouchEnd);
      window.addEventListener('resize', onResize);

      // Clock & Frame Pacing (handles both GPU rAF and Software WebGL afterDraw)
      const clock = new THREE.Clock();
      let frameId = 0;
      let disposed = false;

      const afterDraw = (cb: () => void) => {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (!sync) {
          frameId = window.setTimeout(cb, 80);
          return;
        }
        gl.flush();
        const poll = () => {
          if (disposed) {
            gl.deleteSync(sync);
            return;
          }
          const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      };

      const tick = () => {
        if (disposed) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.elapsedTime;
        const eng = engineRef.current;

        // Rotate Crystal Monument
        crystalMonument.rotation.y += dt * 1.4;
        crystalMonument.position.y = 5.5 + Math.sin(elapsed * 2.5) * 0.35;

        // Animate Fountain Drops
        for (let i = 0; i < fountainDrops.length; i++) {
          const drop = fountainDrops[i];
          const t = (elapsed * 2 + drop.userData.phase) % 1;
          const r = t * 1.8;
          drop.position.x = Math.cos(drop.userData.angle) * r;
          drop.position.z = Math.sin(drop.userData.angle) * r;
          drop.position.y = 2.6 + Math.sin(t * Math.PI) * 1.6 - t * 1.8;
        }

        // Move Clouds
        for (let i = 0; i < clouds.length; i++) {
          clouds[i].position.x += dt * 2.2;
          if (clouds[i].position.x > 135) clouds[i].position.x = -135;
        }

        if (eng) {
          const isPlayingInCity = !isLandingRef.current && !isQuizActiveRef.current;
          const speed = 22;

          for (let idx = 0; idx < eng.players.length; idx++) {
            const p = eng.players[idx];
            let moveX = 0;
            let moveZ = 0;

            if (isPlayingInCity) {
              if (idx === 0) {
                if (keys['KeyW']) moveZ -= 1;
                if (keys['KeyS']) moveZ += 1;
                if (keys['KeyA']) moveX -= 1;
                if (keys['KeyD']) moveX += 1;
                if (
                  Math.abs(eng.joystickVector.x) > 0.1 ||
                  Math.abs(eng.joystickVector.y) > 0.1
                ) {
                  moveX += eng.joystickVector.x;
                  moveZ += eng.joystickVector.y;
                }
              } else if (
                idx === 1 &&
                (keys['ArrowUp'] ||
                  keys['ArrowDown'] ||
                  keys['ArrowLeft'] ||
                  keys['ArrowRight'])
              ) {
                if (keys['ArrowUp']) moveZ -= 1;
                if (keys['ArrowDown']) moveZ += 1;
                if (keys['ArrowLeft']) moveX -= 1;
                if (keys['ArrowRight']) moveX += 1;
              } else if (idx >= 1 && eng.players[0]) {
                const tx = eng.players[0].mesh.position.x + idx * 2.5;
                const tz = eng.players[0].mesh.position.z + 2;
                const dx = tx - p.mesh.position.x;
                const dz = tz - p.mesh.position.z;
                const dist = Math.hypot(dx, dz);
                if (dist > 3.2) {
                  moveX = dx / dist;
                  moveZ = dz / dist;
                }
              }
            }

            if (idx === 0 && (moveX !== 0 || moveZ !== 0)) {
              const len = Math.hypot(moveX, moveZ);
              const nx = moveX / len;
              const nz = moveZ / len;
              const sin = Math.sin(eng.cameraAngle);
              const cos = Math.cos(eng.cameraAngle);
              moveX = nx * cos + nz * sin;
              moveZ = -nx * sin + nz * cos;
            }

            if (Math.hypot(moveX, moveZ) > 0.05) {
              p.mesh.position.x = Math.max(
                -122,
                Math.min(122, p.mesh.position.x + moveX * speed * dt)
              );
              p.mesh.position.z = Math.max(
                -122,
                Math.min(122, p.mesh.position.z + moveZ * speed * dt)
              );
              p.mesh.rotation.y = Math.atan2(moveX, moveZ);

              p.walkCycle += dt * 12;
              p.leftLeg.rotation.x = Math.sin(p.walkCycle) * 0.6;
              p.rightLeg.rotation.x = -Math.sin(p.walkCycle) * 0.6;
              p.leftArm.rotation.x = -Math.sin(p.walkCycle) * 0.5;
              p.rightArm.rotation.x = Math.sin(p.walkCycle) * 0.5;
            } else {
              p.leftLeg.rotation.x = 0;
              p.rightLeg.rotation.x = 0;
              p.leftArm.rotation.x = 0;
              p.rightArm.rotation.x = 0;
            }

            if (!p.isGrounded || p.velocityY > 0) {
              p.mesh.position.y += p.velocityY * dt;
              p.velocityY -= 32 * dt;
              if (p.mesh.position.y <= 0) {
                p.mesh.position.y = 0;
                p.velocityY = 0;
                p.isGrounded = true;
              }
            }
          }

          // Proximity Detection
          if (isPlayingInCity && eng.players[0]) {
            const pPos = eng.players[0].mesh.position;
            let found: ProximityTarget | null = null;
            for (const zone of interactiveZones) {
              if (Math.hypot(pPos.x - zone.x, pPos.z - zone.z) <= zone.radius) {
                found = zone;
                break;
              }
            }
            const nextKey = found ? `${found.type}:${found.code || ''}` : '';
            if (nextKey !== lastProxKey) {
              lastProxKey = nextKey;
              onProximityChangeRef.current(found);
            }
          } else if (lastProxKey !== '') {
            lastProxKey = '';
            onProximityChangeRef.current(null);
          }

          // Camera Choreography
          if (isLandingRef.current) {
            eng.cameraAngle += dt * 0.18;
            camera.position.set(
              Math.sin(eng.cameraAngle) * 75,
              42,
              Math.cos(eng.cameraAngle) * 75
            );
            camera.lookAt(0, 6, 0);
          } else if (eng.players[0]) {
            if (eng.autoRotateCamera) {
              eng.cameraAngle += dt * 0.35;
            }
            const target = eng.players[0].mesh.position;
            const cx =
              target.x +
              Math.sin(eng.cameraAngle) * eng.cameraDistance * Math.cos(eng.cameraPitch);
            const cy =
              target.y + 3 + Math.sin(eng.cameraPitch) * eng.cameraDistance;
            const cz =
              target.z +
              Math.cos(eng.cameraAngle) * eng.cameraDistance * Math.cos(eng.cameraPitch);
            _camTargetVec.set(cx, cy, cz);
            const alpha = 1 - Math.exp(-8 * dt);
            camera.position.lerp(_camTargetVec, alpha);
            _lookTargetVec.set(target.x, target.y + 3, target.z);
            camera.lookAt(_lookTargetVec);
          }
        }

        renderer.render(scene, camera);

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      };

      if (isSoftwareGl) {
        frameId = window.setTimeout(tick, 16);
      } else {
        frameId = requestAnimationFrame(tick);
      }

      return () => {
        disposed = true;
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        canvasEl.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        canvasEl.removeEventListener('wheel', onWheel);
        canvasEl.removeEventListener('touchstart', onTouchStart);
        canvasEl.removeEventListener('touchmove', onTouchMove);
        canvasEl.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('resize', onResize);
        canvasEl.removeEventListener('webglcontextlost', handleContextLost);
        canvasEl.removeEventListener('webglcontextrestored', handleContextRestored);

        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => m?.dispose());
          }
        });
        envTex.dispose();
        renderer.dispose();
        if (container.contains(canvasEl)) {
          container.removeChild(canvasEl);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (contextLost) {
      return (
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-sky-600 via-sky-800 to-slate-900 flex items-center justify-center p-6 text-center text-white">
          <div className="max-w-md bg-slate-900/90 border border-white/20 rounded-2xl p-6">
            <h2 className="font-fredoka text-2xl font-bold mb-2">
              Tampilan 3D Dijeda
            </h2>
            <p className="text-sm text-slate-300">
              Konteks WebGL perangkat sedang tidak tersedia. Kamu tetap dapat menggunakan mode kuis, kantin, rekap nilai, dan pengaturan guru.
            </p>
          </div>
        </div>
      );
    }

    return <div ref={mountRef} className="fixed inset-0 z-0" />;
  }
);
