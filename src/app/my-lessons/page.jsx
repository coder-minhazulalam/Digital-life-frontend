import { redirect } from "next/navigation";

export default function MyLessonsRedirect() {
  redirect("/dashboard/my-lessons");
}
