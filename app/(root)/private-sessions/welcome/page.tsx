"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { ArrowRight, User, Users, Calendar, Star } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const WelcomePage: React.FC = () => {
  const { goToNextStep } = useWizardForm();
  const router = useRouter();

  const handleGetStarted = () => {
    goToNextStep();
    router.push("/private-sessions/select-package");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-primary-500">
          Train With Aaron
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience personalized yoga instruction designed to meet your unique
          needs and goals. Whether you&apos;re a beginner or advanced
          practitioner, Aaron will guide you on your journey.
        </p>
        <Button
          color="primary"
          size="lg"
          endContent={<ArrowRight size={20} />}
          onPress={handleGetStarted}
          className="text-lg px-8 py-6"
        >
          Get Started
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center mb-4">
            <User className="w-8 h-8 text-primary-500 mr-3" />
            <h3 className="text-xl font-semibold">Individual Sessions</h3>
          </div>
          <p className="text-gray-600 mb-4">
            One-on-one personalized instruction tailored specifically to your
            needs, goals, and skill level.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Personalized programming</li>
            <li>✓ Virtual or in-person options</li>
            <li>✓ Breathwork and meditation</li>
            <li>✓ Ongoing support and guidance</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-primary-500 mr-3" />
            <h3 className="text-xl font-semibold">Group Sessions</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Share the experience with friends, family, or colleagues in a
            supportive group environment.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Custom group programming</li>
            <li>✓ Team building and connection</li>
            <li>✓ Shared learning experience</li>
            <li>✓ Special group rates</li>
          </ul>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why Choose Private Sessions?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Flexible Scheduling</h4>
            <p className="text-sm text-gray-600">
              Schedule sessions at times that work best for your lifestyle and
              commitments.
            </p>
          </div>
          <div className="text-center">
            <Star className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Personalized Attention</h4>
            <p className="text-sm text-gray-600">
              Receive focused instruction and immediate feedback to accelerate
              your progress.
            </p>
          </div>
          <div className="text-center">
            <User className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Expert Guidance</h4>
            <p className="text-sm text-gray-600">
              Learn from Aaron&apos;s years of experience and deep understanding
              of yoga practice.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
        <blockquote className="text-center">
          <p className="text-lg text-primary-900 mb-4 italic">
            &ldquo;Aaron&apos;s personalized approach helped me deepen my
            practice in ways I never thought possible. His guidance is both
            challenging and nurturing.&rdquo;
          </p>
          <footer className="text-primary-700 font-medium">
            — Sarah, Individual Session Client
          </footer>
        </blockquote>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-gray-600 mb-6">
          Ready to begin your personalized yoga journey?
        </p>
        <Button
          color="primary"
          size="lg"
          endContent={<ArrowRight size={20} />}
          onPress={handleGetStarted}
          className="text-lg px-8 py-6"
        >
          Choose Your Package
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage;
