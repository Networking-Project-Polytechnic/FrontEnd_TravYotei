"use client";

import Link from "next/link";
import { FaBuilding, FaTicketAlt, FaBoxOpen } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-row items-start px-20 pb-60 w-full min-h-screen">

      {/* SECTION GAUCHE */}
      <div className="flex flex-col w-1/2 space-y-12 mt-[30vh]">
        <h1 className="text-[70px] font-extrabold leading-tight text-white neon-text drop-shadow-2xl">
          The <span className="text-blue-400">smart</span> bus travel <br />
          platform that <span className="text-purple-400">connects</span> <br />
          agencies and travelers.
        </h1>

        <p className="text-[28px] text-black font-black leading-snug max-w-xl">
          TravYotei empowers bus travel agencies to plan routes, sell tickets and track packages in real-time, 
          while travelers book and follow their journey easily.
        </p>
      </div>

      {/* SECTION DROITE : items-end pour coller à droite, pr-10 pour ajuster le bord */}
      <div className="w-1/2 flex flex-col items-end space-y-24 mt-[45vh] pr-10">
        
        {/* AGENCIES CARD */}
        <Link
          href="/agencies"
          className="group w-72 h-72 bg-white rounded-[45px] flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-black"
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-gray-100 mb-6">
            <FaBuilding className="text-black text-5xl" />
          </div>
          <h3 className="text-3xl font-black text-black uppercase tracking-tighter">
            Agencies
          </h3>
        </Link>

        {/* BOOK A TICKET CARD */}
        <Link
          href="/booking"
          className="group w-72 h-72 bg-white rounded-[45px] flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-black"
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-gray-100 mb-6">
            <FaTicketAlt className="text-black text-5xl" />
          </div>
          <h3 className="text-3xl font-black text-black uppercase tracking-tighter">
            Book a ticket
          </h3>
        </Link>

        {/* TRACK A PACKAGE CARD */}
        <Link
          href="/track"
          className="group w-72 h-72 bg-white rounded-[45px] flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-black"
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-gray-100 mb-6">
            <FaBoxOpen className="text-black text-5xl" />
          </div>
          <h3 className="text-3xl font-black text-black uppercase leading-tight tracking-tighter">
            Track <br/> Package
          </h3>
        </Link>

      </div>
    </div>
  );
}








