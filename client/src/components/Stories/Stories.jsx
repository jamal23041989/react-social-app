import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'

import { AuthContext } from '../../context/authContext'
import { makeRequest } from '../../axios'

import './Stories.scss'

export const Stories = () => {
  const { currentUser } = useContext(AuthContext)

  const { isLoading, error, data } = useQuery(['stories'], () =>
    makeRequest.get('/stories').then(res => {
      return res.data
    })
  )

  return (
    <div className="stories">
      <div className="story">
        <img src={'/upload/' + currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button>+</button>
      </div>
      {error
        ? 'Something went wrong'
        : isLoading
        ? 'loading'
        : data.map(story => (
            <div className="story" key={story.id}>
              <img src={story.img} alt="" />
              <span>{story.name}</span>
            </div>
          ))}
    </div>
  )
}
