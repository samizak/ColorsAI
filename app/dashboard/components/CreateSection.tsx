import React from "react";
import CreateOption from "./CreateOption";
import { PlusCircle, Upload, Layers } from "lucide-react";

const CreateSection = ({
  onCreateNew,
}: {
  onCreateNew: (path: string) => void;
}) => (
  <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      Create Something New
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CreateOption
        title="Text to Coloring Page"
        description="Describe any idea and watch it transform into a perfect coloring page"
        icon={<PlusCircle className="w-6 h-6 text-white" />}
        buttonText="Get Started"
        onClick={() => onCreateNew("/create/text-to-image")}
        gradientFrom="from-pink-50"
        gradientTo="to-purple-50"
        buttonColor="purple"
        borderColor="border-purple-100"
      />
      <CreateOption
        title="Upload Your Own"
        description="Upload any image and convert it into a beautiful coloring page"
        icon={<Upload className="w-6 h-6 text-white" />}
        buttonText="Upload Image"
        onClick={() => onCreateNew("/create/upload")}
        gradientFrom="from-blue-50"
        gradientTo="to-cyan-50"
        buttonColor="blue"
        borderColor="border-blue-100"
      />
      <CreateOption
        title="Browse Templates"
        description="Choose from our collection of ready-to-color templates"
        icon={<Layers className="w-6 h-6 text-white" />}
        buttonText="View Templates"
        onClick={() => onCreateNew("/templates")}
        gradientFrom="from-green-50"
        gradientTo="to-teal-50"
        buttonColor="green"
        borderColor="border-green-100"
      />
    </div>
  </div>
);

export default CreateSection;
