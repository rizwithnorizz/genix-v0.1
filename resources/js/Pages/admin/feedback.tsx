import Chart2 from '@/Components/ui/chart2';
import Layout  from '@/Components/ui/layout';
import Department from '@/Components/ui/department';
import Pendings from '@/Components/ui/pendings';
import News from '@/Components/ui/news';

import React, { useState } from 'react';

interface Feedback {
  id: number;
  title: string;
}

const FeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    { id: 1, title: 'Feedback title 1' },
    { id: 2, title: 'Feedback title 2' },
    { id: 3, title: 'Feedback title 3' },
    { id: 4, title: 'Feedback title 4' },
    { id: 5, title: 'Feedback title 5' },
    { id: 6, title: 'Feedback title 6' },
    { id: 7, title: 'Feedback title 7' },
    { id: 8, title: 'Feedback title 8' },
    { id: 9, title: 'Feedback title 9' },
    { id: 10, title: 'Feedback title 10' },
  ]);

  const handleApprove = (feedback: Feedback) => {
    console.log('Approve:', feedback);
  };

  const handleDeny = (feedback: Feedback) => {
    console.log('Deny:', feedback);
  };

  return (
    <Layout>
      <main className="col-span-3 space-y-4">
        <h1 className="font-bold text-2xl mb-4">Feedback</h1>

        <div className="bg-gray-200 p-4 rounded-2xl shadow-lg">
          <div className="space-y-4 overflow-y-auto h-[500px]">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-gray-800 text-white p-4 rounded-full flex justify-between items-center shadow">
                <div className="flex items-center">
                  <span>{feedback.title}</span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleApprove(feedback)} 
                    className="bg-green-500 text-white p-2 rounded-lg">
                    Approve
                  </button>
                  <button 
                    onClick={() => handleDeny(feedback)} 
                    className="bg-red-500 text-white p-2 rounded-lg">
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default FeedbackPage;
