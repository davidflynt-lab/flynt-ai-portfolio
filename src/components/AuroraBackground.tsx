import { motion } from "framer-motion";

const AuroraBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* 4-Point Star gradient - the "Soul" */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                    opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                {/* Horizontal beam */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[200px]"
                    style={{
                        background: `linear-gradient(90deg, 
              transparent 0%, 
              hsl(187 94% 43% / 0.4) 20%, 
              hsl(263 70% 50% / 0.5) 50%, 
              hsl(217 91% 60% / 0.4) 80%, 
              transparent 100%
            )`,
                        filter: "blur(80px)",
                    }}
                />

                {/* Vertical beam */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[700px]"
                    style={{
                        background: `linear-gradient(180deg, 
              transparent 0%, 
              hsl(217 91% 60% / 0.4) 20%, 
              hsl(263 70% 50% / 0.5) 50%, 
              hsl(187 94% 43% / 0.4) 80%, 
              transparent 100%
            )`,
                        filter: "blur(80px)",
                    }}
                />

                {/* Center glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, 
              hsl(263 70% 50% / 0.3) 0%, 
              hsl(187 94% 43% / 0.15) 40%, 
              transparent 70%
            )`,
                        filter: "blur(60px)",
                    }}
                />
            </motion.div>

            {/* Subtle ambient glow - top */}
            <motion.div
                className="absolute -top-20 left-1/4 w-[500px] h-[300px]"
                style={{
                    background: `radial-gradient(ellipse, hsl(217 91% 60% / 0.1) 0%, transparent 70%)`,
                    filter: "blur(40px)",
                }}
                animate={{
                    x: [0, 30, -20, 0],
                    opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Subtle ambient glow - bottom right */}
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px]"
                style={{
                    background: `radial-gradient(ellipse, hsl(187 94% 43% / 0.08) 0%, transparent 70%)`,
                    filter: "blur(50px)",
                }}
                animate={{
                    y: [0, -20, 10, 0],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
};

export default AuroraBackground;
