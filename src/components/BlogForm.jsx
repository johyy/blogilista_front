import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title: <input
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          placeholder='title of the blog'
        />
      </div>
      <div>
        author: <input
          value={newAuthor}
          onChange={event => setNewAuthor(event.target.value)}
          placeholder='author of the blog'
        />
      </div>
      <div>
        url: <input
          value={newUrl}
          onChange={event => setNewUrl(event.target.value)}
          placeholder='url of the blog'
        />
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
  )
}

export default BlogForm