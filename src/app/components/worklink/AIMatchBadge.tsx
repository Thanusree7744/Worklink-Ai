import { Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';

interface AIMatchBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AIMatchBadge({ score, size = 'md' }: AIMatchBadgeProps) {
  const getColor = () => {
    if (score >= 90) return 'bg-accent text-accent-foreground';
    if (score >= 80) return 'bg-secondary text-secondary-foreground';
    return 'bg-primary text-primary-foreground';
  };

  const getSize = () => {
    if (size === 'sm') return 'text-xs px-2 py-0.5';
    if (size === 'lg') return 'text-base px-4 py-2';
    return 'text-sm px-3 py-1';
  };

  return (
    <Badge className={`${getColor()} ${getSize()} flex items-center gap-1 font-medium`}>
      <Sparkles className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      {score}% Match
    </Badge>
  );
}
