"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface SaveBookingParams {
  barbershopId: string;
  serviceId: string;
  userId: string;
  date: Date;
}

export const saveBooking = async (params: SaveBookingParams) => {
  await db.bookings.create({
    data: {
      barbershopId: params.barbershopId,
      serviceId: params.serviceId,
      userId: params.userId,
      date: params.date,
    },
  });

  revalidatePath("/");
  revalidatePath("/bookings");
};
