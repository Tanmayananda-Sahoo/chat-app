const asyncHandler = (fn) => {
    return (req,res,next) => {
        Promise
        .resolve(fn(req,res,next))
        .catch((error) => {
            console.log('There is an error in async Handler file: ', error);
            next(error);
        })
    }
}

export {asyncHandler};