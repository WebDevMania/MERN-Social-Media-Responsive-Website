import React from 'react'
import classes from './profileCard.module.css'
import man from '../../assets/man.jpg'
import {Link} from 'react-router-dom'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'
import {format} from 'timeago.js'
import { useSelector } from 'react-redux'

const ProfileCard = () => {
  const {user} = useSelector((state) => state.auth)

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.top}>
          <div className={classes.imgContainer}>
            <img src={man} className={classes.profileUserImg}/>
          </div>
          <div className={classes.usernameAndCreatedAt}>
            <p><span>Username:</span> {capitalizeFirstLetter(user.username)}</p>
            <p><span>Created At:</span> {format(user.createdAt)}</p>
          </div>
        </div>
        <hr />
        <div className={classes.bottom}>
          <p>Followers: <span>{user.followers.length}</span></p>
          <p>Followings: <span>{user.followings.length}</span></p>
        </div>
      </div>
        <Link style={{textDecoration: 'none'}} to={`/profileDetail/${user._id}`}>
          <h3 className={classes.myProfile}>My Profile</h3>
        </Link>
    </div>
  )
}

export default ProfileCard