import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Layers3, MoonStar } from 'lucide-react';
import FeatureCard from '../components/FeatureCard.tsx';
import ThemeSelector from '../components/ThemeSelector.tsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const Landing: React.FC = () => {
  return (
    <div className="relative bg-slate-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="absolute top-6 right-6 z-10">
        <ThemeSelector />
      </div>
      <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <motion.div
          className="flex flex-col items-center space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            Asiya To-Do List
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mt-2">
              Stay organized. Achieve more.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-xl text-lg md:text-xl text-slate-600 dark:text-slate-300">
            The simplest way to manage tasks, plan your day, and focus on what truly matters.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link to="/app">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30 transition-transform duration-200 ease-in-out"
              >
                Open My Day &rarr;
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-4xl w-full"
          >
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Clock size={28} className="text-blue-400" />}
                title="Smart Daily Planning"
                description="AI-powered suggestions to help you focus on your most important tasks for the day."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<Layers3 size={28} className="text-purple-400" />}
                title="Categorized Tasks"
                description="Organize your life with custom lists for work, personal projects, and everything in between."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<MoonStar size={28} className="text-indigo-400" />}
                title="Sleek Dark Mode"
                description="A beautiful, eye-friendly interface that helps you stay focused, day or night."
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
