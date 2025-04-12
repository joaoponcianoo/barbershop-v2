"use client";

import {
  Calendar1Icon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Button } from "./ui/button";

const SideMenu = () => {
  const { data } = useSession();

  const handleLogoutClick = () => signOut();
  const handleLoginClick = () => signIn("google");

  return (
    <>
      <SheetHeader className="border-b border-solid border-secondary p-5">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      {data?.user ? (
        <div className="flex justify-between items-center px-5 py-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={data.user?.image || ""}
                alt="User profile picture"
              />
            </Avatar>
            <h2 className="font-bold">{data.user?.name}</h2>
          </div>
          <Button onClick={handleLogoutClick} size="icon" variant="outline">
            <LogOutIcon />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <UserIcon size={32} />
            <h2 className="font-bold">Olá, faça seu login!</h2>
          </div>
          <Button
            onClick={handleLoginClick}
            className="bg-primary w-full justify-start"
          >
            <LogInIcon className="mr-2" />
            Fazer Login
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 px-5">
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/">
              <HomeIcon size={18} className="mr-2" />
              Início
            </Link>
          </Button>
        </div>

        {data?.user && (
          <div className="flex flex-col gap-3 px-5">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/bookings">
                <Calendar1Icon size={18} className="mr-2" />
                Agendamentos
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default SideMenu;
