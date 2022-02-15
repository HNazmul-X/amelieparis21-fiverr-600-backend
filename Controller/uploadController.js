exports.uploadCardImage = (req, res, next) => {
    const imagePath = (img) => {
        return `/upload/card_img/${img}`;
    };
    try {
        console.log(req.files);
        res.json({
            backSide: imagePath(req.files["backSide"][0].filename),
            frontSide: imagePath(req.files["frontSide"][0].filename),
        });
    } catch (e) {
        next(e);
    }
};

("flacol carmina");