import {create} from 'zustand'
import {produce} from 'immer'
import {
    apiUrlBrands,
    apiUrlTypes,
    apiUrlPerfumes,
    apiUrlAddToFavorites,
    apiUrlFavorites,
    apiUrl,
    apiUrlAddToRecentlyViewed
} from "../consts";
import useAuthStore from "./UserStore";

export function findTypenameById(id, perfumeTypes) {
    const foundType = perfumeTypes.find((type) => type.id === id)
    return foundType ? foundType.name : null
}
export function findTypeIdByName(name, perfumeTypes) {
    const foundType = perfumeTypes.find((type) => type.name === name)
    return foundType ? foundType.id : null
}

export function findBrandnameById(id, perfumeBrands) {
    const foundBrand = perfumeBrands.find((brand) => brand.id === id)
    return foundBrand ? foundBrand.name : null
}
export function findBrandIdByName(name, perfumeBrands) {
    const foundBrand = perfumeBrands.find((brand) => brand.name === name)
    return foundBrand ? foundBrand.id : null
}

export const usePerfumeStore = create((set, get) => ({
    perfumes: [],
    perfumeTypes: [],
    perfumeBrands: [],
    foundPerfume: {},
    rating: 0,

    fetchPerfumeById: async (id) => {
        try {
            const foundPerfume = await fetch(`${apiUrlPerfumes}/${id.toString()}`, {method: "GET"}).then((res) => res.json())
            set(state => ({
                ...state,
                foundPerfume,
            }))
        } catch (error) {
            console.error('Error fetching perfume by id:', error);
        }
    },
    fetchPerfumes: async () => {
        try {
            const response = await fetch(apiUrlPerfumes, {
                method: "GET",
            });
            const perfumes = await response.json();
            if (!perfumes) {
                throw new Error('Failed to fetch perfumes');
            }
            //console.log(perfumes)
            set(state => ({
                ...state,
                perfumes,
            }));
            console.log("successfully fetched perfumes");
        } catch (error) {
            console.error('Error fetching perfumes:', error);
        }
    },
    fetchTypes: async () => {
        try {
            const response = await fetch(apiUrlTypes, {method: "GET"});
            const perfumeTypes = await response.json();
            if (!perfumeTypes) {
                throw new Error('Failed to fetch perfume types');
            }
            //console.log(perfumes)
            set(state => ({
                ...state,
                perfumeTypes,
            }));
            console.log("successfully fetched perfume types");
        } catch (error) {
            console.error('Error fetching perfume types:', error);
        }
    },
    fetchBrands: async () => {
        try {
            const response = await fetch(apiUrlBrands, {method: "GET"});
            const perfumeBrands = await response.json();
            if (!perfumeBrands) {
                throw new Error('Failed to fetch perfume brands');
            }
            //console.log(perfumes)
            set(state => ({
                ...state,
                perfumeBrands,
            }));
            console.log("successfully fetched perfume brands");
        } catch (error) {
            console.error('Error fetching perfume brands:', error);
        }
    },
    addToFavorites: async (userId, perfumeId, isFavorite) => {
        try {
            const response = await fetch(apiUrlAddToFavorites, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"userId": userId, "perfumeId": perfumeId })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Логируем сообщение от сервера
                return true;
            } else {
                console.error('Error adding perfume to favorites (client error):', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error adding perfume to favorites (client error):', error);
            return false;
        }
    },
    addToRecentlyViewed: async (userId, perfumeId) => {
        try {
            const response = await fetch(apiUrlAddToRecentlyViewed, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"userId": userId, "perfumeId": perfumeId })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Логируем сообщение от сервера
                return true;
            } else {
                console.error('Error adding perfume to recently viewed (client error):', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error adding perfume to recently viewed (client error):', error);
            return false;
        }
    },
    getRating: async (id) => {
        try {
            const response = await fetch(`${apiUrlPerfumes}/${id.toString()}/rating`, {method: "GET"});
            const rating = await response.json();
            if (!rating) {
                throw new Error('Failed to fetch rating');
            }
            set(state => ({
                ...state,
                rating,
            }));
        } catch (error) {
            console.error('Error fetching rating (client error):', error);
            return false;
        }
    }
}))

