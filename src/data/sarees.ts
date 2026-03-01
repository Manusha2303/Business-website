export interface Saree {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    fabric?: string;
    color?: string;
}

export const SAREES: Saree[] = [
    {
        id: 1,
        name: "Royal Kanchipuram Silk",
        price: 4800,
        category: "Traditional",
        image: "/saree-1.png",
        description: "Pure mulberry silk with intricate gold zari borders.",
        fabric: "Pure Silk",
        color: "Crimson Red & Gold"
    },
    {
        id: 2,
        name: "Elegant Banarasi Brocade",
        price: 4200,
        category: "Traditional",
        image: "/saree-2.png",
        description: "Rich hand-woven silk with floral motifs and metallic details.",
        fabric: "Silk Brocade",
        color: "Royal Blue"
    },
    {
        id: 3,
        name: "Crimson Chiffon Delight",
        price: 2500,
        category: "Contemporary",
        image: "/saree-3.png",
        description: "Lightweight and flowy chiffon, perfect for evening soirées.",
        fabric: "Chiffon",
        color: "Crimson Red"
    },
    {
        id: 4,
        name: "Golden Organza Dream",
        price: 3200,
        category: "Modern",
        image: "/saree-4.png",
        description: "Sheer organza with delicate hand-painted floral patterns.",
        fabric: "Organza",
        color: "Golden Yellow"
    },
    {
        id: 5,
        name: "Emerald Patola Silk",
        price: 4950,
        category: "Heritage",
        image: "/saree-5.png",
        description: "Double ikat patola silk, a true heritage masterpiece.",
        fabric: "Patola Silk",
        color: "Emerald Green"
    },
    {
        id: 6,
        name: "Midnight Indigo Linen",
        price: 2200,
        category: "Casual",
        image: "/saree-6.png",
        description: "Comfortable handloom linen with minimal block prints.",
        fabric: "Linen",
        color: "Midnight Blue"
    },
    {
        id: 7,
        name: "Royal Blue Georgette",
        price: 3800,
        category: "Modern",
        image: "/saree-7.png",
        description: "Fluid georgette with silver zardosi work, perfect for parties.",
        fabric: "Georgette",
        color: "Royal Blue"
    },
    {
        id: 8,
        name: "Sunset Chanderi Silk",
        price: 2900,
        category: "Heritage",
        image: "/saree-8.png",
        description: "Traditional handloom silk from Chanderi with golden butis.",
        fabric: "Chanderi Silk",
        color: "Sunset Orange"
    },
    {
        id: 9,
        name: "Midnight Black Net",
        price: 4500,
        category: "Contemporary",
        image: "/saree-9.png",
        description: "Sophisticated black netted saree with shimmering floral embroidery.",
        fabric: "Net",
        color: "Midnight Black"
    }
];
