import { useQuery } from '@tanstack/react-query'

import { makeRequest } from '../../axios'
import { Post } from '../'

import './Posts.scss'

export const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery(['posts'], () =>
    makeRequest.get('/posts?userId=' + userId).then(res => {
      return res.data
    })
  )

  return (
    <div className="posts">
      {error ? 'Something went wrong!' : isLoading ? 'loading' : data.map(post => <Post post={post} key={post.id} />)}
    </div>
  )
}
