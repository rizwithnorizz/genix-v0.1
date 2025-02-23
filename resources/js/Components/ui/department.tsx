import { Avatar, AvatarFallback, AvatarImage} from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';

const department = () => {
  return (
    <>  
    <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-2">
            <Card className="rounded-xl border-2 bg-card text-card-foreground shadow sm:w-[700px] md:w-[800px] lg:w-[1165px] sm:h-72 md:h-80 lg:h-96 absolute left-5 top-32 p-4">
                <CardHeader>
                    <CardTitle className="text-center font-bold text-lg p-0 -mt-7">Department</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-1 gap-3 -mt-4">
                        <Card className="rounded-xl border bg-card h-32 w-32 flex flex-col items-center justify-center">
                            <Avatar className="flex items-center justify-center h-20 w-20 mt-6">
                                <AvatarImage className="h-full w-full" src="/path/to/avatar1.jpg" alt="CICT"  />
                                <AvatarFallback>Logo</AvatarFallback>
                            </Avatar>
                        <CardFooter className="text-center mt-2">
                            CAS
                        </CardFooter>
                        </Card>
                        <Card className="rounded-xl border bg-card h-32 w-32 flex flex-col items-center justify-center">
                            <Avatar className="flex items-center justify-center h-20 w-20 mt-6">
                                <AvatarImage className="h-full w-full" src="/path/to/avatar1.jpg" alt="CICT"  />
                                <AvatarFallback>Logo</AvatarFallback>
                            </Avatar>
                        <CardFooter className="text-center mt-2">
                            CENG
                        </CardFooter>
                        </Card>
                        <Card className="rounded-xl border bg-card h-32 w-32 flex flex-col items-center justify-center">
                            <Avatar className="flex items-center justify-center h-20 w-20 mt-6">
                                <AvatarImage className="h-full w-full" src="/path/to/avatar1.jpg" alt="CICT"  />
                                <AvatarFallback>Logo</AvatarFallback>
                            </Avatar>
                        <CardFooter className="text-center mt-2">
                            CTHM
                        </CardFooter>
                        </Card>
                        <Card className="rounded-xl border bg-card h-32 w-32 flex flex-col items-center justify-center">
                            <Avatar className="flex items-center justify-center h-20 w-20 mt-6">
                                <AvatarImage className="h-full w-full" src="/path/to/avatar1.jpg" alt="CICT"  />
                                <AvatarFallback>Logo</AvatarFallback>
                            </Avatar>
                        <CardFooter className="text-center mt-2">
                            CEDU
                        </CardFooter>
                        </Card>
                        <Card className="rounded-xl border bg-card h-32 w-32 flex flex-col items-center justify-center">
                            <Avatar className="flex items-center justify-center h-20 w-20 mt-6">
                                <AvatarImage className="h-full w-full" src="/path/to/avatar1.jpg" alt="CICT"  />
                                <AvatarFallback>Logo</AvatarFallback>
                            </Avatar>
                        <CardFooter className="text-center mt-2">
                            CAMS
                        </CardFooter>
                        </Card>
                        <Card className="rounded-xl border bg-card h-32 w-32 flex flex-col items-center justify-center">
                            <Avatar className="flex items-center justify-center h-20 w-20 mt-6">
                                <AvatarImage className="h-full w-full" src="/path/to/avatar1.jpg" alt="CICT"  />
                                <AvatarFallback>Logo</AvatarFallback>
                            </Avatar>
                        <CardFooter className="text-center mt-2">
                            CBA
                        </CardFooter>
                        </Card>
                        <Card className="rounded-xl border bg-card h-32 w-32 flex flex-col items-center justify-center">
                            <Avatar className="flex items-center justify-center h-20 w-20 mt-6">
                                <AvatarImage className="h-full w-full" src="/path/to/avatar1.jpg" alt="CICT"  />
                                <AvatarFallback>Logo</AvatarFallback>
                            </Avatar>
                        <CardFooter className="text-center mt-2">
                            CCJE
                        </CardFooter>
                        </Card>
                    
                        <Card className="rounded-xl border bg-card h-32 w-32 flex flex-col items-center justify-center">
                            <Avatar className="flex items-center justify-center h-20 w-20 mt-6">
                                <AvatarImage className="h-full w-full" src="/path/to/avatar1.jpg" alt="CICT"  />
                                <AvatarFallback>Logo</AvatarFallback>
                            </Avatar>
                        <CardFooter className="text-center mt-2">
                            CIT
                        </CardFooter>
                        </Card>
                        <Card className="rounded-xl border bg-card h-32 w-32 flex flex-col items-center justify-center">
                            <Avatar className="flex items-center justify-center h-20 w-20 mt-6">
                                <AvatarImage className="h-full w-full" src="/path/to/avatar1.jpg" alt="CICT"  />
                                <AvatarFallback>Logo</AvatarFallback>
                            </Avatar>
                        <CardFooter className="text-center mt-2">
                            DE
                        </CardFooter>
                        </Card>
                        <Card className="rounded-xl border bg-card h-32 w-32 flex flex-col items-center justify-center">
                            <Avatar className="flex items-center justify-center h-20 w-20 mt-6">
                                <AvatarImage className="h-full w-full" src="/path/to/avatar1.jpg" alt="CICT"  />
                                <AvatarFallback>Logo</AvatarFallback>
                            </Avatar>
                        <CardFooter className="text-center mt-2">
                            ETEEAP
                        </CardFooter>
                        </Card>
                    </div>
                        <div className="flex justify-center pt-3">
                            <Button>View All Departments</Button>
                        </div>
                </CardContent>
            </Card>
    </div>
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-2">

          </div></>
  )
}

export default department