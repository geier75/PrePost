import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expert Lounge - PREPOST Command Center',
  description: 'Monitor all social media platforms in real-time - Simpsons Style',
};

export default function ExpertLoungeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
