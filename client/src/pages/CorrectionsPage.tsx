import CorrectionsAnalysis from "../components/corrections/CorrectionsAnalysis";

export default function CorrectionsAnalyais() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        All eCFR Titles
      </h3>
      <CorrectionsAnalysis />
    </div>
  );
}