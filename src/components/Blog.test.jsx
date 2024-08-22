import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'

test('renders title and author but not url or likes', () => {
  const blog = {
    title: 'Testing rendering',
    author: 'Testy Tester',
    url: 'test.fi',
    likes: 200
  }

  const { container } = render(<Blog blog={blog} />)
  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent(
    'Testing rendering'
  )
  expect(div).toHaveTextContent(
    'Testy Tester'
  )
  expect(div).not.toHaveTextContent(
    'test.fi'
  )
  expect(div).not.toHaveTextContent(
    'likes: 200'
  )
})

test('clicking the button once shows also url, likes and user', async () => {
  const blog = {
    title: 'Testing rendering',
    author: 'Testy Tester',
    url: 'test.fi',
    likes: 200,
    user: {
      name: 'Testy User'
    }
  }

  const user = userEvent.setup()
  render(<Blog blog={blog}/>)

  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('test.fi')).toBeInTheDocument()
  expect(screen.getByText('likes: 200')).toBeInTheDocument()
  expect(screen.getByText('Testy User')).toBeInTheDocument()

})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Testing rendering',
    author: 'Testy Tester',
    url: 'test.fi',
    likes: 200,
    user: {
      name: 'Testy User'
    }
  }

  const mockHandlerUpdateBlogLikes = vi.fn()
  const mockHandlerRemoveBlog = vi.fn()

  render(
    <Blog
      blog={blog}
      updateBlogLikes={mockHandlerUpdateBlogLikes}
      removeBlog={mockHandlerRemoveBlog}
      user={blog.user}
    />
  )

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandlerUpdateBlogLikes).toHaveBeenCalledTimes(2)
})
