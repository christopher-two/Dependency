import { Github } from 'lucide-react';

export const TopBar = () => (
    <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-background/95 backdrop-blur z-20 sticky top-0">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <a href="https://www.christopher.com.mx" target="_blank" rel="noopener noreferrer">
                    <img src="/logo_christopher_two.svg" alt="Logo ChristopherTwo" className="w-8 h-8" />
                </a>
            </div>
            <h1 className="font-semibold text-sm tracking-wide">ChristopherTwo <span className="text-secondary font-normal">| Dependency</span></h1>
        </div>

        <div className="flex items-center gap-4">
            <a
                href="https://github.com/christopher-two"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-white transition-colors flex items-center gap-2 text-xs font-medium"
            >
                <Github size={16} />
                GitHub
            </a>
        </div>
    </div>
);
