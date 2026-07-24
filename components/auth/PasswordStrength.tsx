"use client";

interface PasswordStrengthProps {
    strength: number;
}

export default function PasswordStrength({ strength }: PasswordStrengthProps) {
    const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = ["", "#D61F1F", "#e08600", "#0B8A4A", "#0B1E8A"];

    return (
        <div className="mt-2">
            <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                            background: i <= strength ? strengthColors[strength] : "#E2EAF4",
                        }}
                    />
                ))}
            </div>
            <p className="text-xs font-semibold" style={{ color: strengthColors[strength] }}>
                {strengthLabels[strength]}
            </p>
        </div>
    );
}