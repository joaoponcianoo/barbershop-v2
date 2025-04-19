"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export const cancelBooking = async (bookingId: string) => {
  await db.bookings.delete({
    where: { id: bookingId },
  });

  revalidatePath("/");
  revalidatePath("/bookings");
};
