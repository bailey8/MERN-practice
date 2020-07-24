const passport = require("passport");

module.exports = (app) => {
  // The 'google' string is just an internal identifier used by the google strategy
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  // Passport will handle the exchange (auth code for access token with the authorization server)
  app.get("/auth/google/callback", passport.authenticate("google"));

  // --- This inspects the current user ----------
  app.get("/api/current_user", (req, res) => {
    
    res.send(req.user);  //  res.send(req.session) 
  });

    // --- Logs user out -------------------------
    app.get("/api/logout", (req, res) => {
        req.logout()
        res.send(req.user)
      });
};
