
import Layout  from '@/Components/ui/layout';


export default function Help(){
  return (
    <Layout>
      <h1 className="font-bold text-2xl mb-4">Help</h1>

      <div>
        <input type="text" placeholder="Sender Name..." className="rounded-2xl shadow-lg w-[15%] h-10 flex items-center" />
      </div>
      <div>
      <textarea
          placeholder="Concerns here..."
          className="bg-white p-4 rounded-2xl shadow-lg w-[80%] h-80 flex mb-4 mt-4 text-left align-top"
        />
      </div>

      <button className="bg-green-500 text-white p-2 rounded-lg mb-4">
        Submit
      </button>

    </Layout>
  );
};

