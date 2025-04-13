import { db } from "@/app/lib/prisma";
import BarbershopInfo from "./components/BarbershopInfo";
import ServiceItem from "./components/ServiceItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  };
}

const BarbershopDetailsPage = async ({
  params,
}: BarbershopDetailsPageProps) => {
  const session = await getServerSession(authOptions);
  const barbershop = await db.barbershops.findUnique({
    where: {
      id: params.id,
    },
  });
  const barbershopServices = await db.barbershopServices.findMany({
    where: {
      barbershopId: params.id,
    },
  });

  return (
    <div>
      {barbershop && <BarbershopInfo barbershop={barbershop} />}
      <div className="flex flex-col gap-4 mt-4 px-5 ">
        {barbershop &&
          barbershopServices.map((service) => (
            <ServiceItem
              key={service.id}
              service={service}
              barbershop={barbershop}
              isAuthenticated={!!session?.user}
            />
          ))}
      </div>
    </div>
  );
};

export default BarbershopDetailsPage;
