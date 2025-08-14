import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const token = localStorage.getItem('token');

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/my-books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const deleteBook = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBooks(); // <-- refresh list after delete
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Books</h1>
      <div className="grid grid-cols-3 gap-4">
        {books.map(book => (
          <div key={book._id} className="border p-4">
            <img src={book.coverImage} alt={book.title} className="w-full h-40 object-cover mb-2" />
            <h2 className="font-bold">{book.title}</h2>
            <p>By {book.author}</p>
            <Link to={`/books/${book._id}`} className="text-blue-500">View Details</Link>
            <div className="mt-2">
              <Link to={`/edit-book/${book._id}`} className="mr-2 text-green-500">Edit</Link>
              <button onClick={() => deleteBook(book._id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBooks;
