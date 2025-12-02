import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem = ({ title, children, defaultOpen = false }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-background hover:bg-accent transition-colors"
      >
        <span className="text-sm font-medium text-foreground">{title}</span>
        <ChevronDown
          className={cn(
            'size-4 text-foreground/60 transition-transform',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-muted/30 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
};

interface AccordionProps {
  children: ReactNode;
  className?: string;
}

export const Accordion = ({ children, className }: AccordionProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  );
};

