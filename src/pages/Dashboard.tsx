import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, LineChart, Users, MessageSquare } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

interface DashboardStats {
  activeListings: number;
  totalViews: number;
  totalLeads: number;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  date: string;
  propertyId?: string;
  propertyTitle?: string;
}

export default function Dashboard() {
  const { user } = useAuthContext();
  const [stats, setStats] = useState<DashboardStats>({
    activeListings: 0,
    totalViews: 0,
    totalLeads: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch user's properties
        const propertiesQuery = query(
          collection(db, 'properties'),
          where('userId', '==', user.uid)
        );
        const propertiesSnapshot = await getDocs(propertiesQuery);
        const activeListings = propertiesSnapshot.size;

        // Calculate total views from property documents
        let totalViews = 0;
        propertiesSnapshot.forEach(doc => {
          const data = doc.data();
          totalViews += data.views || 0;
        });

        // Fetch leads (inquiries)
        const leadsQuery = query(
          collection(db, 'inquiries'),
          where('ownerId', '==', user.uid)
        );
        const leadsSnapshot = await getDocs(leadsQuery);
        const totalLeads = leadsSnapshot.size;

        setStats({
          activeListings,
          totalViews,
          totalLeads
        });

        // Fetch recent activity
        const activities = [];
        for (const propertyDoc of propertiesSnapshot.docs) {
          const propertyData = propertyDoc.data();
          
          // Add property creation to activities
          activities.push({
            id: `property-${propertyDoc.id}`,
            type: 'property_created',
            message: `Listed "${propertyData.title}"`,
            date: propertyData.createdAt,
            propertyId: propertyDoc.id,
            propertyTitle: propertyData.title
          });

          // Add views to activities if they exist
          if (propertyData.recentViews) {
            propertyData.recentViews.forEach((view: any) => {
              activities.push({
                id: `view-${view.id}`,
                type: 'property_viewed',
                message: `"${propertyData.title}" was viewed`,
                date: view.timestamp,
                propertyId: propertyDoc.id,
                propertyTitle: propertyData.title
              });
            });
          }
        }

        // Sort activities by date and take the most recent 5
        const sortedActivities = activities
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        setRecentActivity(sortedActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Active Listings</h3>
              <LineChart className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeListings}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Total Views</h3>
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">New Leads</h3>
              <MessageSquare className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
          </div>

          <Link
            to="/create-listing"
            className="bg-white p-6 rounded-xl shadow-sm hover:bg-gray-50 transition group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Create Listing</h3>
              <Plus className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-sm text-gray-600 group-hover:text-gray-900">
              Add a new property listing
            </p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => (
                <Link
                  key={activity.id}
                  to={activity.propertyId ? `/properties/${activity.propertyId}` : '#'}
                  className="block p-4 rounded-lg hover:bg-gray-50"
                >
                  <p className="text-gray-900">{activity.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-gray-600">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}