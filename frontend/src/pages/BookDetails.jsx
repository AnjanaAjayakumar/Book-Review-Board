import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/books/${id}`)
      .then(res => setBook(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment) return setError('Please enter all fields');
    if (!token) return navigate('/login');

    axios.post(`http://localhost:5000/api/books/${id}/reviews`, { rating, comment }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setBook(prev => ({ ...prev, reviews: [...prev.reviews, { ...res.data, user: { name: 'You' } }] }));
        setRating('');
        setComment('');
      })
      .catch(err => setError(err.response.data.msg));
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
      <img src={book.coverImage} alt={book.title} className="w-40 h-60 object-cover mb-2" />
      <p>By {book.author}</p>
      <p>{book.description}</p>
      <h2 className="text-xl font-bold mt-4">Reviews</h2>
      {book.reviews.map(review => (
        <div key={review._id} className="border p-2 mb-2">
          <p>Rating: {review.rating}/5</p>
          <p>{review.comment}</p>
          <p>By {review.user.name}</p>
        </div>
      ))}
      {token && (
        <>
          <h2 className="text-xl font-bold mt-4">Add Review</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input type="number" value={rating} onChange={e => setRating(e.target.value)} placeholder="Rating (1-5)" className="border p-2 mb-2 w-full" min="1" max="5" />
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Comment" className="border p-2 mb-2 w-full" />
            <button type="submit" className="bg-blue-500 text-white p-2">Add Review</button>
          </form>
        </>
      )}
    </div>
  );
};

export default BookDetails;