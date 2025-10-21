import React, { useState, useEffect } from 'react';
import ScrollAnimation, { AnimateGroup } from '../Animation/ScrollAnimation';
import { motion } from 'framer-motion';

// Importer les icônes nécessaires
import {
  FiActivity,
  FiCode,
  FiLayers,
  FiSettings,
  FiArrowDown,
  FiStar,
} from 'react-icons/fi';

const ModernHomepage: React.FC = () => {
  const [scrollY, setScrollY] = useState<number>(0);

  // Effet pour détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Section Hero avec effet de parallaxe
  const Hero = () => (
    <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom right, #273469, #1E2749)`,
          opacity: 1 - Math.min(scrollY / 900, 0.6),
          y: scrollY * 0.2,
        }}
      />

      <ScrollAnimation
        variant="fade"
        className="z-10 px-6"
        duration={1}
        delay={0.2}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Connectez Vos <span className="text-[#E4D9FF]">Services</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
          Créez des automatisations puissantes entre tous vos services préférés
          sans écrire une ligne de code.
        </p>
      </ScrollAnimation>

      <ScrollAnimation variant="slide-up" className="z-10 mt-12" delay={0.6}>
        <motion.button
          className="bg-[#E4D9FF] hover:bg-[#d8c9ff] text-[#1E2749] font-bold py-3 px-8 rounded-full flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Commencer <FiArrowDown className="ml-2" />
        </motion.button>
      </ScrollAnimation>

      {/* Vagues en bas */}
      <motion.div
        className="absolute bottom-0 w-full"
        style={{ y: scrollY * 0.1 }}
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="#FAFAFF"
          />
        </svg>
      </motion.div>
    </section>
  );

  // Section Services
  const Services = () => {
    const services = [
      {
        icon: <FiCode className="w-6 h-6" />,
        title: 'Intégrations API',
        description:
          'Connectez facilement vos services préférés grâce à nos intégrations API pré-configurées.',
      },
      {
        icon: <FiActivity className="w-6 h-6" />,
        title: 'Automatisations',
        description:
          "Créez des flux de travail personnalisés qui s'exécutent automatiquement quand vous le souhaitez.",
      },
      {
        icon: <FiLayers className="w-6 h-6" />,
        title: 'Workflows',
        description:
          'Combinez plusieurs services dans un flux de travail puissant et sans friction.',
      },
      {
        icon: <FiSettings className="w-6 h-6" />,
        title: 'Personnalisation',
        description:
          'Configurez chaque détail pour que vos automatisations répondent parfaitement à vos besoins.',
      },
    ];

    return (
      <section className="bg-[#FAFAFF] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation variant="slide-up" className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#1E2749]">
              Une plateforme, des possibilités infinies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez tout ce que vous pouvez accomplir avec notre plateforme
              d&apos;automatisation
            </p>
          </ScrollAnimation>

          <AnimateGroup
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            staggerDelay={0.15}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="bg-[#E4D9FF]/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 text-[#273469]">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1E2749]">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </AnimateGroup>
        </div>
      </section>
    );
  };

  // Section Comment ça marche
  const HowItWorks = () => {
    const steps = [
      {
        number: '01',
        title: 'Choisissez vos services',
        description:
          'Sélectionnez parmi plus de 100 services disponibles dans notre catalogue.',
      },
      {
        number: '02',
        title: 'Configurez vos déclencheurs',
        description:
          'Définissez quand et comment vos automatisations doivent se déclencher.',
      },
      {
        number: '03',
        title: 'Ajoutez vos actions',
        description:
          'Choisissez ce qui se passe lorsque votre déclencheur est activé.',
      },
      {
        number: '04',
        title: 'Activez votre applet',
        description:
          'Lancez votre automatisation et observez-la fonctionner sans effort.',
      },
    ];

    return (
      <section className="bg-[#273469] py-24 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation variant="fade" className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Créez votre première automatisation en quelques minutes seulement
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Ligne de connexion */}
            <div className="hidden lg:block absolute top-1/3 left-0 right-0 h-0.5 bg-[#E4D9FF]/30" />

            {steps.map((step, index) => (
              <ScrollAnimation
                key={index}
                variant="slide-up"
                delay={index * 0.1}
                className="relative z-10"
              >
                <div className="mb-6">
                  <span className="bg-[#E4D9FF] text-[#1E2749] text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Section Témoignages
  const Testimonials = () => {
    const testimonials = [
      {
        quote:
          'Cette plateforme a complètement transformé mon flux de travail. Je gagne des heures chaque semaine.',
        author: 'Marie Dufour',
        title: 'Designer Produit',
      },
      {
        quote:
          'Simple, puissant et incroyablement flexible. Exactement ce dont notre équipe avait besoin.',
        author: 'Thomas Laurent',
        title: 'Développeur Senior',
      },
      {
        quote:
          "L'automatisation parfaite pour les non-techniciens. Je peux enfin créer mes propres workflows.",
        author: 'Sophie Martin',
        title: 'Responsable Marketing',
      },
    ];

    return (
      <section className="bg-[#FAFAFF] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation variant="slide-up" className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#1E2749]">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment notre plateforme aide les professionnels à
              optimiser leur travail
            </p>
          </ScrollAnimation>

          <AnimateGroup
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            staggerDelay={0.2}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="mb-6 text-[#E4D9FF]">
                  <FiStar className="inline w-6 h-6 mr-1" />
                  <FiStar className="inline w-6 h-6 mr-1" />
                  <FiStar className="inline w-6 h-6 mr-1" />
                  <FiStar className="inline w-6 h-6 mr-1" />
                  <FiStar className="inline w-6 h-6" />
                </div>
                <p className="text-gray-800 mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-bold text-[#1E2749]">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-600 text-sm">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </AnimateGroup>
        </div>
      </section>
    );
  };

  // Section CTA (Call To Action)
  const CallToAction = () => (
    <section className="bg-gradient-to-br from-[#273469] to-[#1E2749] py-24 px-6 text-white">
      <ScrollAnimation variant="fade" className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Prêt à automatiser votre flux de travail&nbsp;?
        </h2>
        <p className="text-xl text-white/80 mb-10">
          Rejoignez des milliers d&apos;utilisateurs qui économisent du temps et
          augmentent leur productivité.
        </p>
        <motion.button
          className="bg-[#E4D9FF] hover:bg-white text-[#1E2749] font-bold py-3 px-8 rounded-full text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Commencer gratuitement
        </motion.button>
      </ScrollAnimation>
    </section>
  );

  return (
    <div className="w-full overflow-x-hidden">
      <Hero />
      <Services />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default ModernHomepage;
