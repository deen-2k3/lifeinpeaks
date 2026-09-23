import { AdminHeader } from "@/components/admin/form";
import { TripForm } from "../TripForm";

export default function NewTrip() {
  return (
    <>
      <AdminHeader title="New trip" />
      <TripForm />
    </>
  );
}
