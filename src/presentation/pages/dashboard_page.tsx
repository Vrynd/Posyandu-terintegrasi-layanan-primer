import { HeroOverview } from '../components/dashboard/hero_overview';
import { QuickActions } from '../components/dashboard/quick_action';
import { VisitChart } from '../components/dashboard/visit_chart';
import { ParticipantDistributionChart } from '../components/dashboard/participant_distribution_chart';
import { NewParticipantChart } from '../components/dashboard/new_participant_chart';
import { SystemFlow } from '../components/dashboard/system_flow';
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




