import { PageHeading, DemoNotice } from "@/components/dashboard/primitives";
import { ReflectionEditor } from "@/components/forms/ReflectionEditor";

export default function ReflectionsPage() {
  return (
    <>
      <PageHeading
        title="Reflection journal"
        description="A private space to notice what's working and what to try next."
      />
      <DemoNotice>
        In production, reflections save to your private account. Here they&apos;re
        kept only for this browser session.
      </DemoNotice>
      <ReflectionEditor />
    </>
  );
}
