import Link from "next/link";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs";
import { checkRole } from "@/lib/utils";
import SearchUsers from "@/components/admin/SearchUsers";
import { setRole } from "@/app/(admin)/actions";
import { Button } from "@nextui-org/react";

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = params.searchParams.search;
  const users = query ? await clerkClient.users.getUserList({ query }) : [];

  return (
    <div className={"wrapper"}>
      <h1 className={"text-large"}>Admin Dashboard</h1>
      <hr />
      <h1>Set Permission Rights</h1>
      <div className="flex ">
        <SearchUsers />
        <div>
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
                <hr />
              </div>
            );
          })}
        </div>
      </div>

      <hr />
      <h1>Events</h1>
      <h3>Add Event Images</h3>
      <p>insert form here</p>
      {/*      <FormField
        control={form.control}
        name="imgLarge"
        render={({ field }) => (
          <FormItem className="w-full">
            <Label>Large Image: 940 x 470</Label>
            <FormControl className="h-72">
              <FileUpload
                imageUrl={field.value}
                onFieldChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="imgThumbnail"
        render={({ field }) => (
          <FormItem className="w-full">
            <Label>Small Image: 50 x 25</Label>
            <FormControl className="h-72">
              <FileUpload
                imageUrl={field.value}
                onFieldChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />*/}
      <h3>Create Event</h3>
      <Link href={"/events/create"}>
        <Button color="primary">Create Event </Button>
      </Link>
    </div>
  );
}
