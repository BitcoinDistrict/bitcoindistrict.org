import { PageContent } from '@/components/PageContent';
import Image from 'next/image';

export default function NotFound() {
  return (
    <PageContent>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <Image
          src="/images/404.png"
          alt="404 illustration"
          width={350}
          height={350}
          priority
          className="rounded-lg"
        />
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="text-xl text-muted-foreground">
            This page is as elusive as Satoshi Nakamoto
          </p>
        </div>
      </div>
    </PageContent>
  );
} 