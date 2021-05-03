const { Router } = require("express");
const router = Router();

const Playlist = require("../models/Playlist.model");
const fileUploader = require("../configs/cloudinary.config");

router.get("/create-playlist", (req, res) => {
  const { user } = req;
  res.status(200).render("playlists/create", { user });
});

router.post(
  "/create-playlist",
  fileUploader.single("imageUrl"),
  (req, res, next) => {
    const { name, theme, description, videoId, platform } = req.body;
    const { _id } = req.user;

    let imageUrl = "https://via.placeholder.com/150";
    let url = [];
  
    if (req.file) {
      const { path } = req.file;
      imageUrl = path;
    }

    if (Array.isArray(videoId) && Array.isArray(platform)) {
      platform.forEach((platformElement) => {
        videoId.forEach((videoElement) => {
          switch(platformElement){
            case 'youtube':
              url.push(`https://www.youtube.com/embed/${videoElement}`)
              break;
            case 'vimeo':
              url.push(`https://player.vimeo.com/video/${videoElement}`)
              break;
          }
        })
      })
    } else if(platform === "youtube"){
        url.push(`https://www.youtube.com/embed/${videoId}`)
      } else {
        url.push(`https://player.vimeo.com/video/${videoId}`)
      }
    
      const removedDupsUrl = [...new Set(url)]

     Playlist.create({ name, theme, description, imageUrl, url: removedDupsUrl, owner: _id })
     .then(dbPost => {
         res.redirect("/my-playlists");
       })
       .catch(err => console.log(`Err while adding playlist to the DB: ${err}`));
    }
);


router.get('/my-playlists', (req, res,) => {

  Playlist.find()
  .populate('owner') 
  .then((playlistResult) => {
    const currentUserPlaylist = []

    playlistResult.forEach(playlist => {
      if (playlist.owner.equals(req.user)) {
        currentUserPlaylist.push(playlist)
      }
    })
   
    res.status(200).render("playlists/my-playlists", { playlist: currentUserPlaylist, user: req.user });
  })
  .catch(err => console.log(`Err while getting the playlists from the DB: ${err}`));
});


router.get("/my-playlists/:playlistId", (req, res, next) => {
  const { playlistId } = req.params;

  Playlist.findById(playlistId)
    .then((playlistResult) => {
      res.status(200).render("playlists/details", { playlistResult, playlistId, user: req.user });
    })
    .catch(err => console.log(`Err while getting the playlists from the DB: ${err}`));
  });


router.get("/my-playlists/:playlistId/edit", (req, res, next) => {
  const { playlistId } = req.params;

  Playlist.findById(playlistId)
    .then((playlistResult) => {
    
      let videoData = [];
      for(let i = 0 ; i < playlistResult.url.length; i++){
        let element = playlistResult.url[i]
        if (element.includes('o/')) {
          const indexOfIDStart = element.indexOf('o/') + 2;
          const videoIdValue = element.slice(indexOfIDStart, element.length)
          videoData.push({id: videoIdValue, platform: 'Vimeo'})
        } else {
          const indexOfIDStart = element.indexOf('d/') + 2;
          const videoIdValue = element.slice(indexOfIDStart, element.length)
          videoData.push({id: videoIdValue, platform: 'YouTube'})
        }
      }
      res.status(200).render("playlists/edit-playlist", { playlistResult, videoData, user: req.user });
    })
    .catch((findErr) => next(findErr));
});

router.post(
  "/my-playlists/:playlistId/edit",
  fileUploader.single("imageUrl"),
  (req, res, next) => {
    const { playlistId } = req.params;
    const { name, theme, description, videoId, platform } = req.body;
    
     let url = [];
     let imageUrl = "https://via.placeholder.com/150";

     if (req.file) {
       const { path } = req.file;
       imageUrl = path;
     }

     if (Array.isArray(videoId) && Array.isArray(platform)) {
       platform.forEach((platformElement) => {
         videoId.forEach((videoElement) => {
           switch(platformElement){
             case 'YouTube':
               url.push(`https://www.youtube.com/embed/${videoElement}`)
               break;
             case 'Vimeo':
               url.push(`https://player.vimeo.com/video/${videoElement}`)
               break;
           }
         })
       })
     } else if(platform === "YouTube"){
         url.push(`https://www.youtube.com/embed/${videoId}`)
       } else {
         url.push(`https://player.vimeo.com/video/${videoId}`)
       }
    
       const removedDupsUrl = [...new Set(url)]

    Playlist.findByIdAndUpdate(playlistId, { name, theme, description, imageUrl, url: removedDupsUrl })
      .then((updatedPlaylist) => {
        res.redirect(`/my-playlists/${updatedPlaylist._id}`);
      })
      .catch((findUpdateErr) => next(findUpdateErr));
  }
);


router.post("/my-playlists/:playlistId/delete", (req, res, next) => {
  const { playlistId } = req.params;

  Playlist.findByIdAndDelete(playlistId)
    .then(() => {
      res.redirect("/my-playlists");
    })
    .catch((deleteErr) => {
      next(deleteErr);
    });
});

module.exports = router;
