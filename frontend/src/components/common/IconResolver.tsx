import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Layers,
  Workflow,
  Cpu,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  Users,
  Lock,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  LucideProps,
} from 'lucide-react';

interface IconResolverProps extends LucideProps {
  name: string;
}

const iconMap: Record<string, React.FC<LucideProps>> = {
  TrendingUp,
  ShieldCheck,
  Layers,
  Workflow,
  Cpu,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  Users,
  Lock,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
};

export const IconResolver: React.FC<IconResolverProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent {...props} />;
};
