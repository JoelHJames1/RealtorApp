import React from 'react';
import PropertySearch from '../components/property/PropertySearch';
import PropertyList from '../components/property/PropertyList';

export default function Properties() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Properties</h1>
          <PropertySearch />
        </div>

        <div className="mt-12">
          <PropertyList />
        </div>
      </div>
    </div>
  );
}