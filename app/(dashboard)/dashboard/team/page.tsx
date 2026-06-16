import { PageHeading, DemoNotice } from "@/components/dashboard/primitives";
import { ActionBoard } from "@/components/dashboard/ActionBoard";
import { getTeamTasks } from "@/lib/dashboard/team";

export default async function TeamBoardPage() {
  const { isDemo, tasks } = await getTeamTasks();
  return (
    <>
      <PageHeading
        title="Action board"
        description="Coordinate your team's flourishing tasks. Drag cards between columns to update status."
      />
      {isDemo && (
        <DemoNotice>
          Example tasks. Changes are kept in this browser session; production syncs
          across your team in real time.
        </DemoNotice>
      )}
      <ActionBoard initialTasks={tasks} isDemo={isDemo} />
    </>
  );
}
