export const dynamic = "force-dynamic";

import { Suspense } from "react";
import LessonDetailsClient from "./LessonDetailsClient";

export default async function LessonDetailsPage({ params }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-amber-50/30">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LessonDetailsClient lessonId={id} />
    </Suspense>
  );
}
