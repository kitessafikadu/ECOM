import StarRating from "./StarRating";
const ProductCard = ({ name, price }) => {
  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-gray-700">${price}</p>
      <StarRating />
    </div>
  );
};

export default ProductCard;
