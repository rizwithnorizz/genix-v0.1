import { Card, CardHeader, CardTitle } from './card'

const news = () => {
  return (
    <div className= "relative">
          <Card className="absolute rounded-xl border-2 bg-card text-card-foreground pt-3 w-full sm:w-48 md:w-56 lg:w-[384px] sm:h-48 md:h-56 lg:h-[273px] right-[20px] top-[410px]">
            <CardHeader>
                <CardTitle className="text-center font-bold text-lg p-0 -mt-6">News</CardTitle>
                  <h1> ang lupet ni jud mag computer sheeesh</h1>
                  <h1> time check, 7:46 am!!!!!!!!</h1>
                  <h1> tulog na ko goodnight mahal ko kayong lahat mwah</h1>
            </CardHeader>
          </Card>
    </div>
  )
}

export default news

