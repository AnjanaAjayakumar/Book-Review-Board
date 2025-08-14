import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) navigate('/login');

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post('http://localhost:5000/api/books', { title, author, description, coverImage }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/my-books'); // <-- go to My Books page
  } catch (err) {
    console.error(err);
  }
};
    if (!token) {
        return <p>Please log in to add a book.</p>;
    }


  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Book</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2 mb-2 w-full" />
        <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" className="border p-2 mb-2 w-full" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-2 mb-2 w-full" />
        <input type="text" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="Cover Image URL" className="border p-2 mb-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white p-2">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;