import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Check } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

const stripePromise = loadStripe('pk_live_51QFkUkDW8CaiRlmcFoJ4drynAKnqHcwTYPTwEazhoQ5rLiVlOPPYWwHtRQe0T75oQq3uLbPWGWa6ONlgGgDYSHRT00SXBNQo6E');

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    interval: 'month',
    features: [
      'Up to 10 property listings',
      'Basic analytics',
      'Email support',
      'Standard listing visibility'
    ],
    priceId: 'price_basic' // Replace with actual Stripe price ID
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 79,
    interval: 'month',
    features: [
      'Up to 50 property listings',
      'Advanced analytics',
      'Priority support',
      'Featured listings',
      'Custom branding',
      'Lead management tools'
    ],
    priceId: 'price_pro' // Replace with actual Stripe price ID
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    features: [
      'Unlimited property listings',
      'Premium analytics',
      '24/7 dedicated support',
      'Priority featured listings',
      'Custom branding',
      'Advanced lead management',
      'Team collaboration tools',
      'API access'
    ],
    priceId: 'price_enterprise' // Replace with actual Stripe price ID
  }
];

export default function Subscription() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentSubscription(userDoc.data().subscription);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
          email: user.email
        }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Subscription Plan
          </h1>
          <p className="text-xl text-gray-600">
            Select the perfect plan for your real estate business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                currentSubscription?.planId === plan.id
                  ? 'ring-2 ring-indigo-600'
                  : ''
              }`}
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/{plan.interval}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={currentSubscription?.planId === plan.id}
                  className={`w-full py-3 px-6 rounded-lg text-center font-semibold ${
                    currentSubscription?.planId === plan.id
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {currentSubscription?.planId === plan.id
                    ? 'Current Plan'
                    : 'Subscribe'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {currentSubscription && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Current plan: <span className="font-semibold">{currentSubscription.planName}</span>
            </p>
            <button
              onClick={() => {/* Handle cancel subscription */}}
              className="mt-4 text-red-600 hover:text-red-700 font-medium"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
}