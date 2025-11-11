'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';

interface OnboardingData {
  phone_number: string;
  birthdate: string;
  'custom:interests': string;
  'custom:news_frequency': string;
  'custom:language': string;
}

export default function Onboarding() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    phone_number: '',
    birthdate: '',
    'custom:interests': '',
    'custom:news_frequency': 'daily',
    'custom:language': 'en',
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interestOptions = [
    'Technology',
    'Business',
    'Politics',
    'Sports',
    'Entertainment',
    'Science',
    'Health',
    'Environment',
    'Education',
    'Travel',
  ];

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    const checkOnboarding = async () => {
      try {
        const attributes = await fetchUserAttributes();
        // Check if user has already completed onboarding
        if (attributes.profile) {
          try {
            const profile = JSON.parse(attributes.profile);
            if (profile.onboarding_completed) {
              router.push('/');
              return;
            }
          } catch (e) {
            // Profile exists but not JSON, continue with onboarding
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [user, router]);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare attributes using standard Cognito attributes
      const attributes: Record<string, string> = {
        locale: formData['custom:language'], // Use locale for language
        profile: JSON.stringify({
          interests: selectedInterests,
          news_frequency: formData['custom:news_frequency'],
          onboarding_completed: true,
        }),
      };

      // Add phone number if provided
      if (formData.phone_number) {
        attributes.phone_number = formData.phone_number.startsWith('+')
          ? formData.phone_number
          : `+${formData.phone_number}`;
      }

      // Add birthdate if provided
      if (formData.birthdate) {
        attributes.birthdate = formData.birthdate;
      }

      await updateUserAttributes({
        userAttributes: attributes,
      });

      console.log('Onboarding completed successfully');
      console.log('Saved attributes:', attributes);
      router.push('/');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      alert('Failed to save your information. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to NewsHub!
          </h1>
          <p className="text-gray-600">
            Let's personalize your news experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              placeholder="+1234567890"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include country code (e.g., +1 for US)
            </p>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={formData.birthdate}
              onChange={(e) =>
                setFormData({ ...formData, birthdate: e.target.value })
              }
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What topics interest you? (Select at least 3)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    selectedInterests.includes(interest)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            {selectedInterests.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {selectedInterests.length} topic(s)
              </p>
            )}
          </div>

          {/* News Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How often would you like to receive news updates?
            </label>
            <select
              value={formData['custom:news_frequency']}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  'custom:news_frequency': e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="realtime">Real-time (as it happens)</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly summary</option>
              <option value="never">Never (I'll check manually)</option>
            </select>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Language
            </label>
            <select
              value={formData['custom:language']}
              onChange={(e) =>
                setFormData({ ...formData, 'custom:language': e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={saving || selectedInterests.length < 3}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Complete Setup'}
            </button>
          </div>

          {selectedInterests.length < 3 && selectedInterests.length > 0 && (
            <p className="text-sm text-amber-600 text-center">
              Please select at least 3 interests to continue
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
