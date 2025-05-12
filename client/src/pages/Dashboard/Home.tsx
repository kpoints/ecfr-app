import CorrectionsTracker from "../../components/corrections/CorrectionsTracker";
import CorrectionsAnalysis from "../../components/corrections/CorrectionsAnalysis";
import TitleData from "../../components/title-tables/TitleTable";
import AgencyData from "../../components/tables/AgencyTable";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js eCFR Dashboard "
        description="This is React.js Dashboard for querying data from eCFR"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-6">
          <CorrectionsTracker />
        </div>
        
        <div className="col-span-12 xl:col-span-6">
          <CorrectionsAnalysis />
        </div>

        <div className="col-span-12">
          <TitleData />
        </div>

        <div className="col-span-12">
          <AgencyData />
        </div>

      </div>
    </>
  );
}
