import Layout from "@/Components/ui/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

const about = () => {
    return (
        <Layout>
            <h1 className="font-bold text-2xl mb-4">About</h1>
            <div className="pt-4 bg-white p-4 rounded-2xl border border-gray-500 flex flex-col items-center">
              <div className="flex flex-row items-center">
                
              <Avatar className="flex items-center justify-center h-[30rem] w-[30rem] ">
                    <AvatarImage
                        className="h-2/3 w-2/3"
                        src="/kyoto.png"
                        alt="CICT"
                    />
                    <AvatarFallback className="text-center">
                        Kyoto Logo
                    </AvatarFallback>
                </Avatar>
                <Avatar className="flex items-center justify-center h-[12rem] w-[30rem] ">
                    <AvatarImage
                        className="h-2/3 w-2/3"
                        src="/genixblack.png"
                        alt="CICT"
                    />
                    <AvatarFallback className="text-center">
                        Kyoto Logo
                    </AvatarFallback>
                </Avatar>
              </div>
                <div className="ml-4">
                    <h2 className="text-xl font-semibold">Team Kyoto</h2>
                    <p className="text-lg text-gray-500">
                        This system introduces GENIX, an innovative course
                        scheduling system designed to address inefficiencies at
                        the University of Batangas (UB) using Genetic Algorithms
                        (GA) enhanced with Artificial Intelligence (AI). The
                        project tackles persistent issues in manual scheduling,
                        such as double bookings, resource conflicts, and delays,
                        which disrupt academic activities and stakeholder
                        satisfaction. GENIX leverages GA’s evolutionary
                        approach—mimicking natural selection through selection,
                        crossover, and mutation—to generate optimized schedules
                        that balance constraints like classroom capacity,
                        faculty availability, and student preferences. AI
                        integration, particularly Natural Language Processing
                        (NLP), enables the system to interpret user feedback,
                        refine outputs, and adapt dynamically. Developed on the
                        PHP Laravel Framework, the web-based platform
                        prioritizes security, scalability, and
                        user-friendliness, featuring role-based access for
                        administrators, instructors, and students. Key
                        objectives include analyzing AI-driven scheduling
                        algorithms, designing a feasible system, and evaluating
                        performance using the ISO 9126 quality standard. The
                        methodology combines Agile Software Development Life
                        Cycle (SDLC) for iterative development with
                        mixed-methods research, including interviews and
                        document reviews to capture stakeholder needs. GENIX
                        aims to reduce manual intervention, minimize conflicts,
                        and enhance resource allocation, benefiting
                        administrators through automation, instructors via
                        conflict-free timetables, and students with reliable
                        schedules. The study synthesizes insights from
                        literature on metaheuristics, cloud-based optimization,
                        and hybrid AI models, positioning GENIX as a scalable
                        solution adaptable to other institutions. By bridging
                        theoretical research and practical application, this
                        project underscores the transformative potential of
                        AI-enhanced systems in streamlining academic operations
                        and improving educational outcomes.
                    </p>
                </div>
            </div>

            <h1 className="text-2xl font-medium mt-5">Meet the team members</h1>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div className="mt-4 pt-4 bg-white p-4 rounded-2xl border border-gray-500 flex flex-row items-center">
                    <Avatar className="flex items-center justify-center h-[20rem] w-[20rem]">
                        <AvatarImage
                            className="h-full w-full"
                            src="/isaiah.png"
                            alt="CICT"
                        />
                        <AvatarFallback className="text-center">
                            Isaiah
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 text-left">
                        <h2 className="text-xl font-semibold pb-5">
                            Reven Jan Isaiah A. Aguilar
                        </h2>
                        <p className="text-md text-gray-500">
                            Bachelor of Science in Computer Science
                            <br />
                            4th Year
                            <br />
                            University of Batangas
                            <br />
                            <br />
                            <span className="font-bold">Role:</span> Full Stack
                            Developer
                            <br />
                            <span className="font-bold">Email:</span>
                            1500038@ub.edu.php | rjan20155@gmail.com
                            <br />
                            <span className="font-bold">Phone:</span>{" "}
                            0929-222-7115
                        </p>
                    </div>
                </div>
                <div className="mt-4 pt-4 bg-white p-4 rounded-2xl border border-gray-500 flex flex-row items-center">
                    <Avatar className="flex items-center justify-center h-[20rem] w-[20rem]">
                        <AvatarImage
                            className="h-full w-full"
                            src="/jud.png"
                            alt="CICT"
                        />
                        <AvatarFallback className="text-center">
                            Isaiah
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 text-left">
                        <h2 className="text-xl font-semibold pb-5">
                            Judiel James A. Aristorenas
                        </h2>
                        <p className="text-md text-gray-500">
                            Bachelor of Science in Computer Science
                            <br />
                            4th Year
                            <br />
                            University of Batangas
                            <br />
                            <br />
                            <span className="font-bold">Role:</span> Front End Dev & Logic Architecture
                            <br />
                            <span className="font-bold">Email:</span>
                            1500038@ub.edu.php | rjan20155@gmail.com
                            <br />
                            <span className="font-bold">Phone:</span>{" "}
                            0929-222-7115
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default about;
