import AgencyData from '../components/tables/AgencyTable';

export default function AgenciesPage() {
  return (
    <div className="p-6">
      <h3 className="py-3 text-lg font-semibold text-gray-800 dark:text-white/90">
        Explore Federal Agencies
      </h3>
      <AgencyData />
    </div>
  );
}