import { PageHeading, DemoNotice } from "@/components/dashboard/primitives";
import { ReflectionEditor } from "@/components/forms/ReflectionEditor";
import { getTeacherReflections } from "@/lib/dashboard/teacher";

export default async function ReflectionsPage() {
  const { isDemo, entries } = await getTeacherReflections();
  return (
    <>
      <PageHeading
        title="Reflection journal"
        description="A private space to notice what's working and what to try next."
      />
      {isDemo && (
        <DemoNotice>
          In production, reflections save to your private account. Here they&apos;re
          kept only for this browser session.
        </DemoNotice>
      )}
      <ReflectionEditor initialEntries={entries} isDemo={isDemo} />
    </>
  );
}
