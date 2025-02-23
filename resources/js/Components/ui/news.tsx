import { Card, CardHeader, CardTitle, CardContent } from './card';

const News = () => {
  const newsItems = [
    "Ang lupet ni Jud mag computer sheeesh",
    "Time check, 7:46 am!!!!!!!!",
    "Tulog na ko goodnight mahal ko kayong lahat mwah",
  ];

  return (
    <div className="relative">
      <Card className="rounded-xl border-2 bg-card text-card-foreground p-4 w-full sm:w-48 md:w-56 lg:w-[384px]">
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