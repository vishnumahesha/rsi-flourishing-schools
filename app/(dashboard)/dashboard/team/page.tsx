import { PageHeading, DemoNotice } from "@/components/dashboard/primitives";
import { ActionBoard } from "@/components/dashboard/ActionBoard";
import { getTeamTasks } from "@/lib/dashboard/team";

export default async function TeamBoardPage() {
  const { isDemo, tasks } = await getTeamTasks();
  return (
    <>
      <PageHeading
        title="Action board"
        description="Coordinate your team's flourishing tasks. Move cards between columns or use the status selector on each card."
      />
      {isDemo && (
        <DemoNotice>
          Showing example tasks. Connect your school account to persist changes for your whole team.
        </DemoNotice>
      )}
      <ActionBoard initialTasks={tasks} isDemo={isDemo} />
    </>
  );
}
