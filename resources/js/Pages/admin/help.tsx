import Chart2 from '@/Components/ui/chart2';
import Layout  from '@/Components/ui/layout';
import Department from '@/Components/ui/department';
import Pendings from '@/Components/ui/pendings';
import News from '@/Components/ui/news';
import { Card } from '@/Components/ui/card';


export default function Help(){
  return (
    <Layout>
      <h1>Help</h1>

      <Card className="bg-white p-4 rounded-2xl shadow-lg w-[15%] h-10 flex items-center justify-center mb-4">
        <div>
          <h2 className="text-lg font-semibold whitespace-nowrap">Sender Name here</h2>
        </div>
      </Card>

      <Card className="bg-white p-4 rounded-2xl shadow-lg w-[80%] h-80 flex mb-4">
        <div className="ml-4 ">
        <h2 className="text-lg font-semibold break-words whitespace-normal">
          Lorem ipsum dolor sit amet. Ea asperiores consequatur est similique molestiae qui accusantium consequatur et nulla blanditiis id reprehenderit voluptates aut saepe explicabo et quae voluptatibus.
          Lorem ipsum dolor sit amet. Ea asperiores consequatur est similique molestiae qui accusantium consequatur et nulla blanditiis id reprehenderit voluptates aut saepe explicabo et quae voluptatibus.
          Lorem ipsum dolor sit amet. Ea asperiores consequatur est similique molestiae qui accusantium consequatur et nulla blanditiis id reprehenderit voluptates aut saepe explicabo et quae voluptatibus.
          Lorem ipsum dolor sit amet. Ea asperiores consequatur est similique molestiae qui accusantium consequatur et nulla blanditiis id reprehenderit voluptates aut saepe explicabo et quae voluptatibus.
          </h2>
        </div>
      </Card>

      <button className="bg-green-500 text-white p-2 rounded-lg mb-4">
        Submit
      </button>

      <h2>Need help? Contact ITC</h2>
      <h2>itc@ub.edu.ph</h2>
      <h2>+639 999 999 9999</h2>
      <h2>(043) 723-9999</h2>

    </Layout>
  );
};

