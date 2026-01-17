"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei"
import * as THREE from "three"

// --- Premium Seat for 3D ---
const ModernSeat = ({ position, number, isOccupied, isSelected, onClick }: any) => {
    const [hovered, setHovered] = useState(false)

    // Status colors
    const color = isOccupied ? "#f43f5e" : isSelected ? "#06b6d4" : "#1e293b"
    const emissive = isOccupied ? "#e11d48" : isSelected ? "#22d3ee" : "#334155"
    const glowIntensity = isOccupied ? 0.5 : isSelected ? 2 : hovered ? 0.3 : 0.05

    return (
        <group
            position={position}
            onClick={(e) => { e.stopPropagation(); if (!isOccupied) onClick(); }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Seat Support/Leg */}
            <mesh position={[0, -0.4, 0]}>
                <boxGeometry args={[0.1, 0.8, 0.1]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Main Cushion */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.85, 0.3, 0.85]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
            </mesh>

            {/* Backrest (Angled for comfort/look) */}
            <mesh position={[0, 0.65, -0.3]} rotation={[0.15, 0, 0]} castShadow>
                <boxGeometry args={[0.8, 1.2, 0.2]} />
                <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>

            {/* Headrest (Glow part) */}
            <mesh position={[0, 1.3, -0.42]}>
                <boxGeometry args={[0.5, 0.3, 0.12]} />
                <meshStandardMaterial
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={glowIntensity}
                    metalness={0.5}
                />
            </mesh>

            {/* Glowing dot for interaction */}
            {(isSelected || isOccupied) && (
                <pointLight position={[0, 0.8, 0.5]} intensity={1.5} distance={2} color={emissive} />
            )}

            <Text
                position={[0, 1.3, -0.35]}
                fontSize={0.16}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.01}
                outlineColor="black"
            >
                {number}
            </Text>
        </group>
    )
}

export const BusSeatSimulation = ({
    totalSeats = 64,
    occupiedSeats = [],
    onSeatSelect
}: any) => {
    const [mounted, setMounted] = useState(false)
    const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<"3D" | "2D">("3D")

    const rowSpacing = 2.2
    const aisleWidth = 1.6

    useEffect(() => {
        setMounted(true)
    }, [])

    const seatData = useMemo(() => {
        const seats = []
        for (let i = 0; i < totalSeats; i++) {
            const row = Math.floor(i / 4)
            const col = i % 4
            let x = (col - 1.5) * 1.0
            if (col >= 2) x += aisleWidth - 1.0
            seats.push({
                id: `${row + 1}${String.fromCharCode(65 + col)}`,
                position: [x, 0, -row * rowSpacing] as [number, number, number]
            })
        }
        return seats
    }, [totalSeats])

    if (!mounted) return <div className="h-[600px] w-full bg-slate-900 flex items-center justify-center text-white">Chargement...</div>

    return (
        <div className="w-full h-full relative bg-slate-950 overflow-hidden flex flex-col">
            {/* Header / Mode Switcher */}
            <div className={`${viewMode === "3D" ? "absolute top-3 left-3" : "relative pt-3 px-3 pb-1"} z-10 flex-shrink-0`}>
                <h2 className="text-[8px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Zone de sélection</h2>
                <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg backdrop-blur-md border border-white/10 w-fit">
                    <button
                        onClick={() => setViewMode("3D")}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${viewMode === "3D" ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-white hover:bg-white/5"}`}
                    >
                        Vue 3D
                    </button>
                    <button
                        onClick={() => setViewMode("2D")}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${viewMode === "2D" ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-white hover:bg-white/5"}`}
                    >
                        Vue 2D (Secours)
                    </button>
                </div>
            </div>

            {viewMode === "3D" ? (
                <Canvas shadows dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[12, 8, 16]} fov={35} />
                    <OrbitControls makeDefault enableDamping minDistance={5} maxDistance={40} />

                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
                    <pointLight position={[-10, 5, -10]} intensity={2} color="#3b82f6" />
                    <pointLight position={[10, 5, 10]} intensity={1} color="#06b6d4" />

                    <group position={[0, -1, 0]}>
                        {/* Technical Floor with Grid */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                            <planeGeometry args={[20, 100]} />
                            <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} />
                        </mesh>

                        {/* Aisle Path Glow */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                            <planeGeometry args={[1.5, 100]} />
                            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.2} transparent opacity={0.3} />
                        </mesh>

                        {/* SUBTLE BUS FRAME (CHASSIS) */}
                        <mesh position={[0, 2, -15]}>
                            <boxGeometry args={[8.5, 5, 80]} />
                            <meshStandardMaterial
                                color="#0ea5e9"
                                transparent
                                opacity={0.03}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                        <mesh position={[0, 2, -15]}>
                            <boxGeometry args={[8.6, 5.1, 80.1]} />
                            <meshStandardMaterial color="#06b6d4" transparent opacity={0.08} wireframe />
                        </mesh>

                        {seatData.map((seat) => (
                            <ModernSeat
                                key={seat.id}
                                number={seat.id}
                                position={seat.position}
                                isOccupied={occupiedSeats.includes(seat.id)}
                                isSelected={selectedSeat === seat.id}
                                onClick={() => {
                                    setSelectedSeat(seat.id)
                                    onSeatSelect?.(seat.id)
                                }}
                            />
                        ))}
                    </group>
                </Canvas>
            ) : (
                <div className="flex-1 w-full flex flex-col items-center justify-start p-2 sm:p-4 overflow-y-auto bg-slate-900 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-xs mx-auto pt-2 pb-12">
                        {seatData.map((seat) => {
                            const isOccupied = occupiedSeats.includes(seat.id)
                            const isSelected = selectedSeat === seat.id
                            return (
                                <button
                                    key={seat.id}
                                    disabled={isOccupied}
                                    onClick={() => {
                                        setSelectedSeat(seat.id)
                                        onSeatSelect?.(seat.id)
                                    }}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${isOccupied ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 cursor-not-allowed" :
                                        isSelected ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-110" :
                                            "bg-slate-800 text-slate-400 border border-white/5 hover:border-cyan-500/50"
                                        }`}
                                >
                                    {seat.id}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
