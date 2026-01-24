import React from "react";
import { CustomDropdown } from "./CustomDropdown";

interface AnimationSectionProps {
    animationType: string;
    onAnimationTypeChange: (type: string) => void;
    animationSpeed: number;
    onAnimationSpeedChange: (speed: number) => void;
}

export function AnimationSection({
    animationType,
    onAnimationTypeChange,
    animationSpeed,
    onAnimationSpeedChange,
}: AnimationSectionProps) {
    return (
        <div className="responsive-row items-end" style={{ gap: '24px' }}>
            {/* Animation Type */}
            <div className="flex flex-col gap-2">
                <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                    Animation Type
                </span>
                <CustomDropdown
                    value={animationType}
                    onChange={(val) => onAnimationTypeChange(val as string)}
                    options={[
                        { label: 'TYPEWRITER', value: 'typewriter' },
                        { label: 'FADE IN', value: 'fade-in' },
                        { label: 'WORD BY WORD', value: 'word-by-word' },
                        { label: 'CHARACTER', value: 'character-by-character' },
                    ]}
                    style={{ width: '150px' }}
                />
            </div>

            {/* Animation Speed */}
            <div className="flex-1 flex flex-col justify-between">
                <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                    Animation Speed
                </span>
                <div className="flex flex-col">
                    <div className="flex justify-between font-mono" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                        <span>Slower</span>
                        <span>Faster</span>
                    </div>
                    <style>{`
                        .no-thumb::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 0;
                            height: 0;
                            background: transparent;
                            border: none;
                        }
                        .no-thumb::-moz-range-thumb {
                            width: 0;
                            height: 0;
                            background: transparent;
                            border: none;
                        }
                        .no-thumb::-ms-thumb {
                            width: 0;
                            height: 0;
                            background: transparent;
                            border: none;
                        }
                    `}</style>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={animationSpeed}
                        onChange={(e) => onAnimationSpeedChange(Number(e.target.value))}
                        className="no-thumb w-full appearance-none cursor-pointer focus:outline-none"
                        style={{
                            height: '10px',
                            marginTop: '4px',
                            marginBottom: '0',
                            background: `linear-gradient(to right, #6A00FF ${((animationSpeed - 1) / 9) * 100}%, #f3f4f6 ${((animationSpeed - 1) / 9) * 100}%)`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
