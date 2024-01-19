import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { checkRole } from "@/lib/utils/roles";
import SearchUsers from "@/components/admin/SearchUsers";
import { setRole } from "@/app/(admin)/actions";

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  const ADMIN_ROLE = "admin";
  const { sessionClaims } = auth();

  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = params.searchParams.search;
  const users = query ? await clerkClient.users.getUserList({ query }) : [];

  return (
    <div className={"flex flex-col"}>
      <h1>This is the admin dashboard</h1>
      <p>
        This page is restricted to users with the &apos;{ADMIN_ROLE}&apos; role.
      </p>

      <SearchUsers />

      {users.map((user) => {
        return (
          <div key={user.id}>
            <div>
              {user.firstName} {user.lastName}
            </div>
            <div>
              {
                user.emailAddresses.find(
                  (email) => email.id === user.primaryEmailAddressId,
                )?.emailAddress
              }
            </div>
            <div>{user.publicMetadata.role as string}</div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="admin" name="role" />
                <button type="submit">Make Admin</button>
              </form>
            </div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="moderator" name="role" />
                <button type="submit">Make Moderator</button>
              </form>
            </div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="end-user" name="role" />
                <button type="submit">Make End-User</button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
