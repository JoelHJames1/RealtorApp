import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocument } from '../lib/firebase/firestore';
import { useAuthContext } from '../contexts/AuthContext';
import { Home, MapPin, Bed, Bath, Square } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  userId: string;
  createdAt: any;
}

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const data = await getDocument('properties', id);
        if (data) {
          setProperty(data as Property);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative h-96">
            <img
              src={property.images[currentImage]}
              alt={property.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`relative h-20 ${
                  currentImage === index ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${property.title} ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="flex items-center space-x-8 text-gray-600">
            <div className="flex items-center">
              <Bed className="w-5 h-5 mr-2" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-5 h-5 mr-2" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center">
              <Square className="w-5 h-5 mr-2" />
              <span>{property.area} sqft</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              ${property.price.toLocaleString()}
            </h2>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
          </div>

          {user?.uid === property.userId && (
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/edit-property/${property.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Property
              </button>
              <button
                onClick={() => navigate(`/delete-property/${property.id}`)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Property
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}