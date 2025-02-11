import dynamic from 'next/dynamic';

const SessionWrapper = dynamic(() => import('../components/SessionWrapper'), { ssr: false });
const Dashboard = dynamic(() => import('../components/Dashboard'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <SessionWrapper> 
        <Dashboard />
      </SessionWrapper>
    </main>
  );
}
