'use client'
import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "../../firebase/firebase"
import { useRouter } from 'next/navigation'

interface Review {
  rating: number
  comment: string
  date: string
  userId: string
  userName: string
  userEmail: string
}

interface RatingsAndReviewsProps {
  productId: string
}

export function RatingsAndReviews({ productId }: RatingsAndReviewsProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const user = auth.currentUser
  const router = useRouter() // Hook to navigate to another page

  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews_${productId}`)
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews))
    }
  }, [productId])

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("You must be logged in to submit a review!")
      return
    }

    const newReview: Review = {
      rating,
      comment,
      date: new Date().toISOString(),
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      userEmail: user.email || "No email",
    }

    const updatedReviews = [...reviews, newReview]
    setReviews(updatedReviews)
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews))
    setRating(0)
    setComment("")
  }

  const handleDeleteReview = (index: number) => {
    const reviewToDelete = reviews[index]
    if (reviewToDelete.userId !== user?.uid) {
      alert("You can only delete your own reviews!")
      return
    }

    const updatedReviews = reviews.filter((_, i) => i !== index)
    setReviews(updatedReviews)
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews))
  }

  const handleSignUpRedirect = () => {
    router.push('/acc-creation') // Redirect to the sign-up page
  }

  return (
    <div className="mt-8 mb-16">
      {user ? (
        <>
          <h2 className="font-clash text-3xl font-medium mb-4">Ratings & Reviews</h2>

          <div className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 font-clash">Your Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 cursor-pointer ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      onClick={() => handleRatingChange(star)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="block mb-2 font-clash">Your Review</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border rounded font-clash"
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="bg-[#2A254B] hover:bg-[#2A254B]/90 text-white font-clash">
                Submit Review
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="font-clash text-lg text-gray-500 mb-4">You must be logged in to write a review.</p>
          <Button onClick={handleSignUpRedirect} className="bg-[#2A254B] hover:bg-[#2A254B]/90 text-white font-clash">
            Sign In / Sign Up Now
          </Button>
        </div>
      )}

      <div>
        <h3 className="font-clash text-2xl font-medium mb-4">Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className="font-clash">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600 font-clash">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="font-clash">{review.comment}</p>
              <p className="font-clash text-sm text-gray-500">
                By: {review.userName} ({review.userEmail})
              </p>
              {review.userId === user?.uid && (
                <Button
                  onClick={() => handleDeleteReview(index)}
                  className="mt-2 text-red-600 hover:text-red-800 font-clash bg-transparent hover:bg-transparent"
                >
                  Delete Review
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
