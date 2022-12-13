import { useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import {
  FacebookTwoTone,
  LinkedIn,
  Instagram,
  Pinterest,
  Twitter,
  Place,
  Language,
  EmailOutlined,
  MoreVert,
} from '@mui/icons-material'

import { Update, Posts } from '../../components'
import { makeRequest } from '../../axios'
import { AuthContext } from '../../context/authContext'

import './Profile.scss'

export const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false)
  const { currentUser } = useContext(AuthContext)
  const queryClient = useQueryClient()

  const userId = parseInt(useLocation().pathname.split('/')[2])

  const { isLoading, error, data } = useQuery(['user'], () =>
    makeRequest.get('/users/find/' + userId).then(res => {
      return res.data
    })
  )

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(['relationship'], () =>
    makeRequest.get('/relationships?followedUserId=' + userId).then(res => {
      return res.data
    })
  )

  const mutation = useMutation(
    following => {
      if (following) return makeRequest.delete('/relationships?userId=' + userId)
      return makeRequest.post('/relationships', { userId })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['relationship'])
      },
    }
  )

  const handleFollow = () => mutation.mutate(relationshipData.includes(currentUser.id))

  return (
    <div className="profile">
      {isLoading ? (
        'loading'
      ) : (
        <>
          <div className="images">
            <img src={'/upload/' + data.coverPic} alt="" className="cover" />
            <img src={'/upload/' + data.profilePic} alt="" className="profilePic" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoTone fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <Instagram fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <Twitter fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedIn fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <Pinterest fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <Place />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <Language />
                    <span>{data.website}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  'loading'
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id) ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlined />
                <MoreVert />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  )
}
