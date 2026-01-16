
import React, { useRef, useEffect, useState } from 'react';
import { GlobalState } from '../types';

interface SimulationPanelProps {
    metrics: any; 
    simulationStateRef: React.MutableRefObject<GlobalState>;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ metrics, simulationStateRef }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let frameId: number;
        
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseenter', () => setIsHovering(true));
        canvas.addEventListener('mouseleave', () => setIsHovering(false));

        const render = () => {
            const state = simulationStateRef.current;
            if (!state || !state.parameters) {
                frameId = requestAnimationFrame(render);
                return;
            }

            const { width: w, height: h } = canvas;
            const cx = w / 2; const cy = h / 2;
            const zoom = 500 * Math.pow(0.7, state.parameters.scale - 6);

            // High-performance background clear
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = '#010108';
            ctx.fillRect(0, 0, w, h);
            
            // Sub-pixel scanline effect
            ctx.fillStyle = 'rgba(0, 255, 150, 0.015)';
            for(let i = 0; i < h; i += 3) { ctx.fillRect(0, i, w, 1); }

            // --- 0. DYNAMIC CURVATURE GRID ---
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 255, 200, 0.04)';
            ctx.lineWidth = 0.5;
            const gridSize = 24;
            for(let x = 0; x <= w; x += gridSize) {
                ctx.moveTo(x, 0);
                for(let y = 0; y <= h; y += 8) {
                    let dx = 0;
                    let dy = 0;
                    
                    // Mouse interaction disturbance
                    if (isHovering) {
                        const mDist2 = (x - mousePos.x)**2 + (y - mousePos.y)**2;
                        if (mDist2 < 10000) {
                            const force = (1 - Math.sqrt(mDist2)/100) * 15;
                            dx += (x - mousePos.x) * force * 0.1;
                            dy += (y - mousePos.y) * force * 0.1;
                        }
                    }

                    if (state.nodes) {
                        state.nodes.forEach((n: any) => {
                            if (n.isCollapsed) return;
                            const nx = cx + n.x * zoom; const ny = cy + n.y * zoom;
                            const d2 = (x - nx)**2 + (y - ny)**2;
                            if (d2 < 20000) {
                                const strength = ((n.zeta || 1) - 1) * 0.8 * state.parameters.centralMass;
                                const falloff = (1 - Math.sqrt(d2)/140);
                                dx += (nx - x) * strength * falloff;
                                dy += (ny - y) * strength * falloff;
                            }
                        });
                    }
                    ctx.lineTo(x + dx, y + dy);
                }
            }
            ctx.stroke();

            // --- 1. RELATIVISTIC ABC TRIADS ---
            ctx.globalCompositeOperation = 'screen';
            if (state.nodes) {
                state.nodes.forEach((n: any) => {
                    if (n.isCollapsed) return;
                    const nx = cx + n.x * zoom; const ny = cy + n.y * zoom;
                    
                    // Skip off-screen nodes to save GPU
                    if (nx < -50 || nx > w + 50 || ny < -50 || ny > h + 50) return;

                    const time = Date.now() * 0.002 * state.parameters.timeSpeed;
                    const zetaFactor = Math.pow(n.zeta || 1, 1.1);
                    const baseLen = 16 * (zoom / 500) * (n.superposition || 1) * zetaFactor;
                    const alpha = Math.max(0.15, 1.0 - state.parameters.scale / 12);

                    const drawRay = (v: {x:number, y:number, z:number}, hue: number, phaseOffset: number) => {
                        const osc = Math.sin(time + n.id + phaseOffset);
                        const length = baseLen * (0.9 + Math.abs(osc) * 0.3);
                        const vx = nx + (v?.x || 0) * length;
                        const vy = ny + (v?.y || 0) * length;

                        const gradient = ctx.createLinearGradient(nx, ny, vx, vy);
                        gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${alpha})`);
                        gradient.addColorStop(1, 'transparent');

                        ctx.beginPath();
                        ctx.moveTo(nx, ny);
                        ctx.lineTo(vx, vy);
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                        
                        // Particle emitters at tips
                        if (Math.random() > 0.95) {
                            ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${alpha * 0.5})`;
                            ctx.fillRect(vx - 1, vy - 1, 2, 2);
                        }
                    };

                    const vecA = n.vecA || {x: 1, y: 0, z: 0};
                    const vecB = n.vecB || {x: -0.5, y: 0.866, z: 0};
                    const vecC = n.vecC || {x: -0.5, y: -0.866, z: 0};

                    drawRay(vecA, 180, 0);          // Cyan
                    drawRay(vecB, 280, Math.PI * 0.66); // Purple
                    drawRay(vecC, 30, Math.PI * 1.33);  // Orange/Red

                    ctx.fillStyle = '#ffffff';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgba(255,255,255,0.5)';
                    ctx.beginPath(); 
                    ctx.arc(nx, ny, 1.5 * (zoom/500), 0, Math.PI * 2); 
                    ctx.fill();
                    ctx.shadowBlur = 0;
                });
            }

            // --- 2. QUARK FLAVOR FIELDS ---
            if (state.quarks) {
                state.quarks.forEach((q: any) => {
                    const qx = cx + (q.position?.x || q.x) * zoom; 
                    const qy = cy + (q.position?.y || q.y) * zoom;
                    
                    const grad = ctx.createRadialGradient(qx, qy, 0, qx, qy, 10 * (zoom/500));
                    grad.addColorStop(0, q.color);
                    grad.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = grad;
                    ctx.beginPath(); 
                    ctx.arc(qx, qy, 10 * (zoom/500), 0, Math.PI * 2); 
                    ctx.fill();
                });
            }

            frameId = requestAnimationFrame(render);
        };
        render();
        
        return () => {
            cancelAnimationFrame(frameId);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [simulationStateRef, isHovering, mousePos]);

    return (
        <div className="bg-[#010105] border border-cyan-500/20 rounded-3xl h-full relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] group">
            <div className="absolute top-6 left-8 z-20 transition-opacity duration-500 group-hover:opacity-100 opacity-60">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-ping absolute inset-0"></div>
                        <div className="w-3 h-3 bg-cyan-400 rounded-full relative shadow-[0_0_15px_#22d3ee]"></div>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-[11px] text-white font-black tracking-[0.4em] uppercase">ABC_FIELD RECONSTRUCTION</div>
                        <div className="text-[8px] text-cyan-700 font-mono font-bold tracking-widest uppercase">Relationality: {metrics?.activeConnections > 0 ? 'SYNCHRONIZED' : 'LOCAL_ONLY'}</div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-6 right-8 z-20 text-right pointer-events-none">
                <div className="text-[8px] text-slate-600 font-mono uppercase">Planck Scale: {simulationStateRef.current.parameters.scale}</div>
                <div className="text-[10px] text-cyan-500/30 font-black">R-QNT ENGINE v4.0</div>
            </div>

            <canvas ref={canvasRef} width={1200} height={800} className="w-full h-full cursor-crosshair" />
        </div>
    );
};

export default SimulationPanel;
