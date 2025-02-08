"use client";

import PipelineTable from "./_components/pipelineTable";
const Page = () => {
  return (
    <div className="overflow-y-auto w-full h-full flex-1   flex flex-col">
      <PipelineTable />
    </div>
  );
};

export default Page;
