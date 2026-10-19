"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";

type FieldControls = { setMotion: (enabled: boolean) => void; destroy: () => void };

// Gradient noise is evaluated on the GPU. Particle positions remain in a single
// immutable buffer rather than generating thousands of React nodes each frame.
const NOISE = `
vec2 gradient(vec2 p) {
    vec2 h = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(h) * 43758.5453123);
}
float perlin(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return mix(mix(dot(gradient(i), f), dot(gradient(i + vec2(1.,0.)), f - vec2(1.,0.)), u.x),
               mix(dot(gradient(i + vec2(0.,1.)), f - vec2(0.,1.)), dot(gradient(i + vec2(1.,1.)), f - vec2(1.,1.)), u.x), u.y);
}
vec4 fields(vec2 uv, float t) {
    float n = perlin(uv * 2.6 + vec2(t * .024, -t * .017));
    float x = uv.x + n * .05;
    float blue = .30 + .14 * sin(x * 5.0 + t * .12);
    float mint = .38 + .16 * sin(x * 4.3 - t * .10 + 1.2);
    float green = .24 + .12 * sin(x * 5.3 + t * .09 + 2.8);
    float orange = .22 + .15 * sin(x * 3.8 - t * .11 + 4.2);
    vec4 d = uv.y - vec4(blue, mint, green, orange);
    vec4 ribbons = exp(-d * d * vec4(26., 29., 36., 32.));
    return ribbons * vec4(.8 + .2 * cos(x * 4.), .65, .45 + .45 * x, .7 * (1. - x));
}
float waveMask(vec2 uv, float t) {
    float edge = .10 + .055 * sin(uv.x * 5.5 + t * .09)
                      + .025 * sin(uv.x * 11. - t * .12);
    return smoothstep(edge, edge + .075, uv.y) * (1. - smoothstep(.55, 1., uv.y));
}
vec3 signalColor(vec4 w) {
    return (w.x * vec3(0., .333333, 1.) + w.y * vec3(0., .898039, .6)
          + w.z * vec3(0., .784314, .019608) + w.w * vec3(1., .333333, 0.))
          / max(dot(w, vec4(1.)), .001);
}
`;

