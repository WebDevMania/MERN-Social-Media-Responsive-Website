import React from 'react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import man from '../../assets/man.jpg'
import classes from './postDetails.module.css'
import { useEffect } from 'react'
import Comment from '../comment/Comment'

const PostDetails = () => {
  const [post, setPost] = useState("")
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [isCommentEmpty, setIsCommentEmpty] = useState(false)
  const [isCommentLong, setIsCommentLong] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { id } = useParams()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/post/find/${id}`)
        const data = await res.json()
        setPost(data)
      } catch (error) {
        console.error(error)
      }
    }
    id && fetchPost()
  }, [id])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/comment/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        const data = await res.json()
        setComments(data)
      } catch (error) {
        console.error(error)
      }
    }
    post && fetchComments()
  }, [post._id])

  const handlePostComment = async () => {
     if(commentText === ''){
      setIsCommentEmpty(true)
      setTimeout(() => {
        setIsCommentEmpty(false)
      }, 2000);
      return
     }

     if(commentText.length > 50){
      setIsCommentLong(true)
      setTimeout(() => {
        setIsCommentLong(false)
      }, 2000)
      return
     }

     try {
      const res = await fetch(`http://localhost:5000/comment`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({commentText, post: post._id})
      })

      const data = await res.json()
      setComments(prev => [...prev, data])
      setCommentText("")
     } catch (error) {
      console.error(error)
     }
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <img src={post?.photo && `http://localhost:5000/images/${post?.photo}`} />
        </div>
        <div className={classes.right}>
          <div className={classes.wrapperTopSide}>
            <Link to={`/profileDetail/${post?.user?._id}`} className={classes.topRightSide}>
              <img src={man} className={classes.profileImage} />
              <div className={classes.userData}>
                <span>{post?.user?.username}</span>
                <span>{post?.location ? post?.location : "Somewhere around the globe"}</span>
              </div>
            </Link>
          </div>
          {/* comments */}
          <div className={classes.comments}>
            {comments?.length > 0 ?
              comments.map((comment) => (
                <Comment c={comment} key={comment._id} />
              ))
              : <h3 className={classes.noCommentsMsg}>No comments yet</h3>}
          </div>
          {/* comment input field */}
          <div className={classes.postCommentSection}>
            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} type="text" placeholder='Type comment...' className={classes.inputSection} />
            <button onClick={handlePostComment}>Post</button>
          </div>
          {isCommentEmpty && <span className={classes.emptyCommentMsg}>You can't post empty comment!</span>}
          {isCommentLong && <span className={classes.longCommentMsg}>Comment is too long</span>}
        </div>
      </div>
    </div>
  )
}

export default PostDetails