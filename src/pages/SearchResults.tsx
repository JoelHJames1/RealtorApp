import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import PropertyList from '../components/property/PropertyList';
import PropertySearch from '../components/property/PropertySearch';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        let q = collection(db, 'properties');
        
        // Build query based on search parameters
        const location = searchParams.get('location');
        const propertyType = searchParams.get('propertyType');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const bedrooms = searchParams.get('bedrooms');

        if (location) {
          q = query(q, where('location', '>=', location));
        }
        if (propertyType) {
          q = query(q, where('propertyType', '==', propertyType));
        }
        if (minPrice) {
          q = query(q, where('price', '>=', parseInt(minPrice)));
        }
        if (maxPrice) {
          q = query(q, where('price', '<=', parseInt(maxPrice)));
        }
        if (bedrooms) {
          q = query(q, where('bedrooms', '>=', parseInt(bedrooms)));
        }

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProperties(results);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <PropertySearch />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
          <p className="text-gray-600">
            {loading ? 'Searching...' : `${properties.length} properties found`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <PropertyList properties={properties} />
        )}
      </div>
    </div>
  );
}