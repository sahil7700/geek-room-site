"use client";
import React, { useEffect, useRef } from "react";

// Only render on non-mobile devices
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

export function SupportRobotCanvas({ className = "" }: { className?: string }) {
  if (isMobile) return null;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true, alpha: true }) || 
               canvas.getContext("experimental-webgl", { antialias: true, alpha: true }) as WebGLRenderingContext;
    if (!gl) return;

    let W = 200, H = 200;
    let animationFrameId: number;
    let rafActive = true;

    // Shader sources
    const vsSource = `
        attribute vec3 aPos;
        attribute vec3 aNormal;
        uniform mat4 uModel;
        uniform mat4 uView;
        uniform mat4 uProj;
        uniform mat3 uNormalMat;
        varying vec3 vNormal;
        varying vec3 vFragPos;
        varying vec3 vViewPos;
        void main() {
            vec4 worldPos = uModel * vec4(aPos, 1.0);
            vFragPos = worldPos.xyz;
            vNormal = normalize(uNormalMat * aNormal);
            vViewPos = vec3(0.0, 0.0, 5.0);
            gl_Position = uProj * uView * worldPos;
        }
    `;

    const fsSource = `
        precision mediump float;
        varying vec3 vNormal;
        varying vec3 vFragPos;
        varying vec3 vViewPos;
        uniform vec3 uColor;
        uniform vec3 uEmissive;
        uniform float uMetallic;
        uniform float uRoughness;
        uniform vec3 uLightPos1;
        uniform vec3 uLightColor1;
        uniform vec3 uLightPos2;
        uniform vec3 uLightColor2;
        uniform vec3 uLightPos3;
        uniform vec3 uLightColor3;
        uniform float uOpacity;

        vec3 calcLight(vec3 lightPos, vec3 lightColor, vec3 normal, vec3 viewDir) {
            vec3 lightDir = normalize(lightPos - vFragPos);
            vec3 halfDir = normalize(lightDir + viewDir);
            
            float diff = max(dot(normal, lightDir), 0.0);
            float spec = pow(max(dot(normal, halfDir), 0.0), mix(8.0, 128.0, 1.0 - uRoughness));
            
            float distance = length(lightPos - vFragPos);
            float attenuation = 1.0 / (1.0 + 0.09 * distance + 0.032 * distance * distance);
            
            vec3 ambient = 0.03 * uColor * lightColor;
            vec3 diffuse = diff * uColor * lightColor;
            vec3 specular = spec * mix(lightColor, uColor, uMetallic) * lightColor;
            
            return (ambient + diffuse + specular) * attenuation;
        }

        void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPos - vFragPos);
            
            vec3 result = vec3(0.0);
            result += calcLight(uLightPos1, uLightColor1, normal, viewDir);
            result += calcLight(uLightPos2, uLightColor2, normal, viewDir);
            result += calcLight(uLightPos3, uLightColor3, normal, viewDir);
            result += uEmissive;
            
            // Fresnel rim
            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
            result += fresnel * vec3(0.0, 0.6, 1.0) * 0.4;
            
            // Tone mapping
            result = result / (result + vec3(1.0));
            result = pow(result, vec3(1.0/2.2));
            
            gl_FragColor = vec4(result, uOpacity);
        }
    `;

    function compileShader(src: string, type: number) {
        const s = gl.createShader(type);
        if (!s) return null;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    }

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!program || !vs || !fs) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const locs: Record<string, number | WebGLUniformLocation | null> = {};
    ['aPos', 'aNormal'].forEach(a => locs[a] = gl.getAttribLocation(program, a));
    ['uModel', 'uView', 'uProj', 'uNormalMat', 'uColor', 'uEmissive', 'uMetallic', 'uRoughness',
     'uLightPos1', 'uLightColor1', 'uLightPos2', 'uLightColor2', 'uLightPos3', 'uLightColor3', 'uOpacity']
    .forEach(u => locs[u] = gl.getUniformLocation(program, u));

    // Matrix math
    function mat4Perspective(fov: number, aspect: number, near: number, far: number) {
        const f = 1.0 / Math.tan(fov / 2);
        return new Float32Array([
            f/aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far+near)/(near-far), -1,
            0, 0, (2*far*near)/(near-far), 0
        ]);
    }

    function dot3(a: number[], b: number[]) { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
    function cross3(a: number[], b: number[]) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
    function sub3(a: number[], b: number[]) { return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; }
    function normalize3(v: number[]) { const l=Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]); return l>0?[v[0]/l,v[1]/l,v[2]/l]:[0,0,0]; }

    function mat4LookAt(eye: number[], center: number[], up: number[]) {
        const z = normalize3(sub3(eye, center));
        const x = normalize3(cross3(up, z));
        const y = cross3(z, x);
        return new Float32Array([
            x[0], y[0], z[0], 0,
            x[1], y[1], z[1], 0,
            x[2], y[2], z[2], 0,
            -dot3(x,eye), -dot3(y,eye), -dot3(z,eye), 1
        ]);
    }

    function mat4Identity() { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); }

    function mat4Translate(m: Float32Array, v: number[]) {
        const r = new Float32Array(m);
        r[12] += v[0]; r[13] += v[1]; r[14] += v[2];
        return r;
    }

    function mat4Scale(m: Float32Array, s: number[]) {
        const r = new Float32Array(m);
        r[0]*=s[0]; r[1]*=s[0]; r[2]*=s[0]; r[3]*=s[0];
        r[4]*=s[1]; r[5]*=s[1]; r[6]*=s[1]; r[7]*=s[1];
        r[8]*=s[2]; r[9]*=s[2]; r[10]*=s[2]; r[11]*=s[2];
        return r;
    }

    function mat4RotateX(m: Float32Array, a: number) {
        const c = Math.cos(a), s = Math.sin(a);
        const r = new Float32Array(m);
        const m4=m[4],m5=m[5],m6=m[6],m7=m[7],m8=m[8],m9=m[9],m10=m[10],m11=m[11];
        r[4]=m4*c+m8*s; r[5]=m5*c+m9*s; r[6]=m6*c+m10*s; r[7]=m7*c+m11*s;
        r[8]=m8*c-m4*s; r[9]=m9*c-m5*s; r[10]=m10*c-m6*s; r[11]=m11*c-m7*s;
        return r;
    }

    function mat4RotateY(m: Float32Array, a: number) {
        const c = Math.cos(a), s = Math.sin(a);
        const r = new Float32Array(m);
        const m0=m[0],m1=m[1],m2=m[2],m3=m[3],m8=m[8],m9=m[9],m10=m[10],m11=m[11];
        r[0]=m0*c-m8*s; r[1]=m1*c-m9*s; r[2]=m2*c-m10*s; r[3]=m3*c-m11*s;
        r[8]=m0*s+m8*c; r[9]=m1*s+m9*c; r[10]=m2*s+m10*c; r[11]=m3*s+m11*c;
        return r;
    }

    function mat4RotateZ(m: Float32Array, a: number) {
        const c = Math.cos(a), s = Math.sin(a);
        const r = new Float32Array(m);
        const m0=m[0],m1=m[1],m2=m[2],m3=m[3],m4=m[4],m5=m[5],m6=m[6],m7=m[7];
        r[0]=m0*c+m4*s; r[1]=m1*c+m5*s; r[2]=m2*c+m6*s; r[3]=m3*c+m7*s;
        r[4]=m4*c-m0*s; r[5]=m5*c-m1*s; r[6]=m6*c-m2*s; r[7]=m7*c-m3*s;
        return r;
    }

    function mat3FromMat4(m: Float32Array) {
        return new Float32Array([m[0],m[1],m[2], m[4],m[5],m[6], m[8],m[9],m[10]]);
    }

    interface WebGLMesh {
        vBuf: WebGLBuffer | null;
        nBuf: WebGLBuffer | null;
        iBuf: WebGLBuffer | null;
        count: number;
    }

    function createMesh(vertices: number[], normals: number[], indices: number[]): WebGLMesh {
        const vBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        const nBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        const iBuf = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        return { vBuf, nBuf, iBuf, count: indices.length };
    }

    function createSphere(radius: number, widthSeg: number, heightSeg: number) {
        const verts = [], norms = [], indices = [];
        for (let y = 0; y <= heightSeg; y++) {
            for (let x = 0; x <= widthSeg; x++) {
                const u = x / widthSeg, v = y / heightSeg;
                const theta = u * Math.PI * 2, phi = v * Math.PI;
                const px = -radius * Math.cos(theta) * Math.sin(phi);
                const py = radius * Math.cos(phi);
                const pz = radius * Math.sin(theta) * Math.sin(phi);
                verts.push(px, py, pz);
                const n = normalize3([px, py, pz]);
                norms.push(n[0], n[1], n[2]);
            }
        }
        for (let y = 0; y < heightSeg; y++) {
            for (let x = 0; x < widthSeg; x++) {
                const a = y * (widthSeg + 1) + x;
                const b = a + widthSeg + 1;
                indices.push(a, b, a + 1, b, b + 1, a + 1);
            }
        }
        return createMesh(verts, norms, indices);
    }

    function createRoundedBox(w: number, h: number, d: number, r: number, seg: number) {
        const verts = [], norms = [], indices = [];
        const sph = seg || 16;
        for (let y = 0; y <= sph; y++) {
            for (let x = 0; x <= sph; x++) {
                const u = x / sph, v = y / sph;
                const theta = u * Math.PI * 2, phi = v * Math.PI;
                let px = -Math.cos(theta) * Math.sin(phi);
                let py = Math.cos(phi);
                let pz = Math.sin(theta) * Math.sin(phi);
                
                const power = 3.5;
                const nx = px, ny = py, nz = pz;
                px = Math.sign(px) * Math.pow(Math.abs(px), 1/power) * w/2;
                py = Math.sign(py) * Math.pow(Math.abs(py), 1/power) * h/2;
                pz = Math.sign(pz) * Math.pow(Math.abs(pz), 1/power) * d/2;
                
                verts.push(px, py, pz);
                const nn = normalize3([nx, ny, nz]);
                norms.push(nn[0], nn[1], nn[2]);
            }
        }
        for (let y = 0; y < sph; y++) {
            for (let x = 0; x < sph; x++) {
                const a = y * (sph + 1) + x;
                const b = a + sph + 1;
                indices.push(a, b, a+1, b, b+1, a+1);
            }
        }
        return createMesh(verts, norms, indices);
    }

    function createCylinder(rTop: number, rBot: number, height: number, seg: number) {
        const verts = [], norms = [], indices = [];
        const halfH = height / 2;
        for (let i = 0; i <= seg; i++) {
            const a = (i / seg) * Math.PI * 2;
            const c = Math.cos(a), s = Math.sin(a);
            verts.push(c * rTop, halfH, s * rTop);
            const n = normalize3([c, 0, s]);
            norms.push(n[0], n[1], n[2]);
            verts.push(c * rBot, -halfH, s * rBot);
            norms.push(n[0], n[1], n[2]);
        }
        for (let i = 0; i < seg; i++) {
            const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
            indices.push(a, b, c, b, d, c);
        }
        const topCenter = verts.length / 3;
        verts.push(0, halfH, 0); norms.push(0, 1, 0);
        for (let i = 0; i <= seg; i++) {
            const a = (i / seg) * Math.PI * 2;
            verts.push(Math.cos(a) * rTop, halfH, Math.sin(a) * rTop);
            norms.push(0, 1, 0);
        }
        for (let i = 0; i < seg; i++) indices.push(topCenter, topCenter + 1 + i, topCenter + 2 + i);

        const botCenter = verts.length / 3;
        verts.push(0, -halfH, 0); norms.push(0, -1, 0);
        for (let i = 0; i <= seg; i++) {
            const a = (i / seg) * Math.PI * 2;
            verts.push(Math.cos(a) * rBot, -halfH, Math.sin(a) * rBot);
            norms.push(0, -1, 0);
        }
        for (let i = 0; i < seg; i++) indices.push(botCenter, botCenter + 2 + i, botCenter + 1 + i);

        return createMesh(verts, norms, indices);
    }

    function createTorus(R: number, r: number, seg1: number, seg2: number) {
        const verts = [], norms = [], indices = [];
        for (let i = 0; i <= seg1; i++) {
            const u = (i / seg1) * Math.PI * 2;
            for (let j = 0; j <= seg2; j++) {
                const v = (j / seg2) * Math.PI * 2;
                const px = (R + r * Math.cos(v)) * Math.cos(u);
                const py = r * Math.sin(v);
                const pz = (R + r * Math.cos(v)) * Math.sin(u);
                verts.push(px, py, pz);
                const cx = R * Math.cos(u), cz = R * Math.sin(u);
                const n = normalize3([px - cx, py, pz - cz]);
                norms.push(n[0], n[1], n[2]);
            }
        }
        for (let i = 0; i < seg1; i++) {
            for (let j = 0; j < seg2; j++) {
                const a = i * (seg2 + 1) + j;
                const b = a + seg2 + 1;
                indices.push(a, b, a + 1, b, b + 1, a + 1);
            }
        }
        return createMesh(verts, norms, indices);
    }

    function drawMesh(mesh: WebGLMesh, modelMatrix: Float32Array, color: number[], emissive?: number[], metallic?: number, roughness?: number, opacity?: number) {
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vBuf);
        gl.enableVertexAttribArray(locs.aPos as number);
        gl.vertexAttribPointer(locs.aPos as number, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.nBuf);
        gl.enableVertexAttribArray(locs.aNormal as number);
        gl.vertexAttribPointer(locs.aNormal as number, 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(locs.uModel, false, modelMatrix);
        gl.uniformMatrix3fv(locs.uNormalMat, false, mat3FromMat4(modelMatrix));
        gl.uniform3fv(locs.uColor, color);
        gl.uniform3fv(locs.uEmissive, emissive || [0, 0, 0]);
        gl.uniform1f(locs.uMetallic, metallic || 0.0);
        gl.uniform1f(locs.uRoughness, roughness || 0.5);
        gl.uniform1f(locs.uOpacity, opacity !== undefined ? opacity : 1.0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.iBuf);
        gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
    }

    const sphere = createSphere(1, 32, 24);
    const headMesh = createRoundedBox(2.2, 2.0, 2.0, 0.3, 24);
    const jawMesh = createRoundedBox(1.8, 0.5, 1.8, 0.2, 16);
    const eyeSocket = createSphere(0.38, 20, 16);
    const eyeBall = createSphere(0.32, 20, 16);
    const pupil = createSphere(0.16, 16, 12);
    const iris = createSphere(0.22, 18, 14);
    const eyebrowMesh = createRoundedBox(0.55, 0.1, 0.15, 0.05, 10);
    const antennaMesh = createCylinder(0.06, 0.06, 0.7, 12);
    const antennaBall = createSphere(0.12, 16, 12);
    const earMesh = createRoundedBox(0.3, 0.5, 0.25, 0.1, 10);
    const neckMesh = createCylinder(0.35, 0.45, 0.4, 16);
    const neckRing = createTorus(0.42, 0.04, 24, 12);
    const cheekMesh = createSphere(0.2, 12, 10);
    const mouthLine = createRoundedBox(0.8, 0.06, 0.1, 0.02, 8);
    const panelLine = createRoundedBox(0.4, 0.03, 0.05, 0.01, 6);
    const headBolt = createCylinder(0.07, 0.07, 0.15, 8);
    const visorMesh = createRoundedBox(1.6, 0.7, 0.3, 0.1, 14);

    let blinkTimer = 0, blinkState = 0, blinkAmount = 0;
    let lookX = 0, lookY = 0, targetLookX = 0, targetLookY = 0;
    let headTiltX = 0, headTiltY = 0, headTiltZ = 0;
    let targetHeadTiltX = 0, targetHeadTiltY = 0, targetHeadTiltZ = 0;
    let mouthOpen = 0;
    const targetMouthOpen = 0.12;
    let eyebrowL = 0, eyebrowR = 0;
    const targetEyebrowL = 0.15, targetEyebrowR = 0.15;
    let eyeScale = 1;
    const targetEyeScale = 0.85;
    let pupilScale = 1;
    const targetPupilScale = 1.1;
    let cheekGlow = 0;
    const targetCheekGlow = 1;
    let jawOffset = 0;
    const targetJawOffset = -0.06;
    let squintL = 0, squintR = 0;
    const targetSquintL = 0.3, targetSquintR = 0.3;

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function render(time: number) {
        if (!rafActive) return;
        const t = time * 0.001;
        
        const smoothing = 0.06;
        eyebrowL = lerp(eyebrowL, targetEyebrowL, smoothing);
        eyebrowR = lerp(eyebrowR, targetEyebrowR, smoothing);
        mouthOpen = lerp(mouthOpen, targetMouthOpen, smoothing);
        eyeScale = lerp(eyeScale, targetEyeScale, smoothing);
        pupilScale = lerp(pupilScale, targetPupilScale, smoothing);
        cheekGlow = lerp(cheekGlow, targetCheekGlow, smoothing);
        jawOffset = lerp(jawOffset, targetJawOffset, smoothing);
        squintL = lerp(squintL, targetSquintL, smoothing);
        squintR = lerp(squintR, targetSquintR, smoothing);

        const idleBob = Math.sin(t * 1.2) * 0.08;
        const idleSway = Math.sin(t * 0.7) * 0.04;
        const breathe = Math.sin(t * 2.0) * 0.015;

        // More look-arounds automatically to give it life, without mouse
        if (Math.random() < 0.01) {
            targetLookX = (Math.random() - 0.5) * 0.5;
            targetLookY = (Math.random() - 0.5) * 0.4;
        }
        if (Math.random() < 0.005) {
            targetLookX = 0; targetLookY = 0;
        }

        lookX = lerp(lookX, targetLookX, 0.04);
        lookY = lerp(lookY, targetLookY, 0.04);

        targetHeadTiltY = lookX * 0.3 + idleSway;
        targetHeadTiltX = lookY * 0.2;
        targetHeadTiltZ = -lookX * 0.05;
        headTiltX = lerp(headTiltX, targetHeadTiltX, 0.03);
        headTiltY = lerp(headTiltY, targetHeadTiltY, 0.03);
        headTiltZ = lerp(headTiltZ, targetHeadTiltZ, 0.03);

        blinkTimer += 0.016;
        if (blinkState === 0 && blinkTimer > 2.5 + Math.random() * 3) {
            blinkState = 1; blinkTimer = 0;
        }
        if (blinkState === 1) {
            blinkAmount = lerp(blinkAmount, 1, 0.3);
            if (blinkAmount > 0.95) { blinkState = 2; blinkTimer = 0; }
        }
        if (blinkState === 2) {
            if (blinkTimer > 0.06) { blinkState = 3; }
        }
        if (blinkState === 3) {
            blinkAmount = lerp(blinkAmount, 0, 0.2);
            if (blinkAmount < 0.05) { blinkAmount = 0; blinkState = 0; blinkTimer = 0; }
        }

        // clear transparent
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const aspect = W / H;
        // Increased FoV slightly because we want it to fit inside a small container
        const proj = mat4Perspective(Math.PI / 4, aspect, 0.1, 100);
        // Back the camera off a bit so the robot fits nicely inside small square 
        const view = mat4LookAt([0, 0.3, 7.5], [0, 0.1, 0], [0, 1, 0]);

        gl.uniformMatrix4fv(locs.uProj as WebGLUniformLocation, false, proj);
        gl.uniformMatrix4fv(locs.uView as WebGLUniformLocation, false, view);

        const lt = t * 0.5;
        // Adjust light colors to match the blue theme rather than default
        gl.uniform3f(locs.uLightPos1 as WebGLUniformLocation, Math.sin(lt) * 3, 3, 3);
        gl.uniform3f(locs.uLightColor1 as WebGLUniformLocation, 0.2, 0.5, 1.0); // blueish
        
        gl.uniform3f(locs.uLightPos2 as WebGLUniformLocation, -3, -1, 2);
        gl.uniform3f(locs.uLightColor2 as WebGLUniformLocation, 0.5, 0.1, 0.8); // purpleish
        
        gl.uniform3f(locs.uLightPos3 as WebGLUniformLocation, Math.cos(lt) * 2, 2, -2);
        gl.uniform3f(locs.uLightColor3 as WebGLUniformLocation, 0.0, 0.8, 1.0);

        // Center it
        const offsetX = 0;

        let base = mat4Identity();
        base = mat4Translate(base, [offsetX, idleBob, 0]);
        base = mat4RotateY(base, headTiltY);
        base = mat4RotateX(base, headTiltX);
        base = mat4RotateZ(base, headTiltZ);

        // HEAD
        let m = new Float32Array(base);
        m = mat4Scale(m, [1 + breathe, 1, 1 + breathe * 0.5]);
        drawMesh(headMesh, m, [0.08, 0.08, 0.12], [0, 0, 0], 0.8, 0.3, 1.0);

        for (let i = -1; i <= 1; i += 2) {
            let pl = mat4Translate(base, [i * 0.45, 0.5, 0.95]);
            pl = mat4Scale(pl, [1, 1, 1]);
            drawMesh(panelLine, pl, [0.04, 0.04, 0.08], [0, 0.1, 0.15], 0.9, 0.2, 1.0);
        }

        for (let side = -1; side <= 1; side += 2) {
            let bolt = mat4Translate(base, [side * 1.05, 0.3, 0.3]);
            bolt = mat4RotateZ(bolt, Math.PI / 2);
            drawMesh(headBolt, bolt, [0.15, 0.15, 0.2], [0, 0, 0], 0.9, 0.2, 1.0);
            
            bolt = mat4Translate(base, [side * 1.05, -0.1, 0.3]);
            bolt = mat4RotateZ(bolt, Math.PI / 2);
            drawMesh(headBolt, bolt, [0.15, 0.15, 0.2], [0, 0, 0], 0.9, 0.2, 1.0);
        }

        let visor = mat4Translate(base, [0, 0.1, 0.85]);
        visor = mat4Scale(visor, [1, 1, 1]);
        drawMesh(visorMesh, visor, [0.02, 0.02, 0.04], [0, 0.02, 0.04], 0.1, 0.8, 1.0);

        for (let side = -1; side <= 1; side += 2) {
            const ex = side * 0.42;
            const ey = 0.15;
            const ez = 0.88;
            const sq = side === -1 ? squintL : squintR;
            const effectiveBlink = Math.max(blinkAmount, sq);

            let socket = mat4Translate(base, [ex, ey, ez]);
            socket = mat4Scale(socket, [1, 1 - effectiveBlink * 0.7, 0.5]);
            drawMesh(eyeSocket, socket, [0.01, 0.01, 0.02], [0, 0, 0], 0.1, 0.9, 1.0);

            let eye = mat4Translate(base, [ex, ey, ez + 0.05]);
            eye = mat4Scale(eye, [0.9 * eyeScale, (1 - effectiveBlink * 0.85) * eyeScale, 0.5]);
            drawMesh(eyeBall, eye, [0.85, 0.9, 0.95], [0.1, 0.1, 0.15], 0.1, 0.4, 1.0);

            if (effectiveBlink < 0.7) {
                let ir = mat4Translate(base, [ex + lookX * 0.12, ey + lookY * 0.1, ez + 0.15]);
                ir = mat4Scale(ir, [0.9 * eyeScale, (1 - effectiveBlink * 0.9) * eyeScale, 0.4]);
                // Change eye color to bright blue/cyan
                drawMesh(iris, ir, [0, 0.6, 1.0], [0, 0.3, 0.5], 0.2, 0.3, 1.0);

                let pp = mat4Translate(base, [ex + lookX * 0.14, ey + lookY * 0.12, ez + 0.2]);
                pp = mat4Scale(pp, [pupilScale * eyeScale * 0.9, (1 - effectiveBlink * 0.95) * pupilScale * eyeScale, 0.4]);
                drawMesh(pupil, pp, [0.01, 0.01, 0.02], [0, 0, 0], 0.0, 0.9, 1.0);

                let hl = mat4Translate(base, [ex + lookX * 0.08 + side * 0.06, ey + lookY * 0.06 + 0.08, ez + 0.25]);
                hl = mat4Scale(hl, [0.06, 0.06 * (1 - effectiveBlink), 0.03]);
                drawMesh(sphere, hl, [1, 1, 1], [0.8, 0.8, 0.8], 0, 0.1, 0.9);
            }

            let lidTop = mat4Translate(base, [ex, ey + 0.28 * (1 - effectiveBlink * 0.5), ez + 0.1]);
            lidTop = mat4Scale(lidTop, [0.42, 0.08 + effectiveBlink * 0.15, 0.25]);
            drawMesh(sphere, lidTop, [0.08, 0.08, 0.12], [0, 0, 0], 0.8, 0.3, 1.0);

            let lidBot = mat4Translate(base, [ex, ey - 0.25 + effectiveBlink * 0.15, ez + 0.1]);
            lidBot = mat4Scale(lidBot, [0.38, 0.06 + effectiveBlink * 0.1, 0.22]);
            drawMesh(sphere, lidBot, [0.08, 0.08, 0.12], [0, 0, 0], 0.8, 0.3, 1.0);
        }

        for (let side = -1; side <= 1; side += 2) {
            const eb = side === -1 ? eyebrowL : eyebrowR;
            let brow = mat4Translate(base, [side * 0.42, 0.55 + eb, 0.9]);
            brow = mat4RotateZ(brow, side * eb * 0.5 + side * -0.05);
            brow = mat4Scale(brow, [1, 1.5, 1]);
            drawMesh(eyebrowMesh, brow, [0.06, 0.06, 0.08], [0, 0.15, 0.2], 0.9, 0.2, 1.0);
        }

        for (let side = -1; side <= 1; side += 2) {
            let ant = mat4Translate(base, [side * 0.5, 1.2, -0.1]);
            ant = mat4RotateZ(ant, side * 0.2 + Math.sin(t * 2 + side) * 0.05);
            drawMesh(antennaMesh, ant, [0.12, 0.12, 0.15], [0, 0, 0], 0.9, 0.2, 1.0);

            let ball = mat4Translate(base, [side * (0.5 + Math.sin(side * 0.2) * 0.15), 1.55 + Math.sin(t * 3 + side * 2) * 0.03, -0.1]);
            ball = mat4Scale(ball, [1, 1, 1]);
            const glow = (Math.sin(t * 3 + side) * 0.5 + 0.5);
            drawMesh(antennaBall, ball, [0, 0.4, 0.6], [0, glow * 0.8, glow], 0.1, 0.3, 1.0);
        }

        let centerAnt = mat4Translate(base, [0, 1.3, 0]);
        centerAnt = mat4Scale(centerAnt, [0.8, 1.2, 0.8]);
        drawMesh(antennaMesh, centerAnt, [0.12, 0.12, 0.15], [0, 0, 0], 0.9, 0.2, 1.0);
        
            const centerBall = mat4Translate(base, [0, 1.75, 0]);
            const cGlow = Math.sin(t * 2) * 0.5 + 0.5;
            // Make center antenna glow blueish
            drawMesh(antennaBall, centerBall, [0.1, 0.5, 0.8], [0, cGlow * 0.6, cGlow], 0.1, 0.3, 1.0);
    
        for (let side = -1; side <= 1; side += 2) {
            let ear = mat4Translate(base, [side * 1.25, 0.1, 0]);
            ear = mat4Scale(ear, [0.8, 1, 0.8]);
            drawMesh(earMesh, ear, [0.08, 0.08, 0.12], [0, 0, 0], 0.8, 0.3, 1.0);
            
            let earLight = mat4Translate(base, [side * 1.3, 0.1, 0.15]);
            earLight = mat4Scale(earLight, [0.06, 0.15, 0.06]);
            const earGlow = Math.sin(t * 2.5 + side * 1.5) * 0.5 + 0.5;
            drawMesh(sphere, earLight, [0, 0.3, 0.5], [0, earGlow * 0.5, earGlow * 0.8], 0.1, 0.3, 1.0);
        }

        for (let side = -1; side <= 1; side += 2) {
            let cheek = mat4Translate(base, [side * 0.7, -0.15, 0.7]);
            cheek = mat4Scale(cheek, [1, 0.7, 0.5]);
            drawMesh(cheekMesh, cheek, [0.12, 0.08, 0.1],
                [cheekGlow * 0.8, cheekGlow * 0.1, cheekGlow * 0.3], 0.3, 0.6, cheekGlow * 0.7);
        }

        let mouthPlate = mat4Translate(base, [0, -0.45 + jawOffset, 0.85]);
        mouthPlate = mat4Scale(mouthPlate, [1, 1, 1]);
        drawMesh(mouthLine, mouthPlate, [0.04, 0.04, 0.08], [0, 0.05, 0.08], 0.8, 0.3, 1.0);

        if (mouthOpen > 0.01) {
            let mouthHole = mat4Translate(base, [0, -0.45 + jawOffset - mouthOpen * 0.5, 0.88]);
            mouthHole = mat4Scale(mouthHole, [0.35, mouthOpen * 2, 0.1]);
            drawMesh(sphere, mouthHole, [0.01, 0.01, 0.02], [0, 0.1 * mouthOpen * 5, 0.2 * mouthOpen * 5], 0.1, 0.9, 1.0);
        }

        for (let side = -1; side <= 1; side += 2) {
            let mouthSide = mat4Translate(base, [side * 0.35, -0.43 + jawOffset, 0.88]);
            mouthSide = mat4Scale(mouthSide, [0.04, 0.04, 0.04]);
            drawMesh(sphere, mouthSide, [0, 0.4, 0.5], [0, 0.3, 0.5], 0.2, 0.4, 1.0);
        }

        let jaw = mat4Translate(base, [0, -0.75 + jawOffset, 0]);
        jaw = mat4Scale(jaw, [0.95, 1, 0.95]);
        drawMesh(jawMesh, jaw, [0.09, 0.09, 0.14], [0, 0, 0], 0.8, 0.3, 1.0);

        const neck = mat4Translate(base, [0, -1.15, 0]);
        drawMesh(neckMesh, neck, [0.08, 0.08, 0.12], [0, 0, 0], 0.8, 0.3, 1.0);

        for (let i = 0; i < 3; i++) {
            let ring = mat4Translate(base, [0, -1.0 - i * 0.12, 0]);
            ring = mat4Scale(ring, [1, 1, 1]);
            drawMesh(neckRing, ring, [0.06, 0.06, 0.08], [0, 0.05 * (i === 1 ? 1 : 0), 0.1 * (i === 1 ? 1 : 0)], 0.9, 0.2, 1.0);
        }

        let foreheadLight = mat4Translate(base, [0, 0.7, 0.92]);
        foreheadLight = mat4Scale(foreheadLight, [0.4, 0.03, 0.05]);
        const fGlow = Math.sin(t * 1.5) * 0.5 + 0.5;
        drawMesh(sphere, foreheadLight, [0, 0.3, 0.5], [0, fGlow * 0.5, fGlow * 0.8], 0.2, 0.3, 1.0);

        const lightPositions = [
            [0.8, 0.6, 0.6], [-0.8, 0.6, 0.6],
            [0.9, -0.2, 0.5], [-0.9, -0.2, 0.5]
        ];
        lightPositions.forEach((pos, i) => {
            let light = mat4Translate(base, pos);
            light = mat4Scale(light, [0.04, 0.04, 0.04]);
            const g = Math.sin(t * 2 + i * 1.5) * 0.5 + 0.5;
            drawMesh(sphere, light, [0, 0.2, 0.3], [0, g * 0.3, g * 0.5], 0.1, 0.3, 1.0);
        });

        let chin = mat4Translate(base, [0, -0.85, 0.55]);
        chin = mat4Scale(chin, [0.15, 0.08, 0.08]);
        drawMesh(sphere, chin, [0, 0.3, 0.4], [0, 0.15, 0.2], 0.2, 0.4, 1.0);

        animationFrameId = requestAnimationFrame(render);
    }

    function handleResize() {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Update canvas internal rendering size
      W = canvas.width = rect.width * dpr;
      H = canvas.height = rect.height * dpr;
      
      // Optional: enforce CSS size to match parent
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      gl.viewport(0, 0, W, H);
    }

    const ro = new ResizeObserver(() => {
      handleResize();
    });
    
    if (canvas.parentElement) {
      ro.observe(canvas.parentElement);
    }
    
    // Initial size setup
    handleResize();
    animationFrameId = requestAnimationFrame(render);

    return () => {
        rafActive = false;
        cancelAnimationFrame(animationFrameId);
        ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={`block w-full h-full ${className}`} style={{ background: "transparent" }} />;
}
