import { PageHeading, DemoNotice } from "@/components/dashboard/primitives";
import { ActionBoard } from "@/components/dashboard/ActionBoard";

export default function TeamBoardPage() {
  return (
    <>
      <PageHeading
        title="Action board"
        description="Coordinate your team's flourishing tasks. Drag cards between columns to update status."
      />
      <DemoNotice>
        Example tasks. Changes are kept in this browser session; production syncs
        across your team in real time.
      </DemoNotice>
      <ActionBoard />
    </>
  );
}
