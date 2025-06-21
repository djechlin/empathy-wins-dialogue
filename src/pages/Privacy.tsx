import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
              <p className="text-gray-600 mb-8 italic">Last updated: June 21, 2025</p>

              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data We Store on Our Servers</h2>
                <p className="mb-4">
                  When you create an account and use our app, we collect and store information necessary for app functionality, including:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Account registration information (email, username)</li>
                  <li>App progress and activity data (such as course completion, achievements, and usage history)</li>
                </ul>

                <p className="mb-4">
                  When you use the roleplay, audio is sent to our voice provider to generate a response. It is not saved by third parties. 
                  It is saved for up to 30 days by Type2Dialogue, for the purpose of checking for issues with voice processing, like 
                  whether the voice assistant understands words clearly. Audio data is never used for AI training.
                </p>

                <p className="mb-6">
                  Textual transcripts of roleplays are saved for up to 2 years. They may be anonymized and used to train AI developed 
                  by Type2Dialogue, but not train major providers like ChatGPT.
                </p>

                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Similar Technologies</h2>
                <p className="mb-4">We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Keep you logged into your account</li>
                  <li>Remember your preferences and settings</li>
                  <li>Analyze app usage patterns</li>
                  <li>Improve app performance and functionality</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
                <p className="mb-6">
                  We may update this privacy policy from time to time. We will notify you of any material changes by posting the new 
                  policy in the app. Changes in data retention or usage won't apply retroactively without explicit consent.
                </p>

                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p>
                  If you have questions about this privacy policy, please contact us at{' '}
                  <a href="mailto:daniel@type2dialogue.com" className="text-dialogue-purple hover:text-dialogue-darkblue">
                    daniel@type2dialogue.com
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;