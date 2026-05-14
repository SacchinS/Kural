import type { Metadata } from 'next';
import KuralAAC from '@/components/aac/KuralAAC';

export const metadata: Metadata = {
  title: 'Kural — AAC',
  description: 'AI-powered communication for ALS patients',
};

export default function AACPage() {
  return <KuralAAC />;
}
