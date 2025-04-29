
import Layout from "@/Components/ui/layout";
import { useState } from "react";

const [begin, setBegin] = useState<boolean>(false);

export default function Help() {
    return (
        <Layout>
            <h1 className="font-bold text-2xl mb-4">Help</h1>
            <button onClick={() => {
                setBegin(!begin)
            }}
            className="text-xl bg-gray-200">
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
