import { Stories, Posts, Share } from '../../components'

import './Home.scss'

export const Home = () => {
  return (
    <div className="home">
      <Stories />
      <Share />
      <Posts />
    </div>
  )
}
