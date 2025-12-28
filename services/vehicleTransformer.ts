import { Vehicle, WizardBrand, WizardModel, WizardYear } from '../types';

// --- ASSET REGISTRY ---
// Maps normalized (lowercase) keys to assets to preserve the high-quality visuals
// while allowing the data to be dynamic.

const BRAND_ASSETS: Record<string, { logo: string, color: string }> = {
    'bmw': {
        logo: "/brands/bmw.svg",
        color: "bg-blue-600"
    },
    'toyota': {
        logo: "/brands/toyota.svg",
        color: "bg-red-600"
    },
    'honda': {
        logo: "/brands/honda.svg",
        color: "bg-neutral-800"
    },
    'nissan': {
        logo: "/brands/nissan.svg",
        color: "bg-neutral-900"
    },
    'mitsubishi': {
        logo: "/brands/mitsubishi.svg",
        color: "bg-red-700"
    },
    'suzuki': {
        logo: "/brands/suzuki.svg",
        color: "bg-blue-500"
    },
    'kia': {
        logo: "/brands/kia.svg",
        color: "bg-red-600"
    },
    'micro': {
        logo: "/brands/micro.png",
        color: "bg-orange-500"
    },
    'mercedes': {
        logo: "/brands/mercedes.svg",
        color: "bg-neutral-800"
    },
    'audi': {
        logo: "/brands/audi.svg",
        color: "bg-black"
    },
    'mazda': {
        logo: "/brands/mazda.svg",
        color: "bg-neutral-800"
    },
    'hyundai': {
        logo: "/brands/hyundai.svg",
        color: "bg-blue-800"
    },
    'ford': {
        logo: "/brands/ford.svg",
        color: "bg-blue-600"
    },
    'land rover': {
        logo: "/brands/land_rover.png",
        color: "bg-green-800"
    },
    'isuzu': {
        logo: "/brands/isuzu.svg",
        color: "bg-red-600"
    },
    'subaru': {
        logo: "/brands/subaru.svg",
        color: "bg-blue-700"
    },
    'lexus': {
        logo: "/brands/lexus.svg",
        color: "bg-neutral-800"
    }
};

const MODEL_IMAGES: Record<string, string> = {
    // BMW
    'bmw_3 series': "https://www.bmw.lk/content/dam/bmw/common/all-models/3-series/sedan/2022/navigation/bmw-3-series-sedan-lci-modelfinder.png",
    'bmw_5 series': "https://www.bmw.lk/content/dam/bmw/common/all-models/5-series/sedan/2020/navigation/bmw-5-series-sedan-modelfinder.png",
    'bmw_x5': "https://www.bmw.lk/content/dam/bmw/common/all-models/x-series/x5/2023/navigation/bmw-x5-modelfinder.png",

    // Toyota
    'toyota_corolla': "https://global.toyota/pages/models/images/corolla/corolla/001_m.jpg",
    'toyota_land cruiser': "https://global.toyota/pages/models/images/landcruiser/landcruiser/001_m.jpg",
    'toyota_land cruiser prado': "https://global.toyota/pages/models/images/landcruiser/landcruiser/001_m.jpg",
    'toyota_hilux': "https://global.toyota/pages/models/images/hilux/hilux/001_m.jpg",
    'toyota_premio': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Toyota_Premio_2.0G_Superior_package_%28DBA-ZRT261%29_front.jpg/640px-Toyota_Premio_2.0G_Superior_package_%28DBA-ZRT261%29_front.jpg",
    'toyota_allion': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Toyota_Allion_A26_01.jpg/640px-Toyota_Allion_A26_01.jpg",
    'toyota_axio': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Toyota_Corolla_Axio_Hybrid_G_%28DAA-NKE165%29_front.jpg/640px-Toyota_Corolla_Axio_Hybrid_G_%28DAA-NKE165%29_front.jpg",
    'toyota_aqua': "https://global.toyota/pages/models/images/aqua/aqua/001_m.jpg",
    'toyota_vitz': "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Toyota_Vitz_F_%28DBA-KSP130%29_front.jpg/640px-Toyota_Vitz_F_%28DBA-KSP130%29_front.jpg",
    'toyota_prius': "https://global.toyota/pages/models/images/prius/prius/001_m.jpg",
    'toyota_ch-r': "https://global.toyota/pages/models/images/c-hr/c-hr/001_m.jpg",

    // Honda
    'honda_civic': "https://automobiles.honda.com/-/media/Honda-Automobiles/Vehicles/2025/Civic-Sedan/VLP/Hero/2025-civic-sedan-hero-1400-2x.jpg",
    'honda_cr-v': "https://automobiles.honda.com/-/media/Honda-Automobiles/Vehicles/2025/CR-V/VLP/Hero/2025-cr-v-hero-1400-2x.jpg",
    'honda_vezel': "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Honda_VEZEL_e-HEV_Z_%286AA-RV5%29_front.jpg/640px-Honda_VEZEL_e-HEV_Z_%286AA-RV5%29_front.jpg",
    'honda_fit': "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Honda_Fit_e-HEV_HOME_%286AA-GR3%29_front.jpg/640px-Honda_Fit_e-HEV_HOME_%286AA-GR3%29_front.jpg",
    'honda_grace': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Honda_Grace_Hybrid_EX_%28DAA-GM4%29_front.jpg/640px-Honda_Grace_Hybrid_EX_%28DAA-GM4%29_front.jpg",
    'honda_insight': "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Honda_Insight_EX_%286AA-ZE4%29_front.jpg/640px-Honda_Insight_EX_%286AA-ZE4%29_front.jpg",

    // Nissan
    'nissan_patrol': "https://www-asia.nissan-cdn.net/content/dam/Nissan/nissan_middle_east/vehicles/patrol/2023/overview/nissan-patrol-2023-overview-design-v2.jpg.ximg.l_full_m.smart.jpg",
    'nissan_x-trail': "https://www-asia.nissan-cdn.net/content/dam/Nissan/nissan_europe/vehicles/x-trail/e-power/lhd/2022/overview/nissan-x-trail-e-power-lhd-2022-overview-design-v1.jpg.ximg.l_full_m.smart.jpg",
    'nissan_leaf': "https://www-asia.nissan-cdn.net/content/dam/Nissan/nissan_europe/vehicles/leaf/2022/overview/nissan-leaf-2022-electric-car-exterior-front-view.jpg.ximg.l_full_m.smart.jpg",
    'nissan_sunny': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Nissan_Sunny_N17_China_2012-04-15.jpg/640px-Nissan_Sunny_N17_China_2012-04-15.jpg",

    // Suzuki
    'suzuki_wagon r': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Suzuki_Wagon_R_Hybrid_FZ_%28DAA-MH55S%29_front.jpg/640px-Suzuki_Wagon_R_Hybrid_FZ_%28DAA-MH55S%29_front.jpg",
    'suzuki_alto': "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Suzuki_Alto_L_%28DBA-HA36S%29_front.jpg/640px-Suzuki_Alto_L_%28DBA-HA36S%29_front.jpg",
    'suzuki_swift': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Suzuki_Swift_Hybrid_RS_4WD_%28DAA-ZD53S%29_front.jpg/640px-Suzuki_Swift_Hybrid_RS_4WD_%28DAA-ZD53S%29_front.jpg",
    'suzuki_spacia': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Suzuki_Spacia_Hybrid_X_%28DAA-MK53S%29_front.jpg/640px-Suzuki_Spacia_Hybrid_X_%28DAA-MK53S%29_front.jpg",
    'suzuki_every': "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Suzuki_Every_PC_High_Roof_4WD_%28HBD-DA17V%29_front.jpg/640px-Suzuki_Every_PC_High_Roof_4WD_%28HBD-DA17V%29_front.jpg",

    // Mitsubishi
    'mitsubishi_montero sport': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Mitsubishi_Pajero_Sport_GMT_Philos_front_view_%28cropped%29.jpg/640px-Mitsubishi_Pajero_Sport_GMT_Philos_front_view_%28cropped%29.jpg",
    'mitsubishi_lancer ex': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mitsubishi_Lancer_Evolution_X.jpg/640px-Mitsubishi_Lancer_Evolution_X.jpg",

    // Kia
    'kia_sorento': "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Kia_Sorento_MQ4_IMG_4474.jpg/640px-Kia_Sorento_MQ4_IMG_4474.jpg",

    // Micro
    'micro_panda': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Geely_LC_1.3_GS_2011.jpg/640px-Geely_LC_1.3_GS_2011.jpg" // Geely Panda (Micro Panda is rebadged Geely)
};

