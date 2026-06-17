function RatingStars({ value = 0, onChange, readonly = false }) {
  const handleClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="stars-container">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= value ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
          onClick={() => handleClick(star)}
          disabled={readonly}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default RatingStars;
