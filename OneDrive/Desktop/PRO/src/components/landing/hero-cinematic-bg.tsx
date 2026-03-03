'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/* ==========================================================================
   HeroCinematicBackground
   ---------------------------------------------------------------------------
   Renders five stacked visual effect layers behind the hero content.
   All layers use pointer-events: none and sit at z-index 0 so they never
   interfere with interactive elements above.

   Palette re-uses the existing warm editorial hex values:
     #B05A4F  (primary / founder accent)
     #2E4057  (investor accent)
     #8A6C8F  (talent accent)
     #C4935A  (chart-4 warm gold)

   Animation philosophy:
     • Slow, elegant transitions (8–20 s loops)
     • ease-in-out curves throughout
     • Very low opacity (5–12 %)
     • Heavy blur (blur-xl → blur-3xl)
     • Reduced-motion: all animation disabled
   ========================================================================== */

interface HeroCinematicBackgroundProps {
    /** Mouse position from parent container (normalized 0-1). */
    mouseX?: number;
    mouseY?: number;
}

export function HeroCinematicBackground({
    mouseX = 0.5,
    mouseY = 0.5,
}: HeroCinematicBackgroundProps) {
    const prefersReducedMotion = useReducedMotion();

    /* ------------------------------------------------------------------
       LAYER 1 — Gradient Mesh
       Two overlapping radial gradients that gently pulse in scale/opacity,
       creating a soft volumetric feel behind the hero text.
       ------------------------------------------------------------------ */
    const gradientMeshVariants = {
        animate: {
            scale: [1, 1.08, 1],
            opacity: [0.06, 0.09, 0.06],
            transition: {
                duration: 15,
                ease: 'easeInOut' as const,
                repeat: Infinity,
                repeatType: 'mirror' as const,
            },
        },
    };

    /* ------------------------------------------------------------------
       LAYER 2 — Volumetric Light Glow
       A large, soft radial orb that drifts slowly around the center
       of the hero area, simulating ambient volumetric lighting.
       ------------------------------------------------------------------ */
    const volumetricGlowVariants = {
        animate: {
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.12, 0.95, 1],
            opacity: [0.05, 0.08, 0.05, 0.05],
            transition: {
                duration: 20,
                ease: 'easeInOut' as const,
                repeat: Infinity,
            },
        },
    };

    /* ------------------------------------------------------------------
       LAYER 3 — Floating Blurred Geometric Shapes
       Soft blobs that drift independently, each with unique timing.
       Very low opacity so they read as atmospheric depth, not decoration.
       ------------------------------------------------------------------ */
    const floatingShapes = [
        {
            // Warm terracotta circle — upper left
            className: 'absolute rounded-full blur-3xl',
            style: {
                width: '320px',
                height: '320px',
                top: '8%',
                left: '10%',
                background: 'radial-gradient(circle, rgba(176,90,79,0.10) 0%, transparent 70%)',
            },
            animate: {
                x: [0, 40, -20, 0],
                y: [0, -30, 20, 0],
                rotate: [0, 15, -10, 0],
                scale: [1, 1.1, 0.95, 1],
            },
            transition: { duration: 16, ease: 'easeInOut' as const, repeat: Infinity },
        },
        {
            // Deep navy blob — right side
            className: 'absolute rounded-full blur-3xl',
            style: {
                width: '280px',
                height: '280px',
                top: '50%',
                right: '5%',
                background: 'radial-gradient(circle, rgba(46,64,87,0.08) 0%, transparent 70%)',
            },
            animate: {
                x: [0, -35, 25, 0],
                y: [0, 20, -35, 0],
                rotate: [0, -12, 8, 0],
                scale: [1, 0.92, 1.08, 1],
            },
            transition: { duration: 18, ease: 'easeInOut' as const, repeat: Infinity },
        },
        {
            // Lavender rounded rect — lower left
            className: 'absolute rounded-3xl blur-2xl',
            style: {
                width: '200px',
                height: '160px',
                bottom: '15%',
                left: '20%',
                background: 'radial-gradient(circle, rgba(138,108,143,0.07) 0%, transparent 70%)',
            },
            animate: {
                x: [0, 25, -15, 0],
                y: [0, -20, 30, 0],
                rotate: [0, 8, -5, 0],
                scale: [1, 1.06, 0.97, 1],
            },
            transition: { duration: 14, ease: 'easeInOut' as const, repeat: Infinity },
        },
        {
            // Warm gold accent — center-right
            className: 'absolute rounded-full blur-3xl',
            style: {
                width: '240px',
                height: '240px',
                top: '25%',
                right: '25%',
                background: 'radial-gradient(circle, rgba(196,147,90,0.06) 0%, transparent 70%)',
            },
            animate: {
                x: [0, -20, 30, 0],
                y: [0, 25, -15, 0],
                rotate: [0, -6, 10, 0],
                scale: [1, 1.05, 0.98, 1],
            },
            transition: { duration: 12, ease: 'easeInOut' as const, repeat: Infinity },
        },
    ];

    /* ------------------------------------------------------------------
       LAYER 4 — Parallax Depth
       Layers respond to mouse movement at different rates to create
       a subtle 3D depth illusion. Only active on desktop viewports.
       Springs provide physically-based easing for smooth tracking.
       ------------------------------------------------------------------ */
    const parallaxX = useMotionValue(0);
    const parallaxY = useMotionValue(0);
    const smoothX = useSpring(parallaxX, { damping: 40, stiffness: 90 });
    const smoothY = useSpring(parallaxY, { damping: 40, stiffness: 90 });

    // Deeper parallax for shapes further "back"
    const deepParallaxX = useMotionValue(0);
    const deepParallaxY = useMotionValue(0);
    const smoothDeepX = useSpring(deepParallaxX, { damping: 50, stiffness: 70 });
    const smoothDeepY = useSpring(deepParallaxY, { damping: 50, stiffness: 70 });

    useEffect(() => {
        if (prefersReducedMotion) return;
        // Convert normalized 0-1 mouse to pixel offsets (shallow: ±15px, deep: ±25px)
        const offsetX = (mouseX - 0.5) * 30;
        const offsetY = (mouseY - 0.5) * 30;
        parallaxX.set(offsetX * 0.5);
        parallaxY.set(offsetY * 0.5);
        deepParallaxX.set(offsetX);
        deepParallaxY.set(offsetY);
    }, [mouseX, mouseY, prefersReducedMotion, parallaxX, parallaxY, deepParallaxX, deepParallaxY]);

    /* ------------------------------------------------------------------
       LAYER 5 — Ambient Light Shimmer
       A slow-moving radial light sweep that drifts across the section,
       simulating soft ambient illumination changes.
       ------------------------------------------------------------------ */
    const shimmerVariants = {
        animate: {
            x: ['-10%', '10%', '-5%', '-10%'],
            y: ['-5%', '8%', '-8%', '-5%'],
            opacity: [0.04, 0.07, 0.04, 0.04],
            transition: {
                duration: 18,
                ease: 'easeInOut' as const,
                repeat: Infinity,
            },
        },
    };

    return (
        <div
            className="absolute inset-0 overflow-hidden"
            style={{ zIndex: 0 }}
            aria-hidden="true"
        >
            {/* ——— LAYER 1: Gradient Mesh ——— */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ willChange: 'transform, opacity', x: smoothX, y: smoothY }}
                variants={gradientMeshVariants}
                animate={prefersReducedMotion ? undefined : 'animate'}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
              radial-gradient(ellipse 60% 50% at 25% 30%, rgba(176,90,79,0.07), transparent 60%),
              radial-gradient(ellipse 50% 60% at 75% 65%, rgba(46,64,87,0.06), transparent 60%)
            `,
                    }}
                />
            </motion.div>

            {/* ——— LAYER 2: Volumetric Light Glow ——— */}
            <motion.div
                className="absolute pointer-events-none blur-3xl"
                style={{
                    width: '500px',
                    height: '500px',
                    top: '10%',
                    left: '50%',
                    marginLeft: '-250px',
                    background: 'radial-gradient(circle, rgba(176,90,79,0.06) 0%, rgba(46,64,87,0.03) 40%, transparent 70%)',
                    willChange: 'transform, opacity',
                    x: smoothDeepX,
                    y: smoothDeepY,
                }}
                variants={volumetricGlowVariants}
                animate={prefersReducedMotion ? undefined : 'animate'}
            />

            {/* ——— LAYER 3: Floating Blurred Shapes ——— */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ willChange: 'transform', x: smoothDeepX, y: smoothDeepY }}
            >
                {floatingShapes.map((shape, i) => (
                    <motion.div
                        key={i}
                        className={shape.className}
                        style={{ ...shape.style, willChange: 'transform' }}
                        animate={prefersReducedMotion ? undefined : shape.animate}
                        transition={shape.transition}
                    />
                ))}
            </motion.div>

            {/* ——— LAYER 5: Ambient Light Shimmer ——— */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    width: '120%',
                    height: '120%',
                    top: '-10%',
                    left: '-10%',
                    background: 'radial-gradient(ellipse 40% 35% at 50% 50%, rgba(196,147,90,0.05), transparent 70%)',
                    willChange: 'transform, opacity',
                }}
                variants={shimmerVariants}
                animate={prefersReducedMotion ? undefined : 'animate'}
            />
        </div>
    );
}
