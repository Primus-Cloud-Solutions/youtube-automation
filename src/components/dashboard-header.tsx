import { DashboardHeader as DashboardHeaderType } from '@/components/dashboard-header'

interface DashboardHeaderProps {
  activeTab?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeTab = 'dashboard' }) => {
  // Get the title based on the active tab
  const getTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Dashboard Overview';
      case 'manual':
        return 'Manual Topic Submission';
      case 'automated':
        return 'Automated Content';
      case 'scheduler':
        return 'Topic Scheduler';
      case 'analytics':
        return 'Video Analytics';
      case 'api-keys':
        return 'API Key Management';
      default:
        return 'Dashboard';
    }
  };

  // Get the description based on the active tab
  const getDescription = () => {
    switch (activeTab) {
      case 'overview':
        return 'View your YouTube channel performance and upcoming content';
      case 'manual':
        return 'Create and submit video topics manually';
      case 'automated':
        return 'Configure automated content generation settings';
      case 'scheduler':
        return 'Schedule your content for optimal publishing times';
      case 'analytics':
        return 'Analyze your video performance and audience engagement';
      case 'api-keys':
        return 'Manage your YouTube API keys and authentication';
      default:
        return 'Manage your YouTube automation settings';
    }
  };

  return (
    <div className="mb-8 slide-in-up">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        {getTitle()}
      </h1>
      <p className="text-muted-foreground mt-2">{getDescription()}</p>
    </div>
  );
};

export default DashboardHeader;
