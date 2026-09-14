/**
 * Glass Reveal Component - React Bits Pro Port (Vanilla JS + WebGL)
 * 
 * Implementação fiel e exata do componente oficial @reactbits-starter/glass-reveal-tw
 * Configuração:
 *   shape: "portal" (uShape = 3)
 *   size: 0.41
 *   distortion: 1.4000000000000004
 *   aberration: 0.012
 *   wobble: 0.35000000000000003
 *   wobbleSpeed: 0.7000000000000001
 *   waveFrequency: 0
 *   waveStrength: 0
 *   waveSpeed: 0
 *   grain: 0.008
 *   grainSpeed: 13
 *   follow: 0.45
 */

(function initGlassReveal() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  // Remove qualquer container anterior se já existir
  const oldContainer = heroSection.querySelector('.glass-reveal-bg');
  if (oldContainer) {
    oldContainer.remove();
  }

  // Configuração oficial
  const config = {
    shape: 'portal',
    shapeIndex: 3, // square:0, circle:1, blob:2, portal:3
    size: 0.4,
    distortion: 0.10000000000000009,
    aberration: 0.002,
    wobble: 0.0,
    wobbleSpeed: 0.0,
    waveFrequency: 0.0,
    waveStrength: 0.0,
    waveSpeed: 0.0,
    grain: 0.002,
    grainSpeed: 11.0,
    follow: 0.0,
    softness: 0.0,
    grayscale: 1.0,
    dim: 0.0,
    fallbackColor: [0.09, 0.09, 0.09], // #171717
    returnToCenter: true,
    dpr: 1.5,
    insideImage: (window.__GLASS_REVEAL_ASSETS__ && window.__GLASS_REVEAL_ASSETS__.inside) || 'assets/banner_color.webp',
    outsideImage: (window.__GLASS_REVEAL_ASSETS__ && window.__GLASS_REVEAL_ASSETS__.outside) || 'assets/banner_pb.webp'
  };

  heroSection.style.position = 'relative';

  // Container para o canvas
  const container = document.createElement('div');
  container.className = 'glass-reveal-bg';
  container.style.position = 'absolute';
  container.style.inset = '0';
  container.style.zIndex = '0';
  container.style.pointerEvents = 'none';
  container.style.overflow = 'hidden';

  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  heroSection.insertBefore(container, heroSection.firstChild);

  // Inicializa contexto WebGL (tenta webgl2 primeiro, depois webgl com extensão)
  let gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  let isWebGL2 = !!gl;

  if (!gl) {
    gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' }) ||
         canvas.getContext('experimental-webgl');
    if (gl) {
      gl.getExtension('OES_standard_derivatives');
    }
  }

  if (!gl) {
    console.warn('WebGL não suportado pelo navegador.');
    return;
  }

  // Shaders do componente oficial React Bits Pro
  const vertexShaderSrc = isWebGL2 ? `#version 300 es
    in vec2 position;
    out vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  ` : `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSrc = isWebGL2 ? `#version 300 es
    precision highp float;
    in vec2 vUv;
    out vec4 fragColor;

    uniform sampler2D uInside;
    uniform sampler2D uOutside;
    uniform vec2 uInsideSize;
    uniform vec2 uOutsideSize;
    uniform float uInsideReady;
    uniform float uOutsideReady;
    uniform vec3 uFallback;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform int uShape;
    uniform float uSize;
    uniform float uSoftness;
    uniform float uDistortion;
    uniform float uAberration;
    uniform float uWobble;
    uniform float uWobbleTime;
    uniform float uWaveFrequency;
    uniform float uWaveStrength;
    uniform float uWaveTime;
    uniform float uGrain;
    uniform float uGrainTime;
    uniform float uGray;
    uniform float uDim;

    vec2 coverUv(vec2 uv, vec2 box, vec2 tex) {
      float boxRatio = box.x / box.y;
      float texRatio = tex.x / tex.y;
      vec2 scale = boxRatio > texRatio
        ? vec2(1.0, texRatio / boxRatio)
        : vec2(boxRatio / texRatio, 1.0);
      return (uv - 0.5) * scale + 0.5;
    }

    float grain(vec2 uv, float t) {
      vec3 p = fract(vec3(uv * 613.7, t) * vec3(0.1031, 0.1030, 0.0973));
      p += dot(p, p.yxz + 33.33);
      return fract((p.x + p.y) * p.z);
    }

    float blobRadius(float a, float t) {
      float bulge = 0.5 * sin(3.0 * a + t)
        + 0.3 * sin(5.0 * a - 1.7 * t + 1.3)
        + 0.2 * sin(7.0 * a + 0.6 * t + 2.1);
      return 1.0 + bulge * uWobble * 0.35;
    }

    float outline(vec2 q) {
      if (uShape == 0) return max(abs(q.x), abs(q.y)) - 1.0;
      if (uShape == 1) return length(q) - 1.0;
      return length(q) - blobRadius(atan(q.y, q.x), uWobbleTime);
    }

    vec3 sampleOutside(vec2 uv) {
      if (uOutsideReady < 0.5) return uFallback;
      vec3 c = texture(uOutside, uv).rgb;
      float luma = dot(c, vec3(0.299, 0.587, 0.114));
      return mix(c, vec3(luma), uGray) * (1.0 - uDim);
    }

    void main() {
      vec2 aspect = vec2(
        min(uResolution.y / uResolution.x, 1.0),
        min(uResolution.x / uResolution.y, 1.0)
      );

      vec2 p = ((vUv * 2.0 - 1.0) - uPointer) / aspect;
      vec2 q = p / max(uSize, 0.001);
      float d = outline(q);

      float aa = fwidth(d) * 1.5;

      float soft = uShape == 3 ? uSoftness + 0.8 : max(uSoftness, aa);
      float mask = 1.0 - smoothstep(-soft * 0.5, soft * 0.5, d);
      if (uShape == 3) mask = mask * mask * (3.0 - 2.0 * mask);

      vec2 outUv = coverUv(vUv, uResolution, uOutsideSize);
      outUv.y += sin(outUv.y * uWaveFrequency + uWaveTime) * uWaveStrength;
      outUv += (grain(vUv, uGrainTime) - 0.5) * uGrain;
      vec3 outside = sampleOutside(outUv);

      float r2 = dot(q, q) * 0.25;
      float scale = uDistortion >= 0.0
        ? 1.0 + uDistortion * r2
        : 1.0 / (1.0 - uDistortion * r2);
      float reach = uShape == 3 ? mask : 1.0;
      vec2 lensOffset = q * (scale - 1.0) * uSize * aspect * 0.5 * reach;
      vec2 inUv = coverUv(vUv - lensOffset, uResolution, uInsideSize);
      vec2 fringe = q * uAberration * 0.5 * reach;

      vec3 inside = uFallback;
      if (uInsideReady > 0.5) {
        inside = vec3(
          texture(uInside, inUv + fringe).r,
          texture(uInside, inUv).g,
          texture(uInside, inUv - fringe).b
        );
      }

      fragColor = vec4(mix(outside, inside, mask), 1.0);
    }
  ` : `
    #extension GL_OES_standard_derivatives : enable
    precision highp float;
    varying vec2 vUv;

    uniform sampler2D uInside;
    uniform sampler2D uOutside;
    uniform vec2 uInsideSize;
    uniform vec2 uOutsideSize;
    uniform float uInsideReady;
    uniform float uOutsideReady;
    uniform vec3 uFallback;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform int uShape;
    uniform float uSize;
    uniform float uSoftness;
    uniform float uDistortion;
    uniform float uAberration;
    uniform float uWobble;
    uniform float uWobbleTime;
    uniform float uWaveFrequency;
    uniform float uWaveStrength;
    uniform float uWaveTime;
    uniform float uGrain;
    uniform float uGrainTime;
    uniform float uGray;
    uniform float uDim;

    vec2 coverUv(vec2 uv, vec2 box, vec2 tex) {
      float boxRatio = box.x / box.y;
      float texRatio = tex.x / tex.y;
      vec2 scale = boxRatio > texRatio
        ? vec2(1.0, texRatio / boxRatio)
        : vec2(boxRatio / texRatio, 1.0);
      return (uv - 0.5) * scale + 0.5;
    }

    float grain(vec2 uv, float t) {
      vec3 p = fract(vec3(uv * 613.7, t) * vec3(0.1031, 0.1030, 0.0973));
      p += dot(p, p.yxz + 33.33);
      return fract((p.x + p.y) * p.z);
    }

    float blobRadius(float a, float t) {
      float bulge = 0.5 * sin(3.0 * a + t)
        + 0.3 * sin(5.0 * a - 1.7 * t + 1.3)
        + 0.2 * sin(7.0 * a + 0.6 * t + 2.1);
      return 1.0 + bulge * uWobble * 0.35;
    }

    float outline(vec2 q) {
      if (uShape == 0) return max(abs(q.x), abs(q.y)) - 1.0;
      if (uShape == 1) return length(q) - 1.0;
      return length(q) - blobRadius(atan(q.y, q.x), uWobbleTime);
    }

    vec3 sampleOutside(vec2 uv) {
      if (uOutsideReady < 0.5) return uFallback;
      vec3 c = texture2D(uOutside, uv).rgb;
      float luma = dot(c, vec3(0.299, 0.587, 0.114));
      return mix(c, vec3(luma), uGray) * (1.0 - uDim);
    }

    void main() {
      vec2 aspect = vec2(
        min(uResolution.y / uResolution.x, 1.0),
        min(uResolution.x / uResolution.y, 1.0)
      );

      vec2 p = ((vUv * 2.0 - 1.0) - uPointer) / aspect;
      vec2 q = p / max(uSize, 0.001);
      float d = outline(q);

      #ifdef GL_OES_standard_derivatives
        float aa = fwidth(d) * 1.5;
      #else
        float aa = 0.01;
      #endif

      float soft = uShape == 3 ? uSoftness + 0.8 : max(uSoftness, aa);
      float mask = 1.0 - smoothstep(-soft * 0.5, soft * 0.5, d);
      if (uShape == 3) mask = mask * mask * (3.0 - 2.0 * mask);

      vec2 outUv = coverUv(vUv, uResolution, uOutsideSize);
      outUv.y += sin(outUv.y * uWaveFrequency + uWaveTime) * uWaveStrength;
      outUv += (grain(vUv, uGrainTime) - 0.5) * uGrain;
      vec3 outside = sampleOutside(outUv);

      float r2 = dot(q, q) * 0.25;
      float scale = uDistortion >= 0.0
        ? 1.0 + uDistortion * r2
        : 1.0 / (1.0 - uDistortion * r2);
      float reach = uShape == 3 ? mask : 1.0;
      vec2 lensOffset = q * (scale - 1.0) * uSize * aspect * 0.5 * reach;
      vec2 inUv = coverUv(vUv - lensOffset, uResolution, uInsideSize);
      vec2 fringe = q * uAberration * 0.5 * reach;

      vec3 inside = uFallback;
      if (uInsideReady > 0.5) {
        inside = vec3(
          texture2D(uInside, inUv + fringe).r,
          texture2D(uInside, inUv).g,
          texture2D(uInside, inUv - fringe).b
        );
      }

      gl_FragColor = vec4(mix(outside, inside, mask), 1.0);
    }
  `;

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Erro de compilação de shader:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSrc);
  const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Erro ao linkar programa WebGL:', gl.getProgramInfoLog(prog));
    return;
  }

  gl.useProgram(prog);

  // Geometria de tela cheia (dois triângulos)
  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, 'position');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Localização dos Uniforms
  const uLoc = {
    uInside: gl.getUniformLocation(prog, 'uInside'),
    uOutside: gl.getUniformLocation(prog, 'uOutside'),
    uInsideSize: gl.getUniformLocation(prog, 'uInsideSize'),
    uOutsideSize: gl.getUniformLocation(prog, 'uOutsideSize'),
    uInsideReady: gl.getUniformLocation(prog, 'uInsideReady'),
    uOutsideReady: gl.getUniformLocation(prog, 'uOutsideReady'),
    uFallback: gl.getUniformLocation(prog, 'uFallback'),
    uResolution: gl.getUniformLocation(prog, 'uResolution'),
    uPointer: gl.getUniformLocation(prog, 'uPointer'),
    uShape: gl.getUniformLocation(prog, 'uShape'),
    uSize: gl.getUniformLocation(prog, 'uSize'),
    uSoftness: gl.getUniformLocation(prog, 'uSoftness'),
    uDistortion: gl.getUniformLocation(prog, 'uDistortion'),
    uAberration: gl.getUniformLocation(prog, 'uAberration'),
    uWobble: gl.getUniformLocation(prog, 'uWobble'),
    uWobbleTime: gl.getUniformLocation(prog, 'uWobbleTime'),
    uWaveFrequency: gl.getUniformLocation(prog, 'uWaveFrequency'),
    uWaveStrength: gl.getUniformLocation(prog, 'uWaveStrength'),
    uWaveTime: gl.getUniformLocation(prog, 'uWaveTime'),
    uGrain: gl.getUniformLocation(prog, 'uGrain'),
    uGrainTime: gl.getUniformLocation(prog, 'uGrainTime'),
    uGray: gl.getUniformLocation(prog, 'uGray'),
    uDim: gl.getUniformLocation(prog, 'uDim')
  };

  // Carregador de textura
  function createTexture() {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Pixel de fallback preto
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([23, 23, 23, 255]));
    return tex;
  }

  const texInside = createTexture();
  const texOutside = createTexture();

  let insideReady = 0;
  let outsideReady = 0;
  let insideSize = [1, 1];
  let outsideSize = [1, 1];

  function loadTexture(tex, url, onReady) {
    const img = new Image();
    // Apenas define crossOrigin se for uma URL externa (http/https)
    if (/^https?:\/\//i.test(url)) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      try {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        onReady(img.naturalWidth || img.width, img.naturalHeight || img.height);
      } catch (err) {
        console.warn('Erro ao transferir textura para WebGL:', err);
      }
    };
    img.onerror = (err) => {
      console.warn('Falha ao carregar textura:', url, err);
    };
    img.src = url.startsWith('data:') ? url : encodeURI(url);
  }

  loadTexture(texInside, config.insideImage, (w, h) => {
    insideSize = [w, h];
    insideReady = 1.0;
  });

  loadTexture(texOutside, config.outsideImage, (w, h) => {
    outsideSize = [w, h];
    outsideReady = 1.0;
  });

  // Estado do cursor e animação de tempos
  const animTime = {
    wobble: 0,
    wave: 0,
    grain: 0
  };

  const pointerPos = { x: 0.35, y: 0.0 }; // Inicia levemente no quadrante direito para visualização da lente
  const targetPointer = { x: 0.35, y: 0.0, inside: false };
  let isPointerActive = false;

  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

  function updatePointer(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : null);
    if (clientX === null || clientY === null) return;

    targetPointer.x = clamp(((clientX - rect.left) / rect.width) * 2.0 - 1.0, -1.0, 1.0);
    targetPointer.y = clamp(1.0 - ((clientY - rect.top) / rect.height) * 2.0, -1.0, 1.0);
    targetPointer.inside = true;
    isPointerActive = true;
  }

  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      updatePointer(e);
    } else {
      targetPointer.inside = false;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!e.touches || !e.touches[0]) return;
    const rect = container.getBoundingClientRect();
    const t = e.touches[0];
    if (t.clientX >= rect.left && t.clientX <= rect.right && t.clientY >= rect.top && t.clientY <= rect.bottom) {
      updatePointer(e);
    } else {
      targetPointer.inside = false;
    }
  }, { passive: true });

  // Redimensionamento
  let currentWidth = 0;
  let currentHeight = 0;

  function resize() {
    const rect = container.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    if (width <= 0 || height <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, config.dpr);
    const targetW = Math.round(width * dpr);
    const targetH = Math.round(height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      currentWidth = targetW;
      currentHeight = targetH;
      gl.viewport(0, 0, targetW, targetH);
    }
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  // Loop de Renderização
  let lastTime = performance.now();

  function render(now) {
    requestAnimationFrame(render);

    const delta = Math.min((now - lastTime) / 1000.0, 0.05);
    lastTime = now;

    // Atualiza acumuladores de tempo exatamente como no React Bits Pro
    animTime.wobble += delta * config.wobbleSpeed;
    animTime.wave += delta * config.waveSpeed;
    animTime.grain += delta * config.grainSpeed;

    // Movimento suave do ponteiro
    let tx = targetPointer.inside || !config.returnToCenter ? targetPointer.x : 0.28;
    let ty = targetPointer.inside || !config.returnToCenter ? targetPointer.y : 0.0;

    // Se o usuário ainda não tocou com o mouse, faz uma respiração sutil pelo lado direito
    if (!isPointerActive) {
      tx = 0.30 + Math.sin(now * 0.001) * 0.12;
      ty = Math.cos(now * 0.0008) * 0.10;
    }

    // Fórmula oficial do React Bits Pro: p = 1 - Math.exp(-r * (2 + (1 - clamp(follow, 0, 1)) * 40))
    if (config.follow === 0 && isPointerActive) {
      pointerPos.x = tx;
      pointerPos.y = ty;
    } else {
      const p = 1.0 - Math.exp(-delta * (2.0 + (1.0 - clamp(config.follow, 0.0, 1.0)) * 40.0));
      pointerPos.x += (tx - pointerPos.x) * p;
      pointerPos.y += (ty - pointerPos.y) * p;
    }

    gl.useProgram(prog);

    // Uniforms de texturas
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texInside);
    gl.uniform1i(uLoc.uInside, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texOutside);
    gl.uniform1i(uLoc.uOutside, 1);

    gl.uniform2f(uLoc.uInsideSize, insideSize[0], insideSize[1]);
    gl.uniform2f(uLoc.uOutsideSize, outsideSize[0], outsideSize[1]);
    gl.uniform1f(uLoc.uInsideReady, insideReady);
    gl.uniform1f(uLoc.uOutsideReady, outsideReady);
    gl.uniform3f(uLoc.uFallback, config.fallbackColor[0], config.fallbackColor[1], config.fallbackColor[2]);

    // Resolução e ponteiro
    gl.uniform2f(uLoc.uResolution, canvas.width, canvas.height);
    gl.uniform2f(uLoc.uPointer, pointerPos.x, pointerPos.y);

    // Parâmetros do componente React Bits Pro
    gl.uniform1i(uLoc.uShape, config.shapeIndex);
    gl.uniform1f(uLoc.uSize, clamp(config.size, 0.02, 2.0));
    gl.uniform1f(uLoc.uSoftness, Math.max(config.softness, 0.0));
    gl.uniform1f(uLoc.uDistortion, config.distortion);
    gl.uniform1f(uLoc.uAberration, config.aberration);
    gl.uniform1f(uLoc.uWobble, clamp(config.wobble, 0.0, 1.0));
    gl.uniform1f(uLoc.uWobbleTime, animTime.wobble);

    gl.uniform1f(uLoc.uWaveFrequency, config.waveFrequency);
    gl.uniform1f(uLoc.uWaveStrength, config.waveStrength);
    gl.uniform1f(uLoc.uWaveTime, animTime.wave);

    gl.uniform1f(uLoc.uGrain, config.grain);
    gl.uniform1f(uLoc.uGrainTime, animTime.grain);

    gl.uniform1f(uLoc.uGray, clamp(config.grayscale, 0.0, 1.0));
    gl.uniform1f(uLoc.uDim, clamp(config.dim, 0.0, 1.0));

    // Desenha
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  requestAnimationFrame(render);
})();
