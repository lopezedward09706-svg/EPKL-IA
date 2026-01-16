
import React, { useRef, useEffect } from 'react';
import { SimulationParameters } from '../types';

interface QuantumFoamSimulationProps {
    params: SimulationParameters;
    onBack: () => void;
}

const QuantumFoamSimulation: React.FC<QuantumFoamSimulationProps> = ({ params, onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let frameId: number;
        const bubbles: {
            x: number, 
            y: number, 
            r: number, 
            life: number, 
            v: number, 
            hue: number,
            chaos: number
        }[] = [];
        
        const createBubble = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 1,
            life: 1.0,
            v: (Math.random() * 0.4 + 0.1) * params.evolutionRate * 10,
            hue: Math.random() > 0.8 ? 180 : 210, 
            chaos: Math.random() * Math.PI * 2
        });

        for(let i = 0; i < 300; i++) bubbles.push(createBubble());

        const render = () => {
            const w = canvas.width;
            const h = canvas.height;
            const time = Date.now() * 0.001 * params.timeSpeed;

            ctx.fillStyle = '#02040a';
            ctx.fillRect(0, 0, w, h);

            // GRID DE CURVATURA FONDO
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 211, 238, 0.03)`;
            const gridSpacing = 50;
            for(let x = 0; x <= w; x += gridSpacing) {
                ctx.moveTo(x, 0);
                for(let y = 0; y <= h; y += 10) {
                    const d = Math.sin(x * 0.01 + y * 0.01 + time) * 15;
                    ctx.lineTo(x + d, y);
                }
            }
            ctx.stroke();

            // BURBUJAS DE WHEELER (Estructura ABC)
            bubbles.forEach((b, i) => {
                b.life -= 0.002 * params.timeSpeed;
                b.r += b.v * 0.5;
                b.x += Math.cos(b.chaos + time) * 0.3;
                b.y += Math.sin(b.chaos + time) * 0.3;

                if(b.life <= 0) bubbles[i] = createBubble();

                const alpha = Math.sin(b.life * Math.PI);
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r * (params.scale / 4), 0, Math.PI * 2);
                ctx.strokeStyle = `hsla(${b.hue}, 100%, 70%, ${alpha * 0.3})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            frameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        render();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [params]);

    return (
        <div className="absolute inset-0 bg-[#02040a] overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />
            
            {/* UI Overlay de la Simulación a pantalla completa */}
            <div className="absolute bottom-12 left-12 p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] z-50 pointer-events-none animate-in slide-in-from-left-10 duration-700">
                <div className="flex items-center gap-6">
                    <div className="w-1.5 h-12 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_20px_#06b6d4]"></div>
                    <div>
                        <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mb-1">Entorno Wheeler Realtime</h4>
                        <div className="text-2xl font-black text-white uppercase tracking-tighter">Planck Scale v2.0</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-6 border-t border-white/5 pt-6">
                    <div>
                        <span className="text-[8px] font-black text-slate-500 uppercase block mb-1 tracking-widest">Escala ζ</span>
                        <span className="text-xs font-mono text-cyan-400">0.0004278 λ</span>
                    </div>
                    <div>
                        <span className="text-[8px] font-black text-slate-500 uppercase block mb-1 tracking-widest">Coherencia ABC</span>
                        <span className="text-xs font-mono text-emerald-400">99.8% nominal</span>
                    </div>
                </div>
            </div>

            {/* Control de Regreso */}
            <button 
                onClick={onBack}
                className="absolute top-12 left-12 z-50 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-300 transition-all flex items-center gap-3"
            >
                <i className="fas fa-arrow-left"></i>
                Volver al Panel
            </button>
        </div>
    );
};

export default QuantumFoamSimulation;
