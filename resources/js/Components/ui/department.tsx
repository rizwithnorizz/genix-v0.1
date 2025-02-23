import { Avatar, AvatarFallback, AvatarImage} from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

const department = () => {
  return (
    <><div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-2">
          <Card className="rounded-xl border-2 bg-card text-card-foreground shadow sm:w-[700px] md:w-[800px] lg:w-[1165px] sm:h-72 md:h-80 lg:h-96 absolute left-5 top-32 p-4">
            <CardHeader>
                <CardTitle className="text-center font-bold text-lg p-0 -mt-6">Department</CardTitle>
            </CardHeader>
              <CardContent>
                  <div className="pt-10 pb-5 grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2 -mt-12">
                      <Avatar className="rounded-xl border bg-card h-16 w-16">
                          <AvatarImage src="/path/to/avatar1.jpg" alt="CICT" />
                          <AvatarFallback>Logo</AvatarFallback>
                      </Avatar>
                      <Avatar className="rounded-xl border bg-card h-16 w-16">
                          <AvatarImage src="/path/to/avatar2.jpg" alt="CAS" />
                          <AvatarFallback>CAS</AvatarFallback>
                      </Avatar>
                      <Avatar className="rounded-xl border bg-card h-16 w-16">
                          <AvatarImage src="/path/to/avatar3.jpg" alt="CENG" />
                          <AvatarFallback>CENG</AvatarFallback>
                      </Avatar>
                      <Avatar className="rounded-xl border bg-card h-16 w-16">
                          <AvatarImage src="/path/to/avatar4.jpg" alt="CTHM" />
                          <AvatarFallback>CTHM</AvatarFallback>
                      </Avatar>
                      <Avatar className="rounded-xl border bg-card h-16 w-16">
                          <AvatarImage src="/path/to/avatar4.jpg" alt="CEDU" />
                          <AvatarFallback>CEDU</AvatarFallback>
                      </Avatar><Avatar className="rounded-xl border bg-card h-16 w-16">
                          <AvatarImage src="/path/to/avatar4.jpg" alt="CAMS" />
                          <AvatarFallback>CAMS</AvatarFallback>
                      </Avatar>
                      <Avatar className="rounded-xl border bg-card h-16 w-16">
                          <AvatarImage src="/path/to/avatar4.jpg" alt="CBA" />
                          <AvatarFallback>CBA</AvatarFallback>
                      </Avatar><Avatar className="rounded-xl border bg-card h-16 w-16">
                          <AvatarImage src="/path/to/avatar4.jpg" alt="CCJE" />
                          <AvatarFallback>CCJE</AvatarFallback>
                      </Avatar><Avatar className="rounded-xl border bg-card h-16 w-16">
                          <AvatarImage src="/path/to/avatar4.jpg" alt="CIT" />
                          <AvatarFallback>CIT</AvatarFallback>
                      </Avatar><Avatar className="rounded-xl border bg-card h-16 w-16">
                          <AvatarImage src="/path/to/avatar4.jpg" alt="DE" />
                          <AvatarFallback>DE</AvatarFallback>
                      </Avatar>
                      <Avatar className="rounded-xl border bg-card h-16 w-16">
                          <AvatarImage src="/path/to/avatar4.jpg" alt="ETEEAP" />
                          <AvatarFallback>ETEEAP</AvatarFallback>
                      </Avatar>
                  </div>
                  <div className="flex justify-center pt-5">
                      <Button>View All Departments</Button>
                  </div>
              </CardContent>
          </Card>
      </div><div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-2">

          </div></>
  )
}

export default department