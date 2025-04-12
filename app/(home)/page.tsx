import Header from "../components/Header";
import Search from "./components/Search";
import BookingItem from "../components/BookingItem";
import { format } from "date-fns/format";
import { ptBR } from "date-fns/locale";

export default async function Home() {
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
        <h2 className="text-xs uppercase text-gray-400 font-bold mb-3">
          Agendamentos
        </h2>
        <BookingItem />
      </div>
    </>
  );
}
