import Chart2 from '@/Components/ui/chart2';
import Layout from '@/Components/ui/layout';
import Department from '@/Components/ui/department';
import Pendings from '@/Components/ui/pendings';
import News from '@/Components/ui/news';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar';

export default function About() {
  const proponents = [
    {
      name: "Reven Jann Isaiah Aguilar",
      description: "Backend Developer",
      avatar: "/path/to/avatar1.jpg",
    },
    {
      name: "Judiel James Aristorenas",
      description: "Frontend Developer",
      avatar: "/path/to/avatar2.jpg",
    },
    {
      name: "Arman Kyle Marasigan",
      description: "Frontend Developer",
      avatar: "/path/to/avatar3.jpg",
    },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center mb-8">About The Developers Behind Genix</h1>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {proponents.map((proponent, index) => (
            <Card key={index} className="flex flex-col items-center p-4">
              <CardHeader>
                <Avatar className="h-24 w-24 rounded-full">
                  <AvatarImage src={proponent.avatar} alt={proponent.name} />
                  <AvatarFallback>{proponent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-center mt-4">{proponent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center">{proponent.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-center">About the System</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Genix is a couse scheduling system that aims to provide a more efficient way of scheduling courses for students and instructors. Genetic Alogirthm and Artificial Intelligence were utilized to make scheduling more efficient and effective. It is developed by the proponents as a requirement for their thesis project.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}