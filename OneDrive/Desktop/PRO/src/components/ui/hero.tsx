"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export const PremiumHero = ({ onRegister, onDemo }: { onRegister: () => void, onDemo: () => void }) => {
  const [titleNumber, setTitleNumber] = useState(0);
  const aiTitles = ["founders", "investors", "talents", "startups"];

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleNumber((prev) => (prev + 1) % aiTitles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="relative z-20 flex h-screen w-full items-center justify-center px-6 text-center">
        <div className="container mx-auto flex flex-col items-center gap-12 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium" style={{ background: 'rgba(46,139,87,0.08)', border: '1px solid rgba(46,139,87,0.15)', color: '#2E8B57' }}>
            AI-Powered Startup Collaboration Platform
          </div>

          <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter font-bold">
            <span className="text-foreground">Build Your Startup with</span>
            <span className="relative flex w-full justify-center overflow-hidden md:pb-4 md:pt-1">
              &nbsp;
              {aiTitles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-bold text-primary"
                  style={{ backgroundImage: 'linear-gradient(135deg, #2E8B57 0%, #0047AB 60%, #7C3AED 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  initial={{ opacity: 0, y: "-100" }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                  }
                >
                  Verified {title.charAt(0).toUpperCase() + title.slice(1)}
                </motion.span>
              ))}
            </span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl mx-auto text-center mt-4">
            The all-in-one platform connecting founders, talents, and investors.
            Verified collaborations, automated agreements, milestone-based payments,
            and trust scoring.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button size="lg" className="w-56 p-6 text-lg rounded-xl text-white shadow-[0_4px_14px_rgba(46,139,87,0.3)] transition-transform hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #2E8B57 0%, #0047AB 100%)' }} onClick={onRegister}>
              Start Building Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl border-2" onClick={onDemo}>
              Watch Demo <MoveRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
