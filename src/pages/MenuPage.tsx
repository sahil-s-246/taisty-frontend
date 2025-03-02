import { useState, useEffect } from "react";
import MenuCard from "../components/MenuCard";

// Define dish interface
interface Dish {
  dish: string;
  cuisine: string;
  category: string;
  description: string;
  allergy?: string;
}

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<Dish[]>([]);
  const [similarDishes, setSimilarDishes] = useState<Dish[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  console.log(error)
  const [searchMode, setSearchMode] = useState<"menu" | "imagination">("menu");

  // Fetch menu data
  useEffect(() => {
    fetch("/data.json")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load menu data");
        return response.json();
      })
      .then((data: Dish[]) => setMenuItems(data))
      .catch((err) => setError(err.message));
  }, []);

  // Filter dishes by search query (for menu mode)
  const filteredDishes = menuItems.filter((item) =>
    item.dish.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(filteredDishes[0])
  // Fetch similar dishes when clicking "More Like This"
  const fetchSimilarDishes = async (dishName: string) => {
    try {
      console.log('Sending request with dish name:', dishName); // Debug log

      const response = await fetch("http://localhost:8000/more-like-this", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dish_name: dishName  // Match the exact property name from Postman
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data); // Debug log

      // Make sure we're accessing the correct property from the response
      setSimilarDishes(data.reranked_objects || []); // Match the exact property name from response
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch similar dishes');
    }
  };

  // Fetch recommendations based on imagination mode (user input)
  const fetchRecommendations = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch("http://localhost:8000/personalized-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preference_query: searchQuery }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data); // Debug log

      // Make sure we're accessing the correct property from the response
      // Match the exact property name from response
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch similar dishes');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📖 Restaurant Menu</h1>

      {/* Search Mode Toggle */}
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

      {/* Search Bar */}
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

      {/* Display Dishes for Menu Search */}
      {searchMode === "menu" && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <div
                key={`menu-${item.dish}-${index}`}
                style={{
                  display: item.dish.toLowerCase().includes(searchQuery.toLowerCase()) ? "block" : "none",
                  transition: "display 300ms ease",
                }}
                className="transition-all duration-300"
              >
                <MenuCard
                  key={`menu-card-${item.dish}-${index}`}
                  dish={item.dish}
                  details={item}
                  onMoreLikeThis={fetchSimilarDishes}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display Recommendations (Imagination Mode) */}
      {searchMode === "imagination" && similarDishes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🍽️ More Like This</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarDishes.map((dish, index) => (
              <MenuCard
                key={`similar-${dish.dish}-${index}`}
                dish={dish.dish}
                details={dish}
                onMoreLikeThis={fetchSimilarDishes}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;