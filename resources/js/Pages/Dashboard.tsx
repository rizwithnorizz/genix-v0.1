import Chart2 from '@/Components/ui/chart2';
import  Layout  from '@/Components/ui/layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="flex items-end justify-between mb-7">
        <h1 className="text 3xl font-bold">Pogi si Jud 8===D</h1>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Chart2  />
      </div>
    </Layout>
  );
};

export default Dashboard;