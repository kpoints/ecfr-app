import TitleData from '../components/title-tables/TitleTable';

export default function TitlesPage() {
  return (
    <div className="p-6">
      <h3 className="py-3 text-lg font-semibold text-gray-800 dark:text-white/90">
        Browse eCFR Titles
      </h3>
      <TitleData />
    </div>
  );
}