const FIELD_VERTEX = `
attribute vec2 a_position;
varying mediump vec2 v_uv;
void main() { v_uv = a_position * .5 + .5; gl_Position = vec4(a_position, 0., 1.); }
`;
const FIELD_FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying mediump vec2 v_uv;
uniform float u_time;
${NOISE}
void main() {
    vec4 w = fields(v_uv, u_time);
    float density = clamp(dot(w, vec4(.90)), 0., 1.);
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
    float alpha = density * waveMask(v_uv, u_time) * (.19 + grain * .22);
    gl_FragColor = vec4(signalColor(w), alpha);
}
`;
const POINT_VERTEX = `
precision highp float;
attribute vec4 a_particle;
uniform float u_time;
uniform float u_ratio;
uniform float u_aspect;
uniform vec3 u_pointer;
varying mediump vec3 v_color;
varying mediump float v_alpha;
${NOISE}
void main() {
    float seed = a_particle.z;
    vec2 p = a_particle.xy;
    // Continuous gradient noise gives the points soft, Brownian-like drift.
    p += vec2(perlin(p * 6. + vec2(seed * 31., u_time * .07)),
              perlin(p * 5. + vec2(u_time * .06, seed * 23.))) * .014;
    vec2 delta = (p - u_pointer.xy) * vec2(u_aspect, 1.);
    float distance = length(delta);
    float influence = exp(-distance * distance * 34.) * u_pointer.z;
    vec2 tangent = vec2(-delta.y, delta.x);
    p += (delta * .045 + tangent * .08) / vec2(u_aspect, 1.) * influence;
    vec4 w = fields(p, u_time);
    float density = clamp(dot(w, vec4(.8)), .06, 1.);
    v_color = signalColor(w);
    float shimmer = .78 + .22 * sin(u_time * (.55 + seed * .7) + seed * 93.);
    v_alpha = (.16 + .28 * density) * shimmer * waveMask(p, u_time);
    gl_PointSize = a_particle.w * u_ratio;
    gl_Position = vec4(p * 2. - 1., 0., 1.);
}
`;
const POINT_FRAGMENT = `
precision mediump float;
varying mediump vec3 v_color;
varying mediump float v_alpha;
void main() {
    float radius = length(gl_PointCoord - .5);
    float edge = 1. - smoothstep(.30, .5, radius);
    gl_FragColor = vec4(v_color, v_alpha * edge);
}
`;

function createField(canvas: HTMLCanvasElement, stage: HTMLElement, initialMotion: boolean): FieldControls | undefined {
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, powerPreference: "low-power" });
    if (!gl) return;

    const makeProgram = (vertex: string, fragment: string) => {
        const shaders: WebGLShader[] = [];
        const program = gl.createProgram();
        if (!program) return null;
        for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
            const shader = gl.createShader(type);
            if (!shader) { gl.deleteProgram(program); return null; }
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                gl.deleteShader(shader);
                shaders.forEach((item) => gl.deleteShader(item));
                gl.deleteProgram(program);
                return null;
            }
            shaders.push(shader);
            gl.attachShader(program, shader);
        }
        gl.linkProgram(program);
        shaders.forEach((item) => gl.deleteShader(item));
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return null; }
        return program;
    };

    const fieldProgram = makeProgram(FIELD_VERTEX, FIELD_FRAGMENT);
    const pointProgram = makeProgram(POINT_VERTEX, POINT_FRAGMENT);
    if (!fieldProgram || !pointProgram) {
        if (fieldProgram) gl.deleteProgram(fieldProgram);
        if (pointProgram) gl.deleteProgram(pointProgram);
        return;
    }
    const quad = gl.createBuffer();
    const points = gl.createBuffer();
    const fieldPosition = gl.getAttribLocation(fieldProgram, "a_position");
    const pointPosition = gl.getAttribLocation(pointProgram, "a_particle");
    const fieldTime = gl.getUniformLocation(fieldProgram, "u_time");
    const pointTime = gl.getUniformLocation(pointProgram, "u_time");
    const pointRatio = gl.getUniformLocation(pointProgram, "u_ratio");
    const pointAspect = gl.getUniformLocation(pointProgram, "u_aspect");
    const pointPointer = gl.getUniformLocation(pointProgram, "u_pointer");
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

    let width = 1, height = 1, ratio = 1, count = 0;
    let elapsed = 17, lastDraw = 0, frame = 0;
    let motionEnabled = initialMotion, inView = true, contextLost = false, destroyed = false;
    let pointerX = .75, pointerY = .5, velocityX = 0, velocityY = 0, pointerStrength = 0;
    let targetX = .75, targetY = .5, pointerInside = false;

    const fillPoints = (nextCount: number) => {
        count = nextCount;
        const particles = new Float32Array(count * 4);
        let seed = 3187;
        const random = () => { seed = (Math.imul(1664525, seed) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
        for (let i = 0; i < count; i++) {
            particles[i * 4] = random();
            particles[i * 4 + 1] = random();
            particles[i * 4 + 2] = random();
            particles[i * 4 + 3] = 1 + random() * .5;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, points);
        gl.bufferData(gl.ARRAY_BUFFER, particles, gl.STATIC_DRAW);
        canvas.dataset.particles = String(count);
    };
    const paint = () => {
        if (contextLost || destroyed) return;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.BLEND);
        gl.useProgram(fieldProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.enableVertexAttribArray(fieldPosition);
        gl.vertexAttribPointer(fieldPosition, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(fieldTime, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.disableVertexAttribArray(fieldPosition);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(pointProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, points);
        gl.enableVertexAttribArray(pointPosition);
        gl.vertexAttribPointer(pointPosition, 4, gl.FLOAT, false, 0, 0);
        gl.uniform1f(pointTime, elapsed);
        gl.uniform1f(pointRatio, ratio);
        gl.uniform1f(pointAspect, width / height);
        gl.uniform3f(pointPointer, pointerX, pointerY, pointerStrength);
        gl.drawArrays(gl.POINTS, 0, count);
        gl.disableVertexAttribArray(pointPosition);
    };
    const running = () => motionEnabled && inView && !document.hidden && !contextLost && !destroyed;
    const tick = (now: number) => {
        frame = 0;
        if (!running()) return;
        const dt = lastDraw ? Math.min((now - lastDraw) / 1000, .05) : 1 / 60;
        elapsed += dt;
        velocityX += ((targetX - pointerX) * 28 - velocityX * 11) * dt;
        velocityY += ((targetY - pointerY) * 28 - velocityY * 11) * dt;
        pointerX += velocityX * dt;
        pointerY += velocityY * dt;
        pointerStrength += ((pointerInside ? 1 : 0) - pointerStrength) * Math.min(dt * 3, 1);
        paint();
        lastDraw = now;
        frame = requestAnimationFrame(tick);
    };
    const reconcile = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        lastDraw = 0;
        canvas.dataset.motion = running() ? "running" : "paused";
        if (running()) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
        const box = stage.getBoundingClientRect();
        width = Math.max(box.width, 1); height = Math.max(box.height, 1);
        ratio = Math.min(window.devicePixelRatio || 1, width < 640 ? 1.25 : 1.5, Math.sqrt(1_100_000 / (width * height)));
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        const nextCount = width < 640 ? 15_000 : 22_000;
        if (nextCount !== count) fillPoints(nextCount);
        paint();
    };
    const move = (event: PointerEvent) => {
        if (!motionEnabled) return;
        const box = stage.getBoundingClientRect();
        targetX = (event.clientX - box.left) / width;
        targetY = 1 - (event.clientY - box.top) / height;
        pointerInside = true;
    };
    const leave = () => { pointerInside = false; };
    const lost = (event: Event) => {
        event.preventDefault(); contextLost = true; reconcile();
        canvas.style.opacity = "0";
        stage.dataset.renderer = "fallback";
    };
    // Retain the CSS field if the GPU context is lost. Navigation/remount can
    // initialize a fresh context; no blank black canvas is left behind.
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; reconcile(); });
    observer.observe(stage);
    intersection.observe(stage);
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerdown", move, { passive: true });
    stage.addEventListener("pointerleave", leave);
    stage.addEventListener("pointerup", leave);
    document.addEventListener("visibilitychange", reconcile);
    canvas.addEventListener("webglcontextlost", lost);
    stage.dataset.renderer = "webgl";
    canvas.style.opacity = "1";
    resize();
    reconcile();

    return {
        setMotion(enabled) { motionEnabled = enabled; reconcile(); },
        destroy() {
            destroyed = true;
            cancelAnimationFrame(frame);
            observer.disconnect(); intersection.disconnect();
            stage.removeEventListener("pointermove", move);
            stage.removeEventListener("pointerdown", move);
            stage.removeEventListener("pointerleave", leave);
            stage.removeEventListener("pointerup", leave);
            document.removeEventListener("visibilitychange", reconcile);
            canvas.removeEventListener("webglcontextlost", lost);
            gl.deleteBuffer(quad); gl.deleteBuffer(points);
            gl.deleteProgram(fieldProgram); gl.deleteProgram(pointProgram);
        },
    };
}

export default function StippledHero({ sectionRef, suspended, showBanner }: { sectionRef: RefObject<HTMLElement | null>; suspended: boolean; showBanner: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fieldRef = useRef<FieldControls | undefined>(undefined);
    const motionRef = useRef(false);
    const [paused, setPaused] = useState(false);
    const reducedMotion = useReducedMotion();
    const canAnimate = !paused && reducedMotion === false && !suspended;

    useEffect(() => {
        motionRef.current = canAnimate;
        fieldRef.current?.setMotion(canAnimate);
    }, [canAnimate]);

    useEffect(() => {
        const canvas = canvasRef.current, stage = sectionRef.current;
        if (!canvas || !stage || !showBanner) return;
        const field = createField(canvas, stage, motionRef.current);
        fieldRef.current = field;
        return () => { field?.destroy(); fieldRef.current = undefined; };
    }, [sectionRef, showBanner]);

    return (
        <section ref={sectionRef} className="group relative isolate overflow-hidden" data-renderer="fallback" aria-labelledby="hero-title">
            {showBanner && <>
                <div className="wave-fallback pointer-events-none absolute inset-0" aria-hidden="true" />
                <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-0" aria-hidden="true" />
            </>}
            <div className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-32 sm:pb-36 sm:pt-36 lg:pb-40 lg:pt-40">
                <h1 id="hero-title" className="text-[64px] font-semibold leading-[.98] tracking-[-0.055em] sm:text-[96px] lg:text-[120px]">David Flynt</h1>
                <h2 className="mt-6 max-w-4xl text-[27px] font-medium leading-tight tracking-[-0.035em] sm:text-[36px] lg:text-[42px]">Product Designer &amp; Design Engineer</h2>
                <p className="mt-3 max-w-[750px] text-[25px] leading-[1.25] tracking-[-0.025em] text-foreground sm:text-[32px] lg:text-[38px]">turning complex AI &amp; data systems into interfaces people trust.</p>
                <p className="mt-7 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-[17px]">
                    8+ years shipping 0→1 products and enterprise platforms at <strong className="font-semibold text-foreground">PaperTrail</strong> (Georgia Tech CREATE-X), <strong className="font-semibold text-foreground">Stellar Cyber</strong>, <strong className="font-semibold text-foreground">Amazon</strong>, and <strong className="font-semibold text-foreground">Cisco</strong>.
                </p>
            </div>
            {showBanner && <div className="absolute inset-x-0 bottom-8 z-10">
                <div className="mx-auto flex max-w-7xl justify-end px-6">
                    <button type="button" onClick={() => setPaused(!paused)} disabled={reducedMotion === true}
                        aria-pressed={paused} aria-label={paused ? "Resume ambient animation" : "Pause ambient animation"}
                        className="hidden min-h-11 items-center rounded-full px-3 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-default group-data-[renderer=webgl]:inline-flex">
                        {reducedMotion ? "Motion reduced" : paused ? "Resume motion" : "Pause motion"}
                    </button>
                </div>
            </div>}
        </section>
    );
}
