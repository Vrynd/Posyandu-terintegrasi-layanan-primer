import {
  HeroOverview,
  QuickActions,
  VisitChart,
  ParticipantDistributionChart,
  NewParticipantChart,
  SystemFlow
} from '../components/dashboard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';


export function DashboardPage() {
  useDocumentTitle('Dashboard');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Overview */}
      <section>
        <HeroOverview />
      </section>

      {/* Main Charts & Quick Actions Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <QuickActions />
        <div className="lg:col-span-2">
          <VisitChart />
        </div>
      </section>

      {/* Secondary Stats Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <NewParticipantChart />
        </div>
        <div className="lg:col-span-1">
          <ParticipantDistributionChart />
        </div>
      </section>

      {/* System Workflow Section */}
      <section>
        <SystemFlow />
      </section>
    </div>
  );
}




