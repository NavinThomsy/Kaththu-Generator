import { EditorPrototype } from "./components/EditorPrototype";

export default function PrototypePage() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-center mb-8 text-gray-800 text-3xl font-serif">
                    Editor Prototype
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Editor */}
                    <EditorPrototype />

                    {/* Right Column: Preview placeholder */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 min-h-[400px] flex items-center justify-center text-gray-400">
                        Letter Preview Area
                    </div>
                </div>
            </div>
        </div>
    );
}
