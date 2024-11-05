import { useEffect } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";

import { appCommon } from "../common/app";
import { getLocalDateString } from "../common/time";
import library from "../database/library";
import { IJob } from "../database/job";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { setJobs } from "../redux/jobs-reducer";
import { setCurrentJobId } from "../redux/navigator-reducer";

// Record the previous page offset to scroll back to the same position
let prevPageOffset = 0;

function JobEntity({ job }: { job: IJob }) {
  const dispatch = useAppDispatch();

  const date = new Date(job.updatedAt);
  const dateStr = getLocalDateString(date);

  const thumbnail = convertFileSrc(appCommon.getImagePath(job.filename));
  return (
    <div className="bg-slate-50 rounded-xl hover:shadow-md hover:shadow-blue-500/50">
      <div className="flex flex-col items-center">
        <img
          className="h-auto w-auto cursor-pointer"
          src={thumbnail}
          onClick={() => {
            prevPageOffset = window.scrollY;
            dispatch(setCurrentJobId(job.id));
          }}
        />
        <div className="my-3 ml-5 w-full text-sm text-sky-900 text-left">
          {dateStr}
        </div>
      </div>
    </div>
  );
}

export default function JobList() {
  const jobs = useAppSelector((state) => state.jobs.entities);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function run() {
      const jobs = await library.getJobs();
      dispatch(setJobs(jobs));
    }
    run();
  }, [dispatch]);

  const jobsList = [...jobs]
    .reverse()
    .map((job, index) => <JobEntity key={index} job={job} />);

  window.scrollTo(0, prevPageOffset);

  return <div className="grid grid-cols-2 gap-4 mt-4 px-5">{jobsList}</div>;
}
