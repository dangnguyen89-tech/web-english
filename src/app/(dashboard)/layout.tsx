import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <DashboardShell
      userLabel={session.user.name ?? session.user.email ?? "User"}
      signOutAction={handleSignOut}
    >
      {children}
    </DashboardShell>
  );
}
