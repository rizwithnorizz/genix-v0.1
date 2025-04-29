
import Layout from "@/Components/ui/layout";
import { useState } from "react";


export default function Help() {
    
    const [begin, setBegin] = useState<boolean>(false);
    return (
        <Layout>
            <h1 className="font-bold text-2xl mb-4">Help</h1>
            <button onClick={() => {
                setBegin(!begin)
            }}
            className="text-xl bg-gray-200 h-[10rem] w-fit">
                Where to begin?\
            </button>
            {begin && (
                <div className="ml-4">
                    <label>Uploading a curriculum</label>
                </div>
            )}
        </Layout>
    );
}
