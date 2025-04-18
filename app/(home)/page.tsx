import Header from "../components/Header";
import Search from "./components/Search";
import BookingItem from "../components/BookingItem";
import BarbershopItem from "./components/BarbershopItem";
import format from "date-fns/format";
import { ptBR } from "date-fns/locale";
import { db } from "../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershops, confirmedBookings] = await Promise.all([
    db.barbershops.findMany({}),
    session?.user
      ? await db.bookings.findMany({
          where: {
            userId: session.user.id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            barbershop: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <>
      <Header />

      <div className="px-5 pt-6">
        <h2 className="text-xl font-bold">Olá, João!</h2>
        <p className="text-sm capitalize">
          {format(new Date(), "EEEE',' dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <div className="mt-6 px-5">
        <Search />
      </div>

      <div className="mt-6 px-5">
        <h2 className="text-sm uppercase text-gray-400 font-bold mb-3">
          Agendamentos
        </h2>
        <div className="flex gap-3 ">
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>

      <div className="mt-6 px-5">
        <h2 className="text-xs uppercase text-gray-400 font-bold mb-3">
          Recomendados
        </h2>

        <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </>
  );
}
