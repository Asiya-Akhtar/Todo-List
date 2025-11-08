
import React from 'react';
import { getMyDayDate } from '../lib/dates';

const MyDayBanner: React.FC = () => {
  const dateString = getMyDayDate();

  return (
    <div className="relative h-[220px] rounded-3xl overflow-hidden mb-6 shadow-lg">
      <img src="https://picsum.photos/seed/landscape/1200/440" alt="Landscape" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent"></div>
      <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
        <h1 className="text-4xl font-bold">My Day</h1>
        <p className="text-lg opacity-90">{dateString}</p>
      </div>
    </div>
  );
};

export default MyDayBanner;