// HELPER: Generate year range
const getYearsForVehicle = (v: Vehicle): number[] => {
    let years: Set<number> = new Set();

    if (v.year) years.add(v.year);
    if (v.years) v.years.forEach(y => years.add(y));
    if (v.yearStart) {
        const end = v.yearEnd || new Date().getFullYear();
        for (let y = v.yearStart; y <= end; y++) {
            years.add(y);
        }
    }

    // If no years found, default to a sensible range or just current
    if (years.size === 0) return [new Date().getFullYear()];

    return Array.from(years).sort((a, b) => b - a); // Descending
};

export const transformVehiclesToWizardData = (vehicles: Vehicle[]): WizardBrand[] => {
    const brandsMap = new Map<string, WizardBrand>();

    vehicles.forEach(vehicle => {
        // Normalizing keys
        const makeKey = vehicle.make.toLowerCase();
        const modelKey = `${makeKey}_${vehicle.model.toLowerCase()}`;

        // 1. Get or Create Brand
        if (!brandsMap.has(makeKey)) {
            const asset = BRAND_ASSETS[makeKey] || {
                logo: `https://ui-avatars.com/api/?name=${vehicle.make}&background=random`,
                color: 'bg-slate-800'
            };

            brandsMap.set(makeKey, {
                id: makeKey,
                name: vehicle.make,
                logo: asset.logo,
                color: asset.color,
                models: []
            });
        }

        const brand = brandsMap.get(makeKey)!;

        // 2. Get or Create Model within Brand
        let model = brand.models.find(m => m.name === vehicle.model);

        if (!model) {
            model = {
                id: `${makeKey}_${vehicle.model.replace(/\s+/g, '_').toLowerCase()}`,
                name: vehicle.model,
                type: vehicle.bodyType || 'Unknown',
                image: MODEL_IMAGES[modelKey] || `https://placehold.co/600x400?text=${vehicle.model}`,
                years: []
            };
            brand.models.push(model);
        }

        // 3. Add Years
        const vehicleYears = getYearsForVehicle(vehicle);
        vehicleYears.forEach(year => {
            // Avoid duplicates
            if (!model!.years.some(y => y.year === year)) {
                model!.years.push({
                    id: `${model!.id}_${year}`,
                    year: year,
                    range: vehicle.yearStart ? `${vehicle.yearStart}-${vehicle.yearEnd || 'Present'}` : undefined
                });
            }
        });

        // Sort years descending
        model!.years.sort((a, b) => b.year - a.year);
    });

    // Sort models by name within each brand
    brandsMap.forEach(brand => {
        brand.models.sort((a, b) => a.name.localeCompare(b.name));
    });

    // Return brands sorted by name
    return Array.from(brandsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};
