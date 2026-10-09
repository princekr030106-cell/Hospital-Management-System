const catchAsyncErrors=require('../middlewares/catchAsyncErrors')
const ErrorHandler=require('../middlewares/errorMiddleware')
const User=require('../models/userSchema')
const jwt=require('jsonwebtoken')


 const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) {
    return next(new ErrorHandler("Admin is not authenticated!", 400));
  }
  

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  

  req.user = await User.findById(decoded.id);
  if (!req.user) {
    return next(new ErrorHandler("Admin account no longer exists!", 401));
  }
  
  
  if (req.user.role !== "Admin") {
    return next(
      new ErrorHandler(
        `${req.user.role} not authorized for this resource!`,
        403
      )
    );
  }
  next();
});


 const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
      return next(new ErrorHandler("Patient is not authenticated!", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorHandler("Patient account no longer exists!", 401));
    }
    if (req.user.role !== "Patient") {
      return next(
        new ErrorHandler(
          `${req.user.role} not authorized for this resource!`,
          403
        )
      );
    }
    next();
  }
);



 const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource!`
        )
      );
    }
    next();
  };
};
module.exports={
  isAdminAuthenticated,
  isPatientAuthenticated,
  isAuthorized
};