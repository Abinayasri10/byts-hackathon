import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

const ANIMALS = [
    { emoji: "🦊", bg: "bg-orange-500/20", name: "Fox" },
    { emoji: "🐼", bg: "bg-slate-500/20", name: "Panda" },
    { emoji: "🦁", bg: "bg-amber-500/20", name: "Lion" },
    { emoji: "🐨", bg: "bg-gray-500/20", name: "Koala" },
    { emoji: "🦉", bg: "bg-amber-700/20", name: "Owl" },
    { emoji: "🐸", bg: "bg-green-500/20", name: "Frog" },
    { emoji: "🦋", bg: "bg-purple-500/20", name: "Butterfly" },
    { emoji: "🐙", bg: "bg-pink-500/20", name: "Octopus" },
    { emoji: "🦜", bg: "bg-red-500/20", name: "Parrot" },
    { emoji: "🐢", bg: "bg-teal-500/20", name: "Turtle" },
    { emoji: "🦈", bg: "bg-blue-500/20", name: "Shark" },
    { emoji: "🐝", bg: "bg-yellow-500/20", name: "Bee" },
];

export const AnimalAvatar = ({ seed, size = "md", className }) => {
    const [animal, setAnimal] = useState(ANIMALS[0]);

    useEffect(() => {
        if (seed === "ai-assistant") {
            setAnimal({ emoji: "🤖", bg: "bg-purple-600/30", name: "AI Assistant" });
        } else if (seed) {
            const index = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % ANIMALS.length;
            setAnimal(ANIMALS[index]);
        }
    }, [seed]);

    const sizeClasses = {
        sm: "w-8 h-8 text-base",
        md: "w-10 h-10 text-lg",
        lg: "w-12 h-12 text-xl",
    };

    const getDisplay = (emoji) => {
        return emoji;
    }

    return (
        <div
            className={cn(
                "rounded-full flex items-center justify-center flex-shrink-0",
                animal?.bg || "bg-slate-500/20",
                sizeClasses[size],
                className
            )}
            title={`Anonymous ${animal?.name || "User"}`}
        >
            {getDisplay(animal?.emoji)}
        </div>
    );
};

export const getAnimalName = (seed) => {
    if (!seed) return "Unknown";
    const index = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % ANIMALS.length;
    return ANIMALS[index].name;
};
