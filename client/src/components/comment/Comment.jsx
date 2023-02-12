import React, { useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { format } from 'timeago.js'
import man from '../../assets/man2.jpg'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'
import classes from './comment.module.css'

const Comment = ({ c }) => {
   const {token, user} = useSelector((state) => state.auth)
   const [comment, setComment] = useState(c)
   const [isLiked, setIsLiked] = useState(comment?.likes?.includes(user._id))

   const handleLikeComment = async() => {
    try {
      await fetch(`http://localhost:5000/comment/toggleLike/${c?._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: "PUT"
      })

      setComment(prev => {
        return {
          ...prev,
          likes: isLiked
          ? [...prev.likes].filter((id) => id !== user._id)
          : [...prev.likes, user._id]
        }
      })
      setIsLiked(prev => !prev)
    } catch (error) {
      console.error(error)
    }
   }

  return (
    <div className={classes.container}>
      <div className={classes.commentLeft}>
        <img src={man} className={classes.commentImg}/>
        <div className={classes.commentData}>
          <span>{comment?.user?.username ? capitalizeFirstLetter(comment?.user?.username) : ''}</span>
          <span className={classes.commentTimeago}>{format(comment?.createdAt)}</span>
        </div>
        <div className={classes.commentText}>{comment?.commentText}</div>
      </div>
      <div className={classes.commentRight}>
        {
          isLiked 
          ? <AiFillHeart onClick={handleLikeComment} />
          : <AiOutlineHeart onClick={handleLikeComment} />
        }
        <span>{comment?.likes?.length || 0}</span>
        <span>likes</span>
      </div>
    </div>
  )
}

export default Comment