import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, CheckCircle2, MessageSquare, Send, Sparkles } from 'lucide-react';

export default function OrderReviewCard({ 
  order, 
  title = "Leave a Collector Review",
  subtitle = "Help other Australian collectors! Share your experience with our packaging and delivery.",
  autoOpen = true,
  onSuccess = null
}) {
  const { reviews, addReview, hasReviewedOrder, getOrderReview, currentUser, userProfile, navigateTo } = useStore();

  const existingReview = getOrderReview(order?.orderId) || (order?.hasReviewed ? reviews.find(r => r.orderId === order?.orderId) : null);

  // Derive initial values
  const defaultAuthor = currentUser?.displayName || currentUser?.username || order?.buyerName || 'Australian Collector';
  
  // Extract city/state if available
  const extractLocation = () => {
    if (currentUser?.shippingAddress?.city && currentUser?.shippingAddress?.state) {
      return `${currentUser.shippingAddress.city}, ${currentUser.shippingAddress.state}`;
    }
    if (order?.shippingAddress) {
      const parts = order.shippingAddress.split(',');
      if (parts.length >= 2) {
        return parts[parts.length - 2].trim();
      }
    }
    return 'Melbourne, VIC';
  };

  const defaultLocation = extractLocation();
  const defaultProduct = order?.items && order.items.length > 0 
    ? (order.items.length === 1 ? order.items[0].name : 'Entire Order') 
    : 'Sealed Collectibles';

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState(defaultAuthor);
  const [location, setLocation] = useState(defaultLocation);
  const [product, setProduct] = useState(defaultProduct);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const ratingDescriptions = {
    5: 'Flawless 5/5 - Collector Grade Packaging & Fast Post',
    4: 'Great 4/5 - Very Satisfied with Purchase',
    3: 'Average 3/5 - Order Received as Described',
    2: 'Below Average 2/5 - Issues Encountered',
    1: 'Poor 1/5 - Unsatisfied'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanComment = comment.trim();
    if (!cleanComment) {
      setError('Please write a brief comment about your order experience.');
      return;
    }

    setIsSubmitting(true);
    const res = addReview({
      orderId: order?.orderId,
      rating,
      comment: cleanComment,
      author: author.trim() || defaultAuthor,
      location: location.trim() || defaultLocation,
      product: product || defaultProduct
    });

    setIsSubmitting(false);
    if (!res.success) {
      setError(res.error || 'Failed to submit review.');
    } else {
      setJustSubmitted(true);
      if (onSuccess) onSuccess(res.review);
    }
  };

  // If already reviewed or just submitted, show published card
  const displayedReview = existingReview || (justSubmitted ? reviews.find(r => r.orderId === order?.orderId) : null);

  if (displayedReview) {
    return (
      <div className="bg-[#12121c] border border-sakura-500/40 rounded-2xl p-5 text-left space-y-3 shadow-lg animate-in fade-in">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sakura-900/40 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < displayedReview.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} 
                />
              ))}
            </div>
            <span className="text-xs font-bold text-white">
              {displayedReview.rating}.0 / 5.0
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Verified Review Published
          </span>
        </div>

        <p className="text-sakura-200 text-xs sm:text-sm italic leading-relaxed">
          "{displayedReview.comment}"
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-sakura-900/30 text-[11px]">
          <div className="text-sakura-300/80">
            <span className="font-bold text-white">{displayedReview.author}</span>
            <span className="text-sakura-500 mx-1.5">•</span>
            <span>{displayedReview.location}</span>
            <span className="text-sakura-500 mx-1.5">•</span>
            <span className="text-sakura-400 font-medium">Item: {displayedReview.product}</span>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-[10px] font-bold text-sakura-400 hover:text-sakura-200 underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-sakura-400" />
            Live in Site Customer Reviews
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#12121c] border border-sakura-800/40 rounded-2xl p-5 text-left space-y-4 shadow-md">
      <div className="flex items-start justify-between gap-3 border-b border-sakura-900/40 pb-3">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-sakura-400" />
            {title}
          </h3>
          <p className="text-[11px] text-sakura-300/70 mt-0.5">
            {subtitle}
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-md shrink-0">
          Verified Buyer
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {/* Star Rating Selector */}
        <div>
          <label className="block text-sakura-200 font-bold mb-1.5">
            Your Rating <span className="text-sakura-400 text-[11px] font-normal">({ratingDescriptions[hoverRating || rating]})</span>
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((starVal) => {
              const isFilled = starVal <= (hoverRating || rating);
              return (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => setRating(starVal)}
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 rounded-lg hover:bg-sakura-950/60 transition-transform hover:scale-110 cursor-pointer"
                  title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                >
                  <Star 
                    className={`w-6 h-6 transition-colors ${
                      isFilled ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                    }`} 
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Name & Location fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sakura-300 font-semibold mb-1">
              Your Reviewer Name
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Jack M. or Collector99"
              required
              className="w-full px-3 py-2 rounded-xl bg-[#161624] border border-sakura-800/40 text-white text-xs focus:outline-none focus:ring-1 focus:ring-sakura-500"
            />
          </div>

          <div>
            <label className="block text-sakura-300 font-semibold mb-1">
              Location / City
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Melbourne, VIC"
              required
              className="w-full px-3 py-2 rounded-xl bg-[#161624] border border-sakura-800/40 text-white text-xs focus:outline-none focus:ring-1 focus:ring-sakura-500"
            />
          </div>
        </div>

        {/* Product selector if order had multiple items */}
        {order?.items && order.items.length > 1 && (
          <div>
            <label className="block text-sakura-300 font-semibold mb-1">
              Reviewed Collectible
            </label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#161624] border border-sakura-800/40 text-white text-xs focus:outline-none focus:ring-1 focus:ring-sakura-500"
            >
              <option value="Entire Order">Entire Order ({order.items.length} items)</option>
              {order.items.map((it, idx) => (
                <option key={idx} value={it.name}>
                  {it.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Review Comment Textarea */}
        <div>
          <label className="block text-sakura-200 font-bold mb-1">
            Review & Experience Feedback *
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience! e.g. Box arrived double-boxed in mint condition with fast Australia Post tracking. Authentic Japanese seals intact..."
            required
            className="w-full px-3 py-2.5 rounded-xl bg-[#161624] border border-sakura-800/40 text-white text-xs placeholder:text-sakura-300/40 focus:outline-none focus:ring-1 focus:ring-sakura-500"
          />
        </div>

        {error && (
          <p className="text-rose-400 text-[11px] font-semibold">{error}</p>
        )}

        {/* Submit Button */}
        <div className="pt-1 flex items-center justify-between">
          <span className="text-[10px] text-sakura-400/70">
            Reviews publish directly to the Sakura Supply verified reviews section.
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-sakura-600 hover:bg-sakura-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? 'Publishing...' : 'Publish Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
