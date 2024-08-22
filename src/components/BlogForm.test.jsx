import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

test('<BlogForm /> calls callback with correct data when a new blog is created', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title of the blog')
  const authorInput = screen.getByPlaceholderText('author of the blog')
  const urlInput = screen.getByPlaceholderText('url of the blog')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'testing a form with a title...')
  await user.type(authorInput, 'testing a form with an author...')
  await user.type(urlInput, 'testing a form with a url...')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'testing a form with a title...',
    author: 'testing a form with an author...',
    url: 'testing a form with a url...'
  })
})