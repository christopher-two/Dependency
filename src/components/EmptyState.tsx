import { Box } from 'lucide-react';

export const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-secondary opacity-50">
        <Box size={64} strokeWidth={1} />
        <p className="mt-4 font-mono text-sm">No artifacts selected</p>
    </div>
);
