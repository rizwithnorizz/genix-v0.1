import Chart2 from '@/Components/ui/chart2';
import Layout  from '@/Components/ui/layout';
import Department from '@/Components/ui/department';
import { Card, CardFooter } from '@/Components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';


const about = () => {
  return (
    <Layout>
      <h1 className='pb-6'>About</h1>
      <div className='pt-4'>
        <Card className="bg-white p-4 rounded-2xl shadow-lg flex flex-row items-center">
          <Avatar className="flex items-center justify-center h-40 w-40">
            <AvatarImage className="h-full w-full" src="#" alt="CICT" />
              <AvatarFallback className="text-center">Kyoto Logo</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">Kyoto</h2>
              <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet. Ea asperiores consequatur est similique molestiae qui accusantium consequatur et nulla blanditiis id reprehenderit voluptates aut saepe explicabo et quae voluptatibus.</p>
            </div>
        </Card>
      </div>

      <div className='pt-4'>
        <Card className="bg-white p-4 rounded-2xl shadow-lg flex flex-row items-center">
          <Avatar className="flex items-center justify-center h-40 w-40">
            <AvatarImage className="h-full w-full" src="#" alt="CICT" />
              <AvatarFallback className="text-center">Isaiah</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">Reven Jan Isaiah A. Aguilar</h2>
              <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet. Ea asperiores consequatur est similique molestiae qui accusantium consequatur et nulla blanditiis id reprehenderit voluptates aut saepe explicabo et quae voluptatibus.</p>
            </div>
        </Card>
      </div>
      
      <div className='pt-4'>
        <Card className="bg-white p-4 rounded-2xl shadow-lg flex flex-row items-center">
          <Avatar className="flex items-center justify-center h-40 w-40">
            <AvatarImage className="h-full w-full" src="#" alt="CICT" />
              <AvatarFallback className="text-center">Jud</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">Judiel James A. Aristorenas</h2>
              <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet. Ea asperiores consequatur est similique molestiae qui accusantium consequatur et nulla blanditiis id reprehenderit voluptates aut saepe explicabo et quae voluptatibus.</p>
            </div>
        </Card>
      </div>

    </Layout>
  );
};

export default about;

