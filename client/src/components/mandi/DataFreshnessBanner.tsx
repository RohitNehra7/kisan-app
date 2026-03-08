import React from 'react';
import { useTranslation } from 'react-i18next';

interface DataFreshnessBannerProps {
  arrivalDate: string | null; // From API (e.g. "08/03/2026")
}

const DataFreshnessBanner: React.FC<DataFreshnessBannerProps> = ({ arrivalDate }) => {
  const { t } = useTranslation();

  if (!arrivalDate) {
    return (
      <div className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
        {t('freshness.loading')}
      </div>
    );
  }

  const getDaysOld = (dateStr: string): number => {
    try {
      const [day, month, year] = dateStr.split('/').map(Number);
      const arrival = new Date(year, month - 1, day);
      arrival.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const diffTime = today.getTime() - arrival.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } catch (e) {
      return 999;
    }
  };

  const daysOld = getDaysOld(arrivalDate);

  let badgeColor = 'bg-emerald-100 text-emerald-700 border-emerald-200';
  let label = t('freshness.today');

  if (daysOld === 1) {
    badgeColor = 'bg-amber-100 text-amber-700 border-amber-200';
    label = t('freshness.yesterday');
  } else if (daysOld >= 2) {
    badgeColor = 'bg-red-100 text-red-700 border-red-200';
    label = t('freshness.stale', { days: daysOld });
  }

  return (
    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 mb-4 w-fit ${badgeColor}`}>
      <span className={`w-2 h-2 rounded-full ${daysOld === 0 ? 'bg-emerald-500 animate-pulse' : daysOld === 1 ? 'bg-amber-500' : 'bg-red-500'}`} />
      {label}
    </div>
  );
};

export default DataFreshnessBanner;
