import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { FavoriteBorderOutlined, FavoriteOutlined, TextsmsOutlined, ShareOutlined, MoreHoriz } from '@mui/icons-material'
import moment from 'moment'

import { makeRequest } from '../../axios'
import { AuthContext } from '../../context/authContext'
import { Comments } from '../'

import './Post.scss'

export const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { currentUser } = useContext(AuthContext)
  const queryClient = useQueryClient()

  const { isLoading, error, data } = useQuery(['likes', post.id], () =>
    makeRequest.get('/likes?postId=' + post.id).then(res => {
      return res.data
    })
  )

  const mutation = useMutation(
    liked => {
      if (liked) return makeRequest.delete('/likes?postId=' + post.id)
      return makeRequest.post('/likes', { postId: post.id })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['likes'])
      },
    }
  )

  const deleteMutation = useMutation(
    postId => {
      return makeRequest.delete('/posts/' + postId)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts'])
      },
    }
  )

  const handleLike = () => mutation.mutate(data.includes(currentUser.id))
  const handleDelete = () => deleteMutation.mutate(post.id)

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={'/upload/' + post.profilePic} alt="" />
            <div className="details">
              <Link to={`/profile/${post.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHoriz onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && <button onClick={handleDelete}>delete</button>}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={'/upload/' + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              'loading'
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlined style={{ color: 'red' }} onClick={handleLike} />
            ) : (
              <FavoriteBorderOutlined onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlined />
            See Comments
          </div>
          <div className="item">
            <ShareOutlined />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  )
}
