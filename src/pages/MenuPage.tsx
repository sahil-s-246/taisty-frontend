import { useState, useEffect } from "react";
import MenuCard from "../components/MenuCard";
import Modal from "../components/Modal";
import PWAInstallButton from "../components/PWA.tsx";

interface Dish {
  dish: string;
  cuisine: string;
  category: string;
  description: string;
  allergy?: string;
}

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<Dish[]>([]);
  const [expiringDishes, setExpiringDishes] = useState<Dish[]>([]);
  const [recommendedDishes, setRecommendedDishes] = useState<Dish[]>([]);
  const [similarDishes, setSimilarDishes] = useState<Dish[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<"menu" | "imagination">("menu");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, expiringRes] = await Promise.all([
          fetch("/updated_data.json"),
          fetch("https://taisty-admin.vercel.app/top-expiring-dishes")
        ]);

        if (!menuRes.ok || !expiringRes.ok)
          throw new Error("Failed to load menu or freshness data");

        const menuData: Dish[] = await menuRes.json();
        const expiringData = await expiringRes.json();

        setMenuItems(menuData);

        const expiringDishNames: string[] = expiringData.top_expiring_dishes.map((d: any) => d.dish);
        const matchedExpiring = menuData.filter((item) =>
          expiringDishNames.includes(item.dish)
        );
        setExpiringDishes(matchedExpiring);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchData();
  }, []);
console.log(error)
  useEffect(() => {
    const fetchPersonalized = async () => {
      try {
        const response = await fetch("https://0bfd-2405-201-1021-a04d-1823-e4be-2105-1cef.ngrok-free.app/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: "user1", preference_query: "" }),
        });

        if (!response.ok) throw new Error("Failed to fetch recommended dishes");

        const data = await response.json();
        const processed: Dish[] = (data.recommendations || []).map((item: any) => ({
          dish: item.dish || "",
          cuisine: item.cuisine || "",
          category: item.category || "",
          description: item.description || "",
          allergy: item.allergy || undefined,
        }));
        setRecommendedDishes(processed);
      } catch (err) {
        console.error(err);
      }
    };

    if (searchMode === "imagination") {
      fetchPersonalized();
    }
  }, [searchMode]);

  const filteredDishes = menuItems.filter((item) =>
    item.dish.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchSimilarDishes = async (dishName: string) => {
    try {
      setSelectedDish(dishName);
      setIsLoading(true);
      setIsModalOpen(true);

      const response = await fetch("https://0bfd-2405-201-1021-a04d-1823-e4be-2105-1cef.ngrok-free.app/more-like-this", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dish_name: dishName }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = await response.json();
      const processedDishes: Dish[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (key !== dishName && typeof value === "object" && value !== null) {
          const dishObj = value as any;
          if (dishObj.cuisine && dishObj.category && dishObj.description) {
            processedDishes.push({
              dish: key,
              cuisine: dishObj.cuisine,
              category: dishObj.category,
              description: dishObj.description,
              allergy: dishObj.allergy,
            });
          }
        }
      });

      setSimilarDishes(processedDishes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch similar dishes");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    if (!searchQuery) return;

    try {
      setIsLoading(true);
      setIsModalOpen(true);

      const response = await fetch("https://0bfd-2405-201-1021-a04d-1823-e4be-2105-1cef.ngrok-free.app/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id:"user1",preference_query: searchQuery }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = await response.json();
      const processedRecommendations: Dish[] = [];

      if (data?.recommendations) {
        data.recommendations.forEach((item: any) => {
          processedRecommendations.push({
            dish: item.dish || "",
            cuisine: item.cuisine || "",
            category: item.category || "",
            description: item.description || "",
            allergy: item.allergy || undefined,
          });
        });
      }

      setSimilarDishes(processedRecommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📖 Restaurant Menu</h1>
      <PWAInstallButton />

      {/* 🌿 Freshest Today Section */}
      {expiringDishes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-600 mb-4">🌿 Today's Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expiringDishes.map((item, index) => (
              <MenuCard
                key={`fresh-${item.dish}-${index}`}
                dish={item.dish}
                details={{
                  cuisine: item.cuisine,
                  category: item.category,
                  description: item.description,
                  allergy: item.allergy,
                }}
                onMoreLikeThis={fetchSimilarDishes}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommended For You Section (Imagination Mode) */}
      {searchMode === "imagination" && recommendedDishes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">✨ Recommended For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedDishes.map((item, index) => (
              <MenuCard
                key={`rec-${item.dish}-${index}`}
                dish={item.dish}
                details={{
                  cuisine: item.cuisine,
                  category: item.category,
                  description: item.description,
                  allergy: item.allergy,
                }}
                onMoreLikeThis={fetchSimilarDishes}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Mode Buttons */}
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => setSearchMode("menu")}
          className={`px-4 py-2 rounded-lg ${searchMode === "menu" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Menu Search
        </button>
        <button
          onClick={() => setSearchMode("imagination")}
          className={`px-4 py-2 rounded-lg ${searchMode === "imagination" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Imagination Search
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="text"
          placeholder="What would you like to eat?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchMode === "menu" ? () => {} : fetchRecommendations}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Filtered Menu Cards */}
      {searchMode === "menu" && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((item, index) => (
              <MenuCard
                key={`menu-card-${item.dish}-${index}`}
                dish={item.dish}
                details={{
                  cuisine: item.cuisine,
                  category: item.category,
                  description: item.description,
                  allergy: item.allergy,
                }}
                onMoreLikeThis={fetchSimilarDishes}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal for Recommendations */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="w-full max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {searchMode === "menu"
              ? `More Dishes Like "${selectedDish}"`
              : "Recommended Dishes"}
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-lg text-gray-600">Loading dishes...</p>
            </div>
          ) : similarDishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {similarDishes.map((dish, index) => (
                <MenuCard
                  key={`similar-${dish.dish}-${index}`}
                  dish={dish.dish}
                  details={{
                    cuisine: dish.cuisine,
                    category: dish.category,
                    description: dish.description,
                    allergy: dish.allergy,
                  }}
                  onMoreLikeThis={(dishName) => {
                    setSimilarDishes([]);
                    fetchSimilarDishes(dishName);
                  }}
                />
              ))}
            </div>
          ) : (
            <p>No similar dishes found.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MenuPage;
