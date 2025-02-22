import Chart2 from '@/Components/ui/chart2';
import  Layout  from '@/Components/ui/layout';

const SuperAdminDashboard = () => {
  return (
    <Layout>
      <div className="flex items-end justify-between mb-7">
        <h1 className="text 3xl font-bold">Admin dashboard</h1>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Chart2  />
      </div>
    </Layout>
  );
};

export default SuperAdminDashboard;

