import React from "react";
import { PlusCircle, Heart, Printer } from "lucide-react";

const StatsSection = ({
  totalPages,
  totalFavorites,
  totalPrinted,
}: {
  totalPages: number;
  totalFavorites: number;
  totalPrinted: number;
}) => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
        <p className="text-gray-600 mt-1">
          Track your coloring page statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <PlusCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pages</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalPages}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100 mr-4">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Favorites</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalFavorites}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Printer className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Printed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalPrinted}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsSection;
