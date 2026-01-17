'use client';

import { useState } from 'react';
import { Bus } from 'lucide-react';

// MAPPING DES LOGOS PAR AGENCE
export const AGENCY_LOGO_MAP: Record<string, string> = {
    "Buca Voyages": "/images/agencies/logos/logobuca.jpeg",
    "Cerise Voyage": "/images/agencies/logos/logocerises.jpeg",
    "Charter Voyages": "/images/agencies/logos/logocharter.jpeg",
    "Finex Voyages": "/images/agencies/logos/logofinex.jpeg",
    "Garanti Voyage": "/images/agencies/logos/logogaranti.jpeg",
    "General Voyage": "/images/agencies/logos/logogeneral.jpeg",
    "Leader Voyage": "/images/agencies/logos/logoleader.png",
    "Men Travel Voyage": "/images/agencies/logos/logomen.jpeg",
    "Parklane Voyages": "/images/agencies/logos/logoparklane.png",
    "Touristique Voyages": "/images/agencies/logos/logotouristique.jpeg",
    "Transvoyages": "/images/agencies/logos/logotrans.png",
    "United Voyages": "/images/agencies/logos/logounited.jpeg",

    // Aliases
    "Buca": "/images/agencies/logos/logobuca.jpeg",
    "Cerise": "/images/agencies/logos/logocerises.jpeg",
    "Charter": "/images/agencies/logos/logocharter.jpeg",
    "Finex": "/images/agencies/logos/logofinex.jpeg",
    "Garanti": "/images/agencies/logos/logogaranti.jpeg",
    "General": "/images/agencies/logos/logogeneral.jpeg",
    "Leader": "/images/agencies/logos/logoleader.png",
    "Men Travel": "/images/agencies/logos/logomen.jpeg",
    "Parklane": "/images/agencies/logos/logoparklane.png",
    "Touristique": "/images/agencies/logos/logotouristique.jpeg",
    "Trans": "/images/agencies/logos/logotrans.png",
    "United": "/images/agencies/logos/logounited.jpeg",
    "Amour Mezam": "/images/agencies/logos/logoamour.jpeg", // Added if possible
    "Guarantee": "/images/agencies/logos/logogaranti.jpeg", // Matches Guarantee Express
};

// Fonction pour obtenir le logo d'une agence
export const getAgencyLogo = (agencyName: string): string | null => {
    if (!agencyName) return null;

    const name = agencyName.toLowerCase().trim();

    // Cherche une correspondance exacte
    for (const [key, logoPath] of Object.entries(AGENCY_LOGO_MAP)) {
        if (name === key.toLowerCase()) {
            return logoPath;
        }
    }

    // Cherche une correspondance partielle
    for (const [key, logoPath] of Object.entries(AGENCY_LOGO_MAP)) {
        if (name.includes(key.toLowerCase()) || key.toLowerCase().includes(name)) {
            return logoPath;
        }
    }

    // Cherche par mot clé
    const keywords: Record<string, string> = {
        'buca': '/images/agencies/logos/logobuca.jpeg',
        'cerise': '/images/agencies/logos/logocerises.jpeg',
        'charter': '/images/agencies/logos/logocharter.jpeg',
        'finex': '/images/agencies/logos/logofinex.jpeg',
        'garanti': '/images/agencies/logos/logogaranti.jpeg',
        'guarantee': '/images/agencies/logos/logogaranti.jpeg',
        'general': '/images/agencies/logos/logogeneral.jpeg',
        'leader': '/images/agencies/logos/logoleader.png',
        'men': '/images/agencies/logos/logomen.jpeg',
        'parklane': '/images/agencies/logos/logoparklane.png',
        'touristique': '/images/agencies/logos/logotouristique.jpeg',
        'trans': '/images/agencies/logos/logotrans.png',
        'united': '/images/agencies/logos/logounited.jpeg',
        'amour': '/images/agencies/logos/logoamour.jpeg',
    };

    for (const [keyword, logoPath] of Object.entries(keywords)) {
        if (name.includes(keyword)) {
            return logoPath;
        }
    }

    return null;
};

interface AgencyLogoProps {
    agencyName: string;
    className?: string;
    fallbackClassName?: string;
}

export const AgencyLogo = ({
    agencyName,
    className = "",
    fallbackClassName = "bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center"
}: AgencyLogoProps) => {
    const [imageError, setImageError] = useState(false);
    const logoPath = getAgencyLogo(agencyName);

    if (!logoPath || imageError) {
        return (
            <div className={`${className} ${fallbackClassName}`}>
                <Bus className="h-6 w-6 text-white" />
            </div>
        );
    }

    return (
        <img
            src={logoPath}
            alt={`Logo ${agencyName}`}
            className={`${className} object-cover`}
            onError={() => setImageError(true)}
        />
    );
};
