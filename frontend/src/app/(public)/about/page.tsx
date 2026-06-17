import { Target, Eye, Heart, Users, BookOpen } from 'lucide-react';
import Image from 'next/image';
import InstructorsSection from '@/features/public/components/about/InstructorsSection';

export const metadata = {
  title: "About Us | Rahula Dancing Society",
  description: "Our journey, mission, and dedication to excellence in traditional Sri Lankan dance.",
};

const coreValues = [
  {
    icon: <Target className="w-6 h-6 text-rahula-blue" />,
    title: 'Excellence',
    desc: 'We strive for the highest standards in dance education and performance.',
  },
  {
    icon: <Heart className="w-6 h-6 text-rahula-blue" />,
    title: 'Cultural Heritage',
    desc: 'Preserving and promoting traditional Sri Lankan dance forms.',
  },
  {
    icon: <Users className="w-6 h-6 text-rahula-blue" />,
    title: 'Community',
    desc: 'Building a supportive community of dancers and enthusiasts.',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-rahula-blue" />,
    title: 'Education',
    desc: 'Comprehensive training in classical dance techniques.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f4f6fb] min-h-screen">

      {/* Hero Banner */}
      <section className="bg-[#f4f6fb] py-12 md:py-16 text-center px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-rahula-blue mb-4">About Us</h1>
        <p className="text-slate-500 text-base md:text-lg">Our journey, mission, and dedication to excellence</p>
      </section>

      {/* Our Story */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            {/* Image */}
            <div className="w-full md:w-[420px] shrink-0">
              <div className="relative w-full aspect-[16/10] md:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/about/dance.jpg"
                  alt="Traditional Sri Lankan dance performance"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold text-rahula-blue mb-5">Our Story</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
                <p>
                  Founded in 2001, the Rahula College Dancing Society began with a vision to preserve
                  and promote traditional Sri Lankan dance forms among the youth of Matara. What started
                  as a small group of passionate students has grown into one of the region's most
                  respected cultural institutions.
                </p>
                <p>
                  Over the past 25 years, we have trained over 1,000 students, won more than 150 awards,
                  and performed at hundreds of cultural events across Sri Lanka and internationally.
                </p>
                <p>
                  Today, we continue to uphold our founding principles while adapting our methods to engage
                  modern students. Our comprehensive curriculum covers Kandyan, Low Country, and Sabaragamuwa
                  dance traditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#f4f6fb] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-[#e8ecf8] flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-rahula-blue" />
              </div>
              <h3 className="text-xl font-extrabold text-rahula-blue mb-3">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To preserve, promote, and perpetuate traditional Sri Lankan dance forms by providing
                world-class training to young dancers, fostering cultural awareness, and creating
                opportunities for artistic expression and excellence.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-[#e8ecf8] flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-rahula-blue" />
              </div>
              <h3 className="text-xl font-extrabold text-rahula-blue mb-3">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                To be the leading institution for traditional dance education in Sri Lanka, recognized
                nationally and internationally for our commitment to cultural preservation, artistic
                excellence, and the development of culturally conscious individuals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-rahula-blue text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreValues.map((v) => (
              <div key={v.title} className="bg-[#f4f6fb] rounded-2xl p-7 border border-slate-100 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#e8ecf8] flex items-center justify-center mb-4 mx-auto">
                  {v.icon}
                </div>
                <h4 className="text-base font-extrabold text-rahula-blue mb-2">{v.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors — real teachers added by admin */}
      <InstructorsSection />

      {/* Footer accent */}
      <div className="h-4 bg-rahula-blue" />
    </div>
  );
}
