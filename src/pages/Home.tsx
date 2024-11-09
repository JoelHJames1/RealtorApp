import React from 'react';
import PropertySearch from '../components/property/PropertySearch';
import PropertyList from '../components/property/PropertyList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Property Search */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
              Find Your Perfect Property
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Search through thousands of listings with our advanced property search engine
            </p>
          </div>
          <PropertySearch />
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Properties</h2>
            <PropertyList />
          </div>
        </div>
      </section>
    </div>
  );
}