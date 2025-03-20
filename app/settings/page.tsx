"use client";

import React from "react";
import { Construction, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <Construction className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Settings Page
        </h1>

        <div className="flex items-center justify-center mb-4">
          <SettingsIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
          <p className="text-gray-500 dark:text-gray-400">Under Construction</p>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          We&apos;re working hard to build this page. Please check back soon for
          updates!
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors cursor-pointer"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
