import { Card, CardHeader, CardTitle, CardContent } from './card';

const News = () => {
  const newsItems = [
    "Ang lupet ni Jud mag computer sheeesh",
    "Time check, 7:46 am!!!!!!!!",
    "Tulog na ko goodnight mahal ko kayong lahat mwah",
  ];

  return (
    <div className="relative">
      <Card className="absolute rounded-xl border-2 bg-card text-card-foreground pt-3 w-full sm:w-48 md:w-56 lg:w-[384px] sm:h-48 md:h-56 lg:h-[273px] right-[20px] top-[410px]">
        <CardHeader>
          <CardTitle className="text-center font-bold text-lg">News</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {newsItems.map((item, index) => (
              <li key={index} className="text-sm">
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default News;