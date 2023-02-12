import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import classes from './rightside.module.css'
import man from '../../assets/man.jpg'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'

const Rightside = () => {
  const [friends, setFriends] = useState([])
  const {user, token} = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchFriends = async() => {
      try {
        const res = await fetch(`http://localhost:5000/user/find/friends`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()

        setFriends(data)        
      } catch (error) {
        console.error(error)
      }
  }
  fetchFriends()
  }, [user.followings])

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        {friends?.length > 0 ? (
          friends?.map((friend) => (
             <Link className={classes.user} to={`/profileDetail/${friend._id}`} key={friend._id}>
              <img src={man} className={classes.profileUserImg}/>
              <div className={classes.userData}>
                <span>{capitalizeFirstLetter(friend.username)}</span>
              </div>
             </Link>
          ))
        )
         : <span>You currently have no friends. Follow someone!</span>}
      </div>
    </div>
  )
}

export default Rightside