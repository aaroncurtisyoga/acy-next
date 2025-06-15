import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Aaron Curtis and his approach to yoga practice and teaching.",
};

export default function AboutPage() {
  return (
    <div className="wrapper-width py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            About Aaron Curtis
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Dedicated to sharing the transformative power of yoga through
            mindful practice, authentic teaching, and genuine connection.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* My Journey Section */}
          <section className="bg-gradient-to-br from-blue-50/30 to-slate-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
              My Journey
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed mb-4">
                [Placeholder: This is where your personal yoga journey story
                would go. Share how you discovered yoga, what drew you to
                teaching, and what makes your approach unique.]
              </p>
              <p className="text-slate-600 leading-relaxed">
                [Placeholder: Include information about your training,
                certifications, years of practice, and what continues to inspire
                you in your yoga journey.]
              </p>
            </div>
          </section>

          {/* Teaching Philosophy Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
              Teaching Philosophy
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-blue-700 mb-3">
                  Mindful Movement
                </h3>
                <p className="text-slate-600">
                  [Placeholder: Describe your approach to mindful movement and
                  how you guide students to connect with their bodies.]
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-blue-700 mb-3">
                  Inclusive Practice
                </h3>
                <p className="text-slate-600">
                  [Placeholder: Share your commitment to making yoga accessible
                  and welcoming for practitioners of all levels and
                  backgrounds.]
                </p>
              </div>
            </div>
          </section>

          {/* Credentials Section */}
          <section className="bg-gradient-to-r from-slate-50 to-blue-50/20 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
              Training & Credentials
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-600">
                  [Placeholder: RYT 200/500 or other yoga certifications]
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-600">
                  [Placeholder: Specialized training or additional
                  certifications]
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-600">
                  [Placeholder: Years of teaching experience or notable
                  achievements]
                </p>
              </div>
            </div>
          </section>

          {/* Connect Section */}
          <section className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
              Let&apos;s Connect
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Whether you&apos;re new to yoga or deepening your practice,
              I&apos;m here to support your journey. Reach out to learn more
              about classes, private sessions, or just to say hello.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/private-sessions"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Book a Private Session
              </a>
              <a
                href="mailto:aaroncurtisyoga@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-300"
              >
                Send a Message
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
