const Review = require('../models/review')
const User = require('../models/user')

const index = async (req, res) => {
    try {
        const review = await Review.find().populate('reviewer')
        res.render('reviews/index.ejs', {
            title: 'Reviews',
            reviews: review,
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const newReview = (req, res) => {
    res.render('reviews/new.ejs', {
        title: 'Add a Review'
    })
}

const createReview = async (req, res) => {
    try {
    
        req.body.reviewer =  req.params.userId
        // ( .session.user._id)
       
      
        await Review.create(req.body)
        res.redirect('/reviews')
    } catch (error) {
        console.log(error)

    }
}

const show = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId).populate('reviewer');
        console.log(review);
        console.log("SESSION", req.session.user._id)
        res.render('reviews/show.ejs', {
            title:review.title, 
            review,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId) // find the listing

        if (review.reviewer.equals(req.params.userId)) { // check if signed in user and listing owner are the same
            await review.deleteOne() // delete the listing
            res.redirect('/reviews')
        } else {
            res.send("You don't have permission to do that.") // if owner and signed in user are different - send message
        }

    } catch(error) {
        console.log(error)
        res.redirect('/')
    }
}

const edit = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId).populate('reviewer')
        if(review.reviewer.equals(req.params.userId)) {
            res.render('reviews/edit.ejs', {
                title: `Edit ${review.tittel}`,
                review
            })
        } else {
            res.send("You don't have permission to do that.") // if owner and signed in user are different - send message
        }
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const update = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.reviewId,
            req.body,
            { new: true }
        )
        res.redirect(`/reviews/${review._id}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}





    


module.exports = {
    index,
    newReview,
    createReview,
    show,
    deleteReview,
    edit,
    update,
   
}
