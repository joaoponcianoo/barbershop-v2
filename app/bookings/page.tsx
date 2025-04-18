import { getServerSession } from "next-auth";
import Header from "../components/Header";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "../lib/prisma";
import BookingItem from "../components/BookingItem";
import { isFuture, isPast } from "date-fns";

const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const bookings = await db.bookings.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      service: true,
      barbershop: true,
    },
  });

  const finalizedBookings = bookings.filter((booking) =>
    isFuture(booking.date)
  );
  const confirmedBookings = bookings.filter((booking) => isPast(booking.date));

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        <h2 className="text-gray-400 uppercase font-bold text-sm mt-5 mb-3">
          Confirmados
        </h2>
        <div className="flex flex-col gap-3">
          {finalizedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>

        <h2 className="text-gray-400 uppercase font-bold text-sm mt-5 mb-3">
          Finalizados
        </h2>
        <div className="flex flex-col gap-3">
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </>
  );
};

export default BookingsPage;
