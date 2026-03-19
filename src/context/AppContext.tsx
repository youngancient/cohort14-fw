import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { AppContextType, ModalType, Property, Toast } from "../types";

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock property images mapped by id for display
export const PROPERTY_IMAGES: Record<
  number,
  { url: string; location: string; apy: string }
> = {
  1: {
    url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
    location: "Monaco, FR",
    apy: "8.2%",
  },
  2: {
    url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
    location: "Maldives, MV",
    apy: "12.4%",
  },
  3: {
    url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    location: "Amalfi Coast, IT",
    apy: "6.5%",
  },
  4: {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    location: "Malibu, CA",
    apy: "9.1%",
  },
  5: {
    url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    location: "Dubai, UAE",
    apy: "7.8%",
  },
  6: {
    url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    location: "Mykonos, GR",
    apy: "11.2%",
  },
};

export const DEFAULT_IMAGE = {
  url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  location: "Global Asset",
  apy: "8.0%",
};

export function getPropertyImage(id: number) {
  return PROPERTY_IMAGES[((id - 1) % 6) + 1] || DEFAULT_IMAGE;
}

// Mock properties for UI preview
const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    price: BigInt("125000000000000000000000"),
    propType: "Villa",
    category: "Beachfront",
    owner: "0x71C...a49B",
    isSold: false,
    isListed: true,
    warranty: "10 years structural warranty",
  },
  {
    id: 2,
    price: BigInt("840000000000000000000000"),
    propType: "Commercial",
    category: "Metropolitan",
    owner: "0x71C...a49B",
    isSold: false,
    isListed: true,
    warranty: "5 years commercial warranty",
  },
  {
    id: 3,
    price: BigInt("45000000000000000000000"),
    propType: "Apartment",
    category: "Metropolitan",
    owner: "0x71C...a49B",
    isSold: false,
    isListed: true,
    warranty: "7 years smart warranty",
  },
  {
    id: 4,
    price: BigInt("310000000000000000000000"),
    propType: "Villa",
    category: "Luxury Retreat",
    owner: "0x71C...a49B",
    isSold: false,
    isListed: true,
    warranty: "15 years premium warranty",
  },
  {
    id: 5,
    price: BigInt("640000000000000000000000"),
    propType: "Villa",
    category: "Beachfront",
    owner: "0x71C...a49B",
    isSold: false,
    isListed: true,
    warranty: "10 years ocean warranty",
  },
  {
    id: 6,
    price: BigInt("1200000000000000000000000"),
    propType: "Commercial",
    category: "Metropolitan",
    owner: "0x71C...a49B",
    isSold: true,
    isListed: false,
    warranty: "8 years corporate warranty",
  },
];

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // Wallet state (placeholder - wagmi will provide real values)
  const [isConnected] = useState(false);
  const [address] = useState<string | undefined>(undefined);
  const [isOwner] = useState(false);

  // Properties state
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);

  // Selected property
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );

  // Modal state
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Filter state
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  const listedProperties = properties.filter((p) => p.isListed && !p.isSold);

  const openModal = useCallback(
    (modal: ModalType) => setActiveModal(modal),
    []
  );
  const closeModal = useCallback(() => setActiveModal(null), []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshProperties = useCallback(() => {
    setIsLoadingProperties(true);
    // When integrated, fetch from contract here
    setTimeout(() => setIsLoadingProperties(false), 800);
  }, []);

  const value: AppContextType = {
    isConnected,
    address,
    isOwner,
    properties,
    listedProperties,
    isLoadingProperties,
    selectedPropertyId,
    setSelectedPropertyId,
    activeModal,
    openModal,
    closeModal,
    toasts,
    addToast,
    removeToast,
    filterType,
    filterCategory,
    filterPrice,
    setFilterType,
    setFilterCategory,
    setFilterPrice,
    refreshProperties,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
