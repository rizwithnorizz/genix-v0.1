import Chart2 from '@/Components/ui/chart2';
import Layout  from '@/Components/ui/layout';
import Department from '@/Components/ui/department';
import Pendings from '@/Components/ui/pendings';
import News from '@/Components/ui/news';
const SuperAdminDashboard = () => {
  return (
    <Layout>
      <h1>Super Admin Dashboard</h1>
      <Department />
      <Chart2 />
      <Pendings />
      <News />

    </Layout>
  );
};

export default SuperAdminDashboard;
