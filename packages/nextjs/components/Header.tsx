"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import User from "./hyperharvest/User";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Transfer",
    href: "/transfer",
  },
  {
    label: "Harvest",
    href: "/harvest",
  },
  {
    label: "Docs",
    href: "https://eth-harvest.gitbook.io/hyperharvest/overview/introduction/project-overview",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        const isExternal = href.startsWith("http");
        return (
          <li key={href}>
            {isExternal ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isActive ? "bg-[#ac8d2c] shadow-md" : ""
                } hover:bg-[#f9d569] hover:shadow-md focus:!bg-[#ac8d2c] active:!text-neutral py-1.5 px-3 text-sm rounded-xl gap-2 grid grid-flow-col`}
              >
                {icon}
                <span>{label}</span>
              </a>
            ) : (
              <Link
                href={href}
                passHref
                className={`${
                  isActive ? "bg-[#ac8d2c] shadow-md" : ""
                } hover:bg-[#f9d569] hover:shadow-md focus:!bg-[#ac8d2c] active:!text-neutral py-1.5 px-3 text-sm rounded-xl gap-2 grid grid-flow-col`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            )}
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-sm shadow-gray-400 px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            {/* <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" /> */}
          </div>
          <div className="flex flex-col">
            <span className="font-bold uppercase text-xl tracking-widest">HyperHarvest</span>
            {/* <span className="text-xs">Cross-chain yield farm</span> */}
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-60 gap-10">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex mr-4 items-center ">
        <User />
      </div>
    </div>
  );
};
