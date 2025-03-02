interface DishProps {
  dish: string;
  details: {
    cuisine: string;
    category: string;
    description: string;
    allergy?: string;
  };
  onMoreLikeThis: (dish: string) => void;
}

const MenuCard: React.FC<DishProps> = ({ dish, details, onMoreLikeThis }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{dish}</h3>
    <p className="text-sm text-gray-600"><strong>Cuisine:</strong> {details.cuisine}</p>
    <p className="text-sm text-gray-600"><strong>Category:</strong> {details.category}</p>
    <p className="text-sm text-gray-700">{details.description}</p>
    {details.allergy && <p className="text-sm text-red-600 font-medium">{details.allergy}</p>}

    <button
      onClick={() => onMoreLikeThis(dish)}
      className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md
                 hover:bg-blue-600 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      More Like This
    </button>
  </div>
);

export default MenuCard;
