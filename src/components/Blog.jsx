import { useState } from 'react'

const Blog = ({ blog, updateBlogLikes, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLikeClick = () => {
    updateBlogLikes(blog.id)
  }

  const handleRemoveClick = () => {
    removeBlog(blog.id, blog.title, blog.author)
  }

  return (
    <li className='blog'>
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>
            {visible ? 'hide' : 'view'}
          </button>
        </div>
        {visible && (
          <div>
            <p>{blog.url}</p>
            <p>{`likes: ${blog.likes}`}<button onClick={handleLikeClick}>like</button></p>
            <p>{blog.user.name}</p>
            {user && blog.user.name === user.name && (
              <button onClick={handleRemoveClick}>remove</button>
            )}
          </div>
        )}
      </div>
    </li>
  )
}

export default Blog
