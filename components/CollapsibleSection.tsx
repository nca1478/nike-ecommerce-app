'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function CollapsibleSection({
    title,
    children,
    defaultOpen = false,
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-light-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left hover:bg-light-200 transition-colors focus:outline-none cursor-pointer"
                aria-expanded={isOpen}
            >
                <span className="text-body-medium text-dark-900">{title}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-dark-900" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-dark-900" />
                )}
            </button>
            {isOpen && (
                <div className="pb-4 text-body text-dark-700">{children}</div>
            )}
        </div>
    );
}
