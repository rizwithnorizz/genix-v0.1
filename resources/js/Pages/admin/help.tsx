
import Layout from "@/Components/ui/layout";
import { useState } from "react";


export default function Help() {
    
    const [visibility, setVisibility] = useState<{
        value: boolean;
        name: string;
    }>({ value: false, name: "" });
    return (
        <Layout>
            <h1 className="font-bold text-2xl mb-4">Help</h1>
            <button
                onClick={() => {
                    setVisibility((prev) => ({
                        ...prev,
                        name: "begin",
                        value: !prev.value,
                    }));
                }}
                className="text-xl bg-gray-200 p-3 rounded-xl"
            >
                Where to begin?
            </button>
            {visibility.name == "begin" && visibility.value == true && (
                <div className="ml-4">
                    <label>Uploading a curriculum</label>
                </div>
            )}
        </Layout>
    );
}
