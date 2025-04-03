import Layout  from '@/Components/ui/layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';


const about = () => {
  return (
    <Layout>
      <h1 className="font-bold text-2xl mb-4">About</h1>
      <div className="pt-4 bg-white p-4 rounded-2xl shadow-lg flex flex-col items-center">
        <Avatar className="flex items-center justify-center h-40 w-40">
          <AvatarImage className="h-full w-full" src="#" alt="CICT" />
            <AvatarFallback className="text-center">Kyoto Logo</AvatarFallback>
        </Avatar>
        <div className="ml-4">  
          <h2 className="text-lg font-semibold">Team Kyoto</h2>
            <p className="text-sm text-gray-500">This system introduces GENIX, an innovative course scheduling system designed to address inefficiencies at the University of Batangas (UB) using Genetic Algorithms (GA) enhanced with Artificial Intelligence (AI). The project tackles persistent issues in manual scheduling, such as double bookings, resource conflicts, and delays, which disrupt academic activities and stakeholder satisfaction. GENIX leverages GA’s evolutionary approach—mimicking natural selection through selection, crossover, and mutation—to generate optimized schedules that balance constraints like classroom capacity, faculty availability, and student preferences. AI integration, particularly Natural Language Processing (NLP), enables the system to interpret user feedback, refine outputs, and adapt dynamically. Developed on the PHP Laravel Framework, the web-based platform prioritizes security, scalability, and user-friendliness, featuring role-based access for administrators, instructors, and students. Key objectives include analyzing AI-driven scheduling algorithms, designing a feasible system, and evaluating performance using the ISO 9126 quality standard. The methodology combines Agile Software Development Life Cycle (SDLC) for iterative development with mixed-methods research, including interviews and document reviews to capture stakeholder needs. GENIX aims to reduce manual intervention, minimize conflicts, and enhance resource allocation, benefiting administrators through automation, instructors via conflict-free timetables, and students with reliable schedules. The study synthesizes insights from literature on metaheuristics, cloud-based optimization, and hybrid AI models, positioning GENIX as a scalable solution adaptable to other institutions. By bridging theoretical research and practical application, this project underscores the transformative potential of AI-enhanced systems in streamlining academic operations and improving educational outcomes.</p>
        </div>
      </div>
      
      <h1 className="text-2xl font-medium mt-5">Meet the team members</h1>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div className="mt-4 pt-4 bg-white p-4 rounded-2xl shadow-lg flex md:flex-col flex-row items-center">
          <Avatar className="flex items-center justify-center h-40 w-40">
            <AvatarImage className="h-full w-full" src="#" alt="CICT" />
              <AvatarFallback className="text-center">Isaiah</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h2 className="text-m font-semibold pb-5">Reven Jan Isaiah A. Aguilar</h2>
              <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet. Ea asperiores consequatur est similique molestiae qui accusantium consequatur et nulla blanditiis id reprehenderit voluptates aut saepe explicabo et quae voluptatibus.</p>
            </div>
        </div>
          <div className="mt-4 pt-4 bg-white p-4 rounded-2xl shadow-lg flex md:flex-col flex-row items-center">
            <Avatar className="flex items-center justify-center h-40 w-40">
              <AvatarImage className="h-full w-full" src="#" alt="CICT" />
                <AvatarFallback className="text-center">Jud</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h2 className="text-m font-semibold pb-5">Judiel James A. Aristorenas</h2>
                <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet. Ea asperiores consequatur est similique molestiae qui accusantium consequatur et nulla blanditiis id reprehenderit voluptates aut saepe explicabo et quae voluptatibus.</p>
              </div>
          </div>
      </div>

    </Layout>
  );
};

export default about;

