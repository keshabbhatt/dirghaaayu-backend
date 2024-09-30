// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
    const isAdmin = req.headers['is-admin'] === 'true';
    if (isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Admins only" });
    }
  };
  