import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const Notification = ({ message, title, author }) => {
  if (message === null || title === null || author === null) {
    return null
  }
  if (message === 'add') {
    return (
      <div className='add'>
        {`a new blog ${title} by ${author} added`}
      </div>
    )
  }
  if (message === 'error') {
    return (
      <div className='error'>
        {'wrong username or password'}
      </div>
    )
  }
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationTitle, setNotificationTitle] = useState(null)
  const [notificationAuthor, setNotificationAuthor] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const updateBlogLikes = (id) => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService.update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(error => {
        setNotificationMessage(`Blog '${blog.title}' by ${blog.author} was already removed from server`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
  }

  const removeBlog = (id, title, author) => {
    const confirmRemoval = window.confirm(`Remove blog ${title} by ${author}`)

    if (confirmRemoval) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
        })
    }
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotificationAuthor(blogObject.author)
        setNotificationTitle(blogObject.title)
        setNotificationMessage('add')
        setBlogFormVisible(false)
        toggleVisibility()
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationTitle(null)
          setNotificationAuthor(null)
        }, 3000)
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage('error')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const blogForm = () => {
    blogs.sort((a, b) => b.likes - a.likes)

    return (
      <div>
        <h2>blogs</h2>
        <Notification message={notificationMessage} title={notificationTitle} author={notificationAuthor} />
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        <Togglable buttonLabel="new note" visible={visible}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlogLikes={updateBlogLikes} removeBlog={removeBlog} user={user} />
        )}
      </div>
    )
  }

  return (
    <div>
      {!user && <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
        Notification={Notification}
        notificationMessage={notificationMessage}/>}
      {user && blogForm()}
    </div>
  )
}

export default App